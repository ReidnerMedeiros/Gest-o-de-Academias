const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Buscar todos os membros
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('membros').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Buscar membro pelo email
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from('membros')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return res.status(404).json({ error: 'Membro não encontrado.' });
  res.json(data);
});

// Adicionar membro
router.post('/', async (req, res) => {
  const { nome, idade, sexo, email, telefone } = req.body;
  const { data, error } = await supabase
    .from('membros')
    .insert([{ nome, idade, sexo, email, telefone }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Atualizar membro
router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { nome, idade, sexo, telefone } = req.body;
  const { data, error } = await supabase
    .from('membros')
    .update({ nome, idade, sexo, telefone })
    .eq('email', email);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Remover membro
router.delete('/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase
    .from('membros')
    .delete()
    .eq('email', email);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
