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

// Routes
app.get('/getData', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }); // Sort scores in descending order
    res.json(scores);
  } catch (error) {
    res.status(500).send('Error retrieving data');
  }
});

app.post('/postData', async (req, res) => {
  try {
    const { name, score } = req.body;
    const newScore = new Score({ name, score });
    await newScore.save();
    res.json({ message: 'Score saved successfully' });
  } catch (error) {
    res.status(500).send('Error saving score');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
