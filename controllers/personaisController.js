const express = require('express');
const supabase = require('../services/supabaseClient');

const router = express.Router();
const tabela = 'personais';

// Listar todos os personais
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from(tabela).select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Buscar personal por email
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  const { data, error } = await supabase.from(tabela).select('*').eq('email', email).single();
  if (error) return res.status(404).json({ error: 'Personal não encontrado' });
  res.json(data);
});

// Adicionar personal
router.post('/', async (req, res) => {
  const { nome, idade, sexo, email, modalidade, horarios } = req.body;

  if (!nome || !idade || !sexo || !email || !modalidade || !horarios) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const { data: existing } = await supabase.from(tabela).select('*').eq('email', email).single();
  if (existing) return res.status(400).json({ error: 'Email já cadastrado.' });

  const { data, error } = await supabase.from(tabela).insert([{ nome, idade, sexo, email, modalidade, horarios }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Atualizar personal
router.put('/:email', async (req, res) => {
  const { email } = req.params;
  const { nome, idade, sexo, modalidade, horarios } = req.body;

  const { data: personalExist } = await supabase.from(tabela).select('*').eq('email', email).single();
  if (!personalExist) return res.status(404).json({ error: 'Personal não encontrado' });

  const updates = {};
  if (nome) updates.nome = nome;
  if (idade) updates.idade = idade;
  if (sexo) updates.sexo = sexo;
  if (modalidade) updates.modalidade = modalidade;
  if (horarios) updates.horarios = horarios;

  const { data, error } = await supabase.from(tabela).update(updates).eq('email', email);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Remover personal
router.delete('/:email', async (req, res) => {
  const { email } = req.params;

  const { data: personalExist } = await supabase.from(tabela).select('*').eq('email', email).single();
  if (!personalExist) return res.status(404).json({ error: 'Personal não encontrado' });

  const { error } = await supabase.from(tabela).delete().eq('email', email);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

module.exports = router;
