const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// Simulated local database (replace with an actual database)
const games = [
  { id: 1, name: 'Game 1' },
  { id: 2, name: 'Game 2' },
  { id: 3, name: 'Game 3' },
];

// GET /games - Get all games
app.get('/games', (req, res) => {
  res.json(games);
});

// GET /games/:id - Get one game by ID
app.get('/games/:id', (req, res) => {
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
  const newGame = req.body;
  newGame.id = games.length + 1;
  games.push(newGame);
  res.status(201).json(newGame);
});

// DELETE /games/:id - Delete a game by ID
app.delete('/games/:id', (req, res) => {
  const gameId = parseInt(req.params.id);
  const index = games.findIndex((g) => g.id === gameId);

  if (index === -1) {
    res.status(404).json({ error: 'Game not found' });
  } else {
    games.splice(index, 1);
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
