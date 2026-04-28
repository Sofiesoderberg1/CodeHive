import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('Server is running');
});

// BOOKING ROUTE
app.post('/booking', (req, res) => {
  const { name, email, date, message } = req.body;

  console.log("NEW BOOKING:");
  console.log(name, email, date, message);

  res.json({ message: 'Booking saved' });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});