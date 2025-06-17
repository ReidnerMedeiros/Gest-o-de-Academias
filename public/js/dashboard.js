// Gráfico de Horários
const horariosCtx = document.getElementById('horariosChart').getContext('2d');
new Chart(horariosCtx, {
    type: 'doughnut',
    data: {
        labels: ['Manhã', 'Tarde', 'Noite'],
        datasets: [{
            data: [20, 35, 45],
            backgroundColor: ['#fbb034', '#ff6b35', '#2d3748'],
            borderWidth: 0,
            cutout: '75%'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            }
        }
    }
});

// Gráfico de Frequência
const frequenciaCtx = document.getElementById('frequenciaChart').getContext('2d');
new Chart(frequenciaCtx, {
    type: 'bar',
    data: {
        labels: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
        datasets: [{
            label: 'Alunos',
            data: [20, 35, 40, 25, 45, 40, 15],
            backgroundColor: '#ff6b35',
            borderRadius: 6,
            borderSkipped: false,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 60,
                ticks: {
                    stepSize: 20,
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: '#f1f2f7'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            }
        }
    }
});

let calendarioData = {
    mes: new Date().getMonth(),
    ano: new Date().getFullYear(),
    diaSelecionado: new Date().getDate(),
};

function gerarGridCalendario() {
    const { mes, ano, diaSelecionado } = calendarioData;
    const hoje = new Date();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaPrimeiro = primeiroDia.getDay();
    const grid = [];

    // Dias do mês anterior para preencher o início
    const diasMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = diaSemanaPrimeiro - 1; i >= 0; i--) {
        grid.push({
            dia: diasMesAnterior - i,
            outroMes: true
        });
    }
    // Dias do mês atual
    for (let d = 1; d <= diasNoMes; d++) {
        grid.push({
            dia: d,
            outroMes: false
        });
    }
    // Dias do próximo mês para completar 6 linhas
    while (grid.length % 7 !== 0) {
        grid.push({
            dia: grid.length - diasNoMes - diaSemanaPrimeiro + 1,
            outroMes: true
        });
    }

    // Renderizar grid (sem sobrescrever os dias da semana)
    const gridDiv = document.querySelector('.calendar-grid');
    // Remove apenas os dias do mês anterior (calendar-day), mantendo os dias da semana
    Array.from(gridDiv.querySelectorAll('.calendar-day, .calendar-day.other-month')).forEach(el => el.remove());
    grid.forEach((info, idx) => {
        const el = document.createElement('div');
        el.className = 'calendar-day' + (info.outroMes ? ' other-month' : '');
        if (!info.outroMes && info.dia === diaSelecionado) el.classList.add('selected-range');
        if (!info.outroMes && info.dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) el.classList.add('today');
        el.textContent = info.dia;
        if (!info.outroMes) {
            el.style.cursor = 'pointer';
            el.onclick = () => {
                calendarioData.diaSelecionado = info.dia;
                gerarGridCalendario();
                carregarEventosDoMes();
            };
        }
        gridDiv.appendChild(el);
    });
}

function atualizarTituloMes() {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.querySelector('.current-month').innerText = `${meses[calendarioData.mes]} ${calendarioData.ano}`;
}

function previousMonth() {
    calendarioData.mes--;
    if (calendarioData.mes < 0) {
        calendarioData.mes = 11;
        calendarioData.ano--;
    }
    const hoje = new Date();
    if (calendarioData.mes === hoje.getMonth() && calendarioData.ano === hoje.getFullYear()) {
        calendarioData.diaSelecionado = hoje.getDate();
    } else {
        calendarioData.diaSelecionado = 1;
    }
    gerarGridCalendario();
    atualizarTituloMes();
    carregarEventosDoMes();
}

