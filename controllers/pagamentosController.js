const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Listar todos os pagamentos com informações do membro
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('pagamentos')
    .select(`
      id,
      membro_id,
      forma_pagamento,
      valor,
      data_pagamento,
      membros (nome, idade, sexo, email)
    `);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Adicionar novo pagamento
router.post('/', async (req, res) => {
  const { membro_id, forma_pagamento, valor } = req.body;

  if (!membro_id || !forma_pagamento || !valor) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  const { data, error } = await supabase
    .from('pagamentos')
    .insert([{ membro_id, forma_pagamento, valor }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Remover pagamento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('pagamentos')
    .delete()
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  if (!data.length) return res.status(404).json({ error: 'Pagamento não encontrado.' });
  res.json({ message: 'Pagamento removido com sucesso.' });
});

module.exports = router;
