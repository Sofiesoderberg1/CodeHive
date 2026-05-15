import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
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

// ================= STATIC =================

app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, 'dist', 'index.html')
  )
})

// ================= START =================

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  )
})
