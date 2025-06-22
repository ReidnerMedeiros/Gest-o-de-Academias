const express = require('express');
const { login, registrar, alterarSenha } = require('../controllers/AuthController');

const router = express.Router();

router.post('/login', login);
router.post('/registrar', registrar);
router.post('/alterar-senha', alterarSenha);

module.exports = router;
