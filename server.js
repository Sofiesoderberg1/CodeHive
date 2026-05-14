import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// ================= DB =================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// ================= MODELS =================

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  message: String,
  developer: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const chatSchema = new mongoose.Schema({
  bookingId: String,
  from: String,
  to: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Booking = mongoose.model('Booking', bookingSchema)
const Chat = mongoose.model('Chat', chatSchema)

// ================= AUTH =================

/**
 * Verifies JWT token from request headers.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function verifyToken (req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.sendStatus(403)
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    next()
  } catch {
    res.sendStatus(403)
  }
}

// ================= ROUTES =================

// ---------- ADMIN BOOKINGS ----------

app.get('/bookings', verifyToken, async (req, res) => {
  const bookings = await Booking.find()

  res.json(bookings)
})

// ---------- CREATE BOOKING ----------

app.post('/booking', async (req, res) => {
  try {
    const booking = new Booking(req.body)

    await booking.save()

    res.json({
      message: 'Booking saved'
    })
  } catch {
    res.status(500).json({
      error: 'Failed to save booking'
    })
  }
})

// ---------- ADMIN LOGIN ----------

app.post('/login', (req, res) => {
  if (req.body.password !== '1234') {
    return res.status(401).json({
      error: 'Wrong password'
    })
  }

  const token = jwt.sign(
    {
      id: 'admin',
      role: 'admin'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  res.json({ token })
})

// ---------- CHAT LOGIN ----------

app.post('/chat-login', (req, res) => {
  const token = jwt.sign(
    {
      id: 'user',
      role: 'user'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  )

  res.json({
    token,
    userId: 'user'
  })
})

// ---------- LOAD MESSAGES ----------
app.get('/messages/:user', verifyToken, async (req, res) => {
  const requestedUser = req.params.user
  const currentUser = req.user.id

  // User can only access own chats
  if (
    currentUser !== requestedUser &&
    req.user.role !== 'admin'
  ) {
    return res.sendStatus(403)
  }

  const messages = await Chat.find({
    $or: [
      {
        from: currentUser,
        to: requestedUser
      },
      {
        from: requestedUser,
        to: currentUser
      }
    ]
  }).sort({ createdAt: 1 })

  res.json(messages)
})

// ================= STATIC =================

app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist', 'index.html')
  )
})

// ================= SOCKET =================

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

// ---------- SOCKET AUTH ----------

io.use((socket, next) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(
      new Error('Authentication error')
    )
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    socket.user = decoded

    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.id)

  // Join private room
  socket.join(socket.user.id)

  // ================= SEND MESSAGE =================

  socket.on('sendMessage', async (data) => {
    console.log('MESSAGE RECEIVED:', data)
    console.log('FROM:', socket.user.id)
    const chat = new Chat({
      from: socket.user.id,
      to: data.to,
      message: data.message
    })

    await chat.save()

    // Send only to private rooms
    io.to(data.to).emit(
      'receiveMessage',
      chat
    )

    io.to(socket.user.id).emit(
      'receiveMessage',
      chat
    )
  })

  // ================= TYPING =================

  socket.on('typing', (user) => {
    socket.broadcast.emit(
      'showTyping',
      user
    )
  })

  // ================= DISCONNECT =================

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// ================= START =================

const PORT = process.env.PORT || 3000

server.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  )
})
