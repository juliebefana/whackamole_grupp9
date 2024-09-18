const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI
const mongoURI = 'mongodb+srv://mattiashummer:t3S695sX2QB4XGwE@cluster0.y5yh9uz.mongodb.net/Whack-a-mole';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a schema and model for scores
const scoreSchema = new mongoose.Schema({
  name: String,
  score: Number
});
const Score = mongoose.model('Score', scoreSchema);

// Get top 10 scores
app.get('/getData', async (req, res) => {
  try {
    const topScores = await Score.find().sort({ score: -1 }).limit(10); // Sort by score descending and limit to 10
    res.json(topScores);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Post a new score
app.post('/postData', async (req, res) => {
  const { name, score } = req.body;
  try {
    const newScore = new Score({ name, score });
    await newScore.save();
    res.json({ message: 'Score saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

