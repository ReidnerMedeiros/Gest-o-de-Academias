const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Buscar todos os eventos
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('eventos')
    .select(`
      *,
      membros ( nome ),
      personais ( nome )
    `)
    .order('data', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  // Mapear para deixar os nomes no root do objeto
  const mapped = data.map(ev => ({
    ...ev,
    membro_nome: ev.membros?.nome,
    personal_nome: ev.personais?.nome
  }));

  res.json(mapped);
});

// Adicionar evento
router.post('/', async (req, res) => {
  const { data, titulo, horario, membro_id, personal_id } = req.body;
  const { data: result, error } = await supabase
    .from('eventos')
    .insert([{ data, titulo, horario, membro_id, personal_id }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json(result);
});

// Atualizar evento
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data: dateVal, titulo, horario, membro_id, personal_id } = req.body;

  const { data, error } = await supabase
    .from('eventos')
    .update({ data: dateVal, titulo, horario, membro_id, personal_id })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Remover evento
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
