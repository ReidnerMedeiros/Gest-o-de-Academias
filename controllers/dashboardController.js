const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.get('/stats', async (req, res) => {
    try {
        // Total de membros cadastrados
        const { count: totalMembros } = await supabase
            .from('membros')
            .select('*', { count: 'exact', head: true });

        // Novos membros nos últimos 30 dias
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
        const { count: novosMembros } = await supabase
            .from('membros')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', trintaDiasAtras.toISOString());

        // Membros ativos (mesmo total)
        const membrosAtivos = totalMembros;

        // Pagamentos do mês
        const { data: pagamentos } = await supabase
            .from('pagamentos')
            .select('valor, data_pagamento');
        const mesAtual = new Date().getMonth();
        const anoAtual = new Date().getFullYear();
        const receitaMes = pagamentos
            .filter(p => {
                const d = new Date(p.data_pagamento);
                return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
            })
            .reduce((soma, p) => soma + Number(p.valor), 0);

        const receitaTotal = pagamentos.reduce((soma, p) => soma + Number(p.valor), 0);
        const mensalidadesPagas = pagamentos.filter(p => {
            const d = new Date(p.data_pagamento);
            return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
        }).length;

        // Status de pagamento dos membros
        const { data: membrosStatus } = await supabase
            .from('membros')
            .select('status_pagamento');

        const pagos = membrosStatus.filter(m => m.status_pagamento === 'Pago').length;
        const pendentes = membrosStatus.filter(m => m.status_pagamento === 'Pendente').length;

        res.json({
            totalMembros,
            novosMembros,
            membrosAtivos,
            receitaMes,
            receitaTotal,
            mensalidadesPagas,
            pagos,
            pendentes
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

router.get('/horarios', async (req, res) => {
    try {
        // Busca todas as frequências com presenca = true
        const { data, error } = await supabase
            .from('frequencias')
            .select('horario, presenca')
            .eq('presenca', true);

        if (error) {
            console.error('Erro ao buscar frequências:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar frequências' });
        }

        // Conta as presenças por horário
        const horarios = {
            Manhã: 0,
            Tarde: 0,
            Noite: 0
        };

        data.forEach(f => {
            if (horarios[f.horario] !== undefined) {
                horarios[f.horario]++;
            }
        });

        res.json(horarios);
    } catch (err) {
        console.error('Erro no servidor ao processar horários:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

router.get('/frequencias-semana', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('frequencias')
      .select('data_aula, presenca')
      .eq('presenca', true);

    if (error) {
      console.error('Erro ao buscar frequências:', error.message);
      return res.status(500).json({ error: 'Erro ao buscar frequências' });
    }

    // Inicializa o contador dos dias da semana: 0 (Dom) até 6 (Sáb)
    const frequenciasPorDia = [0,0,0,0,0,0,0];

    data.forEach(item => {
      const diaSemana = new Date(item.data_aula).getDay(); // 0-6, domingo a sábado
      frequenciasPorDia[diaSemana]++;
    });

    // Retornar com labels úteis, começando de segunda (índice 1)
    const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Retorna objeto com label e quantidade
    const resultado = labels.map((label, idx) => ({
      dia: label,
      frequencia: frequenciasPorDia[idx] || 0
    }));

    res.json(resultado);
  } catch (err) {
    console.error('Erro no servidor ao processar frequências da semana:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;
