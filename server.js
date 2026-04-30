import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/codehive')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
})

const Booking = mongoose.model('Booking', bookingSchema)

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Server is running')
})

app.get('/bookings',verifyToken, async (req, res) => {
  const bookings = await Booking.find()
  res.json(bookings)
})

// BOOKING ROUTE
app.post('/booking', async (req, res) => {
  try {
    const { name, email, date, message } = req.body

    const booking = new Booking({ name, email, date, message })
    await booking.save()

    console.log('Saved to DB:', booking)

    res.json({ message: 'Booking saved' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save booking' })
  }
})

app.post('/login', (req, res) => {
  const { password } = req.body

  if (password !== '1234') {
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

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
