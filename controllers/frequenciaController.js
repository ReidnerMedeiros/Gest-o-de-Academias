const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);


router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('frequencias')
      .select(`
        id,
        modalidade,
        horario,
        data_aula,
        presenca,
        membros (nome),
        personais (nome)
      `)
      .order('data_aula', { ascending: false });

    if (error) {
      console.error('Erro Supabase (GET):', error);
      return res.status(500).json({ error: error.message });
    }

    const resultado = data.map(f => ({
      id: f.id,
      aluno: f.membros?.nome || 'Desconhecido',
      personal: f.personais?.nome || 'Desconhecido',
      modalidade: f.modalidade,
      horario: f.horario,
      data: f.data_aula,
      presente: f.presenca,
    }));

    res.json(resultado);
  } catch (err) {
    console.error('Erro geral (GET):', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { presenca } = req.body;

  console.log('Body recebido no PUT:', req.body);

  if (typeof presenca !== 'boolean') {
    return res.status(400).json({ error: 'Campo "presenca" deve ser booleano' });
  }

  try {
    const { data, error } = await supabase
      .from('frequencias')
      .update({ presenca })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar presença (PUT):', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || !data.length) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    res.json({ mensagem: 'Presença atualizada com sucesso', data: data[0] });
  } catch (err) {
    console.error('Erro interno no servidor (PUT):', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;
