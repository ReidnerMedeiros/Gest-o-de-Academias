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

module.exports = router;
