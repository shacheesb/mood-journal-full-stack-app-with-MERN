const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cors(corsOptions));
app.use(express.json());




// Schema
const Mood = mongoose.model('Mood', new mongoose.Schema({
  mood: String,
  note: String,
  quote: String,
  date: { type: Date, default: Date.now }
}));

// Fetch quote
async function fetchQuote() {
  try {
    const res = await axios.get('https://zenquotes.io/api/random');
    return res.data[0]?.q || "You're doing great!";
  } catch {
    return "Stay positive!";
  }
}

// API routes
app.get('/api/moods', async (req, res) => {
  const moods = await Mood.find().sort({ date: -1 });
  res.json(moods);
});

app.post('/api/moods', async (req, res) => {
  console.log('📥 Incoming POST request:', req.body); 

  const { mood, note } = req.body;
  const quote = await fetchQuote();
  const moodEntry = await Mood.create({ mood, note, quote });
  res.json(moodEntry);
});


// Connect to MongoDB and run server
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('✅ Server running on http://localhost:5000')))
  .catch(err => console.error('❌ MongoDB connection failed:', err));
