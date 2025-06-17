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

        // Novos membros no mês atual
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        const { count: novosMembros } = await supabase
            .from('membros')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', inicioMes.toISOString());

        // Membros ativos (exemplo: todos cadastrados, pode ajustar critério)
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

        // Receita total
        const receitaTotal = pagamentos.reduce((soma, p) => soma + Number(p.valor), 0);

        // Mensalidades pagas (pagamentos do mês)
        const mensalidadesPagas = pagamentos.filter(p => {
            const d = new Date(p.data_pagamento);
            return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
        }).length;

        res.json({
            totalMembros,
            novosMembros,
            membrosAtivos,
            receitaMes,
            receitaTotal,
            mensalidadesPagas
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

module.exports = router; 