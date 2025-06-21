const API_URL = (window.location.hostname === 'localhost')
  ? 'http://localhost:3000/api/membros'
  : '/api/membros';

// Função para carregar e listar membros na tabela
async function listarMembros() {
    const tabela = document.getElementById('tabelaMembros');
    const total = document.querySelector('span#totalMembros');
    try {
        const res = await fetch(API_URL);
        const membros = await res.json();
        tabela.innerHTML = '';
        membros.forEach(membro => {
            const corDot = membro.status_pagamento === 'Pago' ? 'green' : 'red';
            tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${membro.nome}</td>
                <td>${membro.idade || ''}</td>
                <td>${membro.sexo || ''}</td>
                <td>${membro.email}</td>
                <td>${membro.telefone || ''}</td>
                <td>
                  <span class="dot ${corDot}"></span>
                  ${membro.status_pagamento}
                </td>
            `;
            tabela.appendChild(tr);
        });
        total.textContent = membros.length;
    } catch (error) {
        console.error('Erro ao listar membros:', error);
    }
}

// Listar membros ao carregar a página
listarMembros();

// Form Adicionar
const formAdicionar = document.getElementById('formAdicionar');
formAdicionar.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(formAdicionar);
    const data = Object.fromEntries(formData.entries());
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Erro ao adicionar membro');
        formAdicionar.reset();
        listarMembros();
        alert('Membro adicionado com sucesso!');
    } catch (error) {
        alert(error.message);
    }
});

// Form Atualizar
const formAtualizar = document.getElementById('formAtualizar');
const inputEmailAtualizar = formAtualizar.querySelector('input[name="email"]');

// Buscar dados do membro ao preencher o email no modal atualizar
inputEmailAtualizar.addEventListener('blur', async () => {
    const email = inputEmailAtualizar.value.trim();
    if (!email) return;

    try {
        const res = await fetch(`${API_URL}/${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error('Membro não encontrado');

        const membro = await res.json();

        formAtualizar.nome.value = membro.nome || '';
        formAtualizar.idade.value = membro.idade || '';
        formAtualizar.sexo.value = membro.sexo || 'Feminino';
        formAtualizar.telefone.value = membro.telefone || '';

    } catch (error) {
        alert('Membro não encontrado para o email informado.');
        formAtualizar.nome.value = '';
        formAtualizar.idade.value = '';
        formAtualizar.sexo.value = 'Feminino';
        formAtualizar.telefone.value = '';
    }
});

// Enviar atualização
formAtualizar.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(formAtualizar);
    const data = Object.fromEntries(formData.entries());
    const email = data.email;
    delete data.email;

    try {
        const res = await fetch(`${API_URL}/${encodeURIComponent(email)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Erro ao atualizar membro');
        alert('Membro atualizado com sucesso!');
        listarMembros();
        formAtualizar.reset();
    } catch (error) {
        alert(error.message);
    }
});

// Form Remover
const formRemover = document.getElementById('formRemover');
formRemover.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(formRemover);
    const { email } = Object.fromEntries(formData.entries());

    if (!confirm(`Deseja realmente remover o membro com email ${email}?`)) return;

    try {
        const res = await fetch(`${API_URL}/${encodeURIComponent(email)}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Erro ao remover membro');
        alert('Membro removido com sucesso!');
        listarMembros();
        formRemover.reset();
    } catch (error) {
        alert(error.message);
    }
}); 