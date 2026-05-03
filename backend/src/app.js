const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const resultRoutes = require('./routes/resultRoutes');
const flashcardRoutes = require('./routes/flashcardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/flashcards', flashcardRoutes);

module.exports = app;

console.log({
  userRoutes,
  examRoutes,
  resultRoutes,
  flashcardRoutes
});