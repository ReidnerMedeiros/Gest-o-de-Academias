const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Buscar todos os eventos
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .order('data', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Buscar eventos por data (YYYY-MM-DD)
router.get('/:data', async (req, res) => {
  const { data } = req.params;
  const { data: eventos, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('data', data);

  if (error) return res.status(500).json({ error: error.message });
  res.json(eventos);
});

// Adicionar evento
router.post('/', async (req, res) => {
  const { data, titulo, horario } = req.body;
  const { data: result, error } = await supabase
    .from('eventos')
    .insert([{ data, titulo, horario }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json(result);
});

// Atualizar evento por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, titulo, horario } = req.body;

  const { data: result, error } = await supabase
    .from('eventos')
    .update({ data, titulo, horario })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(result);
});

// Remover evento por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('eventos')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
