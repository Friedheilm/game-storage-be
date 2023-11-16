const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Node.js module for file system operations

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const filePath = 'games.json'; // Path to JSON file that plays the role of local database

// Read data from the JSON file
function readDataFromFile() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return [];
  }
}

// Write data to the JSON file
function writeDataToFile(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
}

// GET /games - Get all games
app.get('/games', (req, res) => {
  const games = readDataFromFile(); // Read games from the JSON file
  res.json(games);
});

// GET /games/:id - Get one game by ID
app.get('/games/:id', (req, res) => {
  const games = readDataFromFile(); // Read games from the JSON file
  const gameId = parseInt(req.params.id);
  const game = games.find((g) => g.id === gameId);

  if (!game) {
    res.status(404).json({ error: 'Game not found' });
  } else {
    res.json(game);
  }
});

// POST /games - Add a new game
app.post('/games', (req, res) => {
  const games = readDataFromFile(); // Read games from the JSON file
  // Find the maximum ID in the existing games
  const maxId = games.reduce((max, game) => (game.id > max ? game.id : max), 0);
  const newGame = req.body;
  newGame.id = maxId + 1; // Generate a new ID
  games.push(newGame);
  writeDataToFile(games);
  res.status(201).json(newGame);
});

// DELETE /games/:id - Delete a game by ID
app.delete('/games/:id', (req, res) => {
  const games = readDataFromFile(); // Read games from the JSON file
  const gameId = parseInt(req.params.id);
  const index = games.findIndex((g) => g.id === gameId);

  if (index === -1) {
    res.status(404).json({ error: 'Game not found' });
  } else {
    games.splice(index, 1);
    writeDataToFile(games); // Write updated games to the JSON file
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
