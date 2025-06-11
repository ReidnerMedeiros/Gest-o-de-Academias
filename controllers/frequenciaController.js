const express = require('express');
const router = express.Router();

// Simulação de banco (você pode trocar por banco real como MongoDB, PostgreSQL, etc)
let registrosDeFrequencia = [];

router.post('/frequencia', (req, res) => {
  const lista = req.body;

  if (!Array.isArray(lista)) {
    return res.status(400).json({ error: 'Formato inválido' });
  }

  lista.forEach(registro => {
    registrosDeFrequencia.push({
      nome: registro.nome,
      horario: registro.horario,
      presente: registro.presente,
      data: new Date().toISOString().slice(0, 10)
    });
  });

  console.log('Presenças registradas:', registrosDeFrequencia);
  res.status(200).json({ mensagem: 'Frequência registrada com sucesso!' });
});

module.exports = router;