function nextMonth() {
    calendarioData.mes++;
    if (calendarioData.mes > 11) {
        calendarioData.mes = 0;
        calendarioData.ano++;
    }
    const hoje = new Date();
    if (calendarioData.mes === hoje.getMonth() && calendarioData.ano === hoje.getFullYear()) {
        calendarioData.diaSelecionado = hoje.getDate();
    } else {
        calendarioData.diaSelecionado = 1;
    }
    gerarGridCalendario();
    atualizarTituloMes();
    carregarEventosDoMes();
}

async function carregarEventosDoMes() {
    const { mes, ano } = calendarioData;
    try {
        const res = await fetch('/api/eventos');
        const eventos = await res.json();
        const eventosDiv = document.getElementById('eventos-mes');
        eventosDiv.innerHTML = '';
        // Filtra eventos do mês/ano selecionado
        const eventosMes = eventos.filter(ev => {
            if (!ev.data) return false;
            const [evAno, evMes] = ev.data.split('-');
            return Number(evAno) === ano && Number(evMes) === (mes + 1);
        });
        if (eventosMes.length === 0) {
            eventosDiv.innerHTML = '<div class="text-muted">Nenhum evento para este mês.</div>';
        } else {
            // Agrupa eventos por dia
            const eventosPorDia = {};
            eventosMes.forEach(ev => {
                const dia = Number(ev.data.split('-')[2]);
                if (!eventosPorDia[dia]) eventosPorDia[dia] = [];
                eventosPorDia[dia].push(ev);
            });
            // Ordena os dias
            Object.keys(eventosPorDia).sort((a, b) => a - b).forEach(dia => {
                eventosDiv.innerHTML += `<div class='fw-bold mt-2 mb-1'>Dia ${dia}</div>`;
                eventosPorDia[dia].forEach(ev => {
                    eventosDiv.innerHTML += `
                        <div class="event-item">
                            <div class="event-details">
                                <div class="event-name">${ev.titulo || ev.nome || 'Evento'}</div>
                                <div class="event-time">${ev.horario || ''}</div>
                            </div>
                        </div>
                    `;
                });
            });
        }
    } catch (err) {
        const eventosDiv = document.getElementById('eventos-mes');
        eventosDiv.innerHTML = '<div class="text-danger">Erro ao carregar eventos.</div>';
    }
}

async function carregarDashboard() {
    try {
        const res = await fetch('/api/dashboard/stats');
        const stats = await res.json();
        // Atualizar cards principais
        document.querySelectorAll('.stat-card .stat-value')[0].innerHTML = `${stats.novosMembros} <i class="bi bi-arrow-up trend-up"></i>`;
        document.querySelectorAll('.stat-card .stat-value')[1].innerHTML = `R$${Number(stats.receitaMes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <i class="bi bi-arrow-up trend-up"></i>`;
        document.querySelectorAll('.stat-card .stat-value')[2].innerHTML = `${stats.membrosAtivos} <i class="bi bi-arrow-up trend-up"></i>`;

        // Receita mensal
        document.querySelectorAll('.progress-card .progress-amount')[0].innerText = `R$ ${Number(stats.receitaMes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        // Mensalidades pagas
        document.querySelectorAll('.progress-card .progress-amount')[1].innerHTML = `${stats.mensalidadesPagas} <small style="font-size: 16px; color: #718096; font-weight: 400;">Em Dia</small>`;
        // Total de membros cadastrados
        document.querySelectorAll('.progress-card .progress-amount')[2].innerText = stats.totalMembros;

        // Atualizar barras de progresso (exemplo: metas fixas)
        document.querySelectorAll('.progress-bar-container .progress-fill')[0].style.width = `${Math.min((stats.receitaMes / 10000) * 100, 100)}%`;
        document.querySelectorAll('.progress-bar-container .progress-fill')[1].style.width = `${Math.min((stats.mensalidadesPagas / (stats.totalMembros || 1)) * 100, 100)}%`;
        document.querySelectorAll('.progress-bar-container .progress-fill')[2].style.width = `${Math.min((stats.totalMembros / 150) * 100, 100)}%`;
    } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    gerarGridCalendario();
    atualizarTituloMes();
    carregarEventosDoMes();
    carregarDashboard();
}); 