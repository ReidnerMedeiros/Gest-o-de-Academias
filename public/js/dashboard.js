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

// Calendar navigation functions
function previousMonth() {
    console.log('Previous month');
}

function nextMonth() {
    console.log('Next month');
} 