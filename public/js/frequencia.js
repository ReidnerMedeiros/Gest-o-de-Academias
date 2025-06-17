const tabelaFrequencia = document.getElementById('tabelaFrequencia');
let frequencias = [];

// Formata data para dd/mm/yyyy
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Carrega e mostra os dados na tabela
function carregarTabela() {
    tabelaFrequencia.innerHTML = '';
    frequencias.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${item.aluno}</td>
        <td>${item.personal}</td>
        <td>${item.modalidade}</td>
        <td>${item.horario}</td>
        <td>${formatarData(item.data)}</td>
        <td class="text-center">
          <input type="checkbox" data-index="${index}" ${item.presente ? 'checked' : ''}>
        </td>
      `;
        tabelaFrequencia.appendChild(tr);
    });
}

// Buscar frequencias do backend
async function carregarFrequencias() {
    try {
        const response = await fetch('/api/frequencia');
        if (!response.ok) throw new Error('Erro ao buscar frequências');
        frequencias = await response.json();
        carregarTabela();
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar dados de frequência.');
    }
}

// Salvar atualizações de presença no backend
async function salvarFrequencias() {
    const checkboxes = tabelaFrequencia.querySelectorAll('input[type="checkbox"]');
    let erros = [];

    for (const checkbox of checkboxes) {
        const idx = checkbox.getAttribute('data-index');
        const frequencia = frequencias[idx];
        const novoStatus = checkbox.checked;

        if (frequencia.presente !== novoStatus) {
            try {
                const response = await fetch(`/api/frequencia/${frequencia.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ presenca: novoStatus })
                });
                if (!response.ok) {
                    const erroJson = await response.json();
                    erros.push(`Erro ao atualizar presença do aluno ${frequencia.aluno}: ${erroJson.error || response.statusText}`);
                } else {
                    frequencias[idx].presente = novoStatus;
                }
            } catch (err) {
                erros.push(`Erro na rede para o aluno ${frequencia.aluno}`);
            }
        }
    }

    if (erros.length) {
        alert('Ocorreram erros:\n' + erros.join('\n'));
    } else {
        alert('Frequência salva com sucesso!');
    }
}

// Ativa o botão salvar
document.getElementById('btnSalvar').addEventListener('click', salvarFrequencias);

// Carrega a tabela ao abrir a página
window.addEventListener('load', carregarFrequencias); 