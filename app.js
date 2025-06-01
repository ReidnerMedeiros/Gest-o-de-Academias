require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json()); // Permite receber JSON

app.use('/api/auth', authRoutes); // Rotas de autenticação

// Rota de teste
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

module.exports = app;
