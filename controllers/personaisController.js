const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const tabela = 'personais';

// Buscar todos os personais
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from(tabela).select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Buscar personal pelo email
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from(tabela)
    .select('*')
    .eq('email', email)
    .single();

  if (error) return res.status(404).json({ error: 'Personal não encontrado.' });
  res.json(data);
});

// Adicionar personal
router.post('/', async (req, res) => {
  const { nome, idade, sexo, email, modalidade, horarios } = req.body;
  const { data, error } = await supabase
    .from(tabela)
    .insert([{ nome, idade, sexo, email, modalidade, horarios }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Atualizar personal
router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { nome, idade, sexo, modalidade, horarios } = req.body;
  const { data, error } = await supabase
    .from(tabela)
    .update({ nome, idade, sexo, modalidade, horarios })
    .eq('email', email);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Remover personal
router.delete('/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from(tabela)
    .delete()
    .eq('email', email);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
