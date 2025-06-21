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
const dashboardController = require('./controllers/dashboardController');


// Instância do app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'view')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/membros', membrosController);
app.use('/api/personais', personaisController);
app.use('/api/pagamentos', pagamentosController);
app.use('/api/eventos', calendarioController);
app.use('/api/frequencia', frequenciaController);
app.use('/api/dashboard', dashboardController);


// Rota para a tela inicial

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
