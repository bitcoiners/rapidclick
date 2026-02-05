const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// File paths
const DATA_DIR = path.join(__dirname, 'data');
const SCORES_FILE = path.join(DATA_DIR, 'scores.json');

// Initialize scores file
function initializeScoresFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(SCORES_FILE)) {
      const defaultData = { score: 0, date: null };
      fs.writeFileSync(SCORES_FILE, JSON.stringify(defaultData, null, 2));
      console.log('Created scores.json with default values');
    }
  } catch (error) {
    console.error('Error initializing scores file:', error);
  }
}

// Read scores from file
function readScores() {
  try {
    const data = fs.readFileSync(SCORES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading scores:', error);
    return { score: 0, date: null };
  }
}

// Write scores to file
function writeScores(scoreData) {
  try {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scoreData, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing scores:', error);
    return false;
  }
}

// GET /api/highscore - Retrieve current high score
app.get('/api/highscore', (req, res) => {
  try {
    const scores = readScores();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read high score' });
  }
});

// POST /api/score - Submit new score
app.post('/api/score', (req, res) => {
  try {
    const { score } = req.body;
    
    // Validate input
    if (typeof score !== 'number' || score < 0 || !Number.isFinite(score)) {
      return res.status(400).json({ error: 'Invalid score value' });
    }
    
    // Read current high score
    const currentScores = readScores();
    const currentHighScore = currentScores.score || 0;
    
    // Check if new high score
    let isNewHighScore = false;
    let highScore = currentHighScore;
    
    if (score > currentHighScore) {
      isNewHighScore = true;
      highScore = score;
      
      const newScoreData = {
        score: score,
        date: new Date().toISOString()
      };
      
      const writeSuccess = writeScores(newScoreData);
      
      if (!writeSuccess) {
        return res.status(500).json({ error: 'Failed to update score' });
      }
    }
    
    res.json({
      isNewHighScore: isNewHighScore,
      highScore: highScore,
      submittedScore: score
    });
    
  } catch (error) {
    console.error('Error processing score:', error);
    res.status(500).json({ error: 'Failed to process score' });
  }
});

// Initialize and start server
initializeScoresFile();

app.listen(PORT, () => {
  console.log(`RapidClick server running on http://localhost:${PORT}`);
});
