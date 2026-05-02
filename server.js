import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import http from 'http'
import { Server } from 'socket.io'

const app = express()

app.use(cors())
app.use(express.json())

// ================= DB =================

mongoose.connect('mongodb://127.0.0.1:27017/codehive')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// ================= MODELS =================

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
})

const chatSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
})

const Booking = mongoose.model('Booking', bookingSchema)
const Chat = mongoose.model('Chat', chatSchema)

// ================= ROUTES =================

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.get('/bookings', verifyToken, async (req, res) => {
  const bookings = await Booking.find()
  res.json(bookings)
})

app.post('/booking', async (req, res) => {
  try {
    const booking = new Booking(req.body)
    await booking.save()
    res.json({ message: 'Booking saved' })
  } catch {
    res.status(500).json({ error: 'Failed to save booking' })
  }
})

app.post('/login', (req, res) => {
  if (req.body.password !== '1234') {
    return res.status(401).json({ error: 'Wrong password' })
  }

  const token = jwt.sign({ role: 'admin' }, 'secretkey')
  res.json({ token })
})

function verifyToken (req, res, next) {
  const token = req.headers['authorization']
  if (!token) return res.sendStatus(403)

  try {
    jwt.verify(token, 'secretkey')
    next()
  } catch {
    res.sendStatus(403)
  }
}

// ================= SOCKET =================

const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: '*' }
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('sendMessage', async (data) => {
    const chat = new Chat(data)
    await chat.save()

    io.emit('receiveMessage', chat)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// ================= START =================

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
