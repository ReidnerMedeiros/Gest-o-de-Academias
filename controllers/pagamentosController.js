const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Buscar todos os pagamentos
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('pagamentos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Buscar pagamento por e-mail
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from('pagamentos')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return res.status(404).json({ error: 'Pagamento não encontrado.' });
  res.json(data);
});

// Adicionar pagamento
router.post('/', async (req, res) => {
  const { nome, idade, sexo, email, tipoPagamento, valor, foto } = req.body;
  const { data, error } = await supabase
    .from('pagamentos')
    .insert([{ nome, idade, sexo, email, tipoPagamento, valor, foto }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Atualizar pagamento
router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { nome, idade, sexo, tipoPagamento, valor, foto } = req.body;

  const { data, error } = await supabase
    .from('pagamentos')
    .update({ nome, idade, sexo, tipoPagamento, valor, foto })
    .eq('email', email);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Remover pagamento
router.delete('/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from('pagamentos')
    .delete()
    .eq('email', email);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
