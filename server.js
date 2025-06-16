// server.js (versão unificada de app.js + server.js)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importações de rotas/controllers

const authRoutes = require('./routes/auth');
const membrosController = require('./controllers/membrosController');
const personaisController = require('./controllers/personaisController');
const pagamentosController = require('./controllers/pagamentosController');
const calendarioController = require('./controllers/calendarioController');
const frequenciaController = require('./controllers/frequenciaController');

// Instância do app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/membros', membrosController);
app.use('/api/personais', personaisController);
app.use('/api/pagamentos', pagamentosController);
app.use('/api/eventos', calendarioController);
app.use('/api/frequencia', frequenciaController);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Fitness funcionando!');
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
