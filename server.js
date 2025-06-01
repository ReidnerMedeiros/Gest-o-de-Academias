const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const membrosController = require('./controllers/membrosController');
const personaisController = require('./controllers/personaisController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas membros (como já está funcionando)
app.use('/api/membros', membrosController);
app.use('/api/personais', personaisController);


app.get('/', (req, res) => {
  res.send('API Fitness funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
