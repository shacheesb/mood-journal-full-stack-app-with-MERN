import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

const [mood, setMood] = useState('');
const [note, setNote] = useState('');
const [entries, setEntries] = useState([]);

// Load past moods
useEffect(() => {
  axios.get('http://localhost:5000/api/moods', { withCredentials: true })
    .then(res => setEntries(res.data))
    .catch(err => console.error("GET error:", err));
}, []);


const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("🧠 Submitting:", mood, note);

  try {
    const res = await axios.post('http://localhost:5000/api/moods', { mood, note },{ withCredentials: true } );

    console.log("✅ Saved:", res.data);
    setEntries([res.data, ...entries]);
    setMood('');
    setNote('');
  } catch (err) {
    console.error("❌ POST error:", err);
  }
};


  return (
  <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
    <h1>Mood Journal 🌱</h1>

    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
  <select
    value={mood}
    onChange={(e) => setMood(e.target.value)}
    required
  >
    <option value="">How do you feel?</option>
    <option value="Happy">😊 Happy</option>
    <option value="Sad">😢 Sad</option>
    <option value="Stressed">😖 Stressed</option>
    <option value="Relaxed">😌 Relaxed</option>
  </select>

  <input
    type="text"
    placeholder="Write a short note..."
    value={note}
    onChange={(e) => setNote(e.target.value)}
    required
    style={{ marginLeft: '1rem', width: '300px' }}
  />

  <button type="submit" style={{ marginLeft: '1rem' }}>
    Save
  </button>
</form>


    <h2>Past Entries</h2>
  </div>
);

}

export default App;
