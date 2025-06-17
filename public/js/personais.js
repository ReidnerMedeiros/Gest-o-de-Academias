const apiBaseUrl = 'http://localhost:3000/api/personais';

// Carregar e listar personais
async function carregarPersonais() {
    const tabela = document.getElementById('tabelaPersonais');
    const total = document.getElementById('totalPersonais');

    try {
        const response = await fetch(apiBaseUrl);
        const personais = await response.json();
        tabela.innerHTML = '';
        personais.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.nome}</td>
                <td>${p.idade || ''}</td>
                <td>${p.sexo || ''}</td>
                <td>${p.email}</td>
                <td>${p.modalidade || ''}</td>
                <td>${p.horarios || ''}</td>
            `;
            tabela.appendChild(tr);
        });
        total.textContent = personais.length;
    } catch (error) {
        console.error('Erro ao carregar personais:', error);
    }
}

carregarPersonais();

//  Adicionar Personal com feedback e atualização
const formAdicionar = document.getElementById('formAdicionar');
formAdicionar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nome: formAdicionar.nome.value,
        idade: Number(formAdicionar.idade.value),
        sexo: formAdicionar.sexo.value,
        email: formAdicionar.email.value,
        modalidade: formAdicionar.modalidade.value,
        horarios: formAdicionar.horarios.value
    };

    try {
        const response = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erro ao adicionar personal');
        }

        alert('Personal adicionado com sucesso!');
        await carregarPersonais();
        formAdicionar.reset();

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalAdicionar'));
        if (modal) modal.hide();

    } catch (error) {
        alert(error.message);
    }
});

// Atualizar Personal
const formAtualizar = document.getElementById('formAtualizar');
const dadosAtuais = document.getElementById('dadosAtuais');

formAtualizar.email.addEventListener('blur', async () => {
    const email = formAtualizar.email.value.trim();
    if (!email) {
        dadosAtuais.classList.add('d-none');
        return;
    }
    const response = await fetch(`${apiBaseUrl}/${email}`);
    if (response.ok) {
        const p = await response.json();
        formAtualizar.nome.value = p.nome;
        formAtualizar.idade.value = p.idade;
        formAtualizar.sexo.value = p.sexo;
        formAtualizar.modalidade.value = p.modalidade;
        formAtualizar.horarios.value = p.horarios;
        dadosAtuais.classList.remove('d-none');
    } else {
        alert('Personal não encontrado');
        dadosAtuais.classList.add('d-none');
    }
});

formAtualizar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        nome: formAtualizar.nome.value,
        idade: Number(formAtualizar.idade.value),
        sexo: formAtualizar.sexo.value,
        modalidade: formAtualizar.modalidade.value,
        horarios: formAtualizar.horarios.value
    };
    const email = formAtualizar.email.value.trim();

    const response = await fetch(`${apiBaseUrl}/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('Personal atualizado com sucesso!');
        carregarPersonais();
        formAtualizar.reset();
        dadosAtuais.classList.add('d-none');
        bootstrap.Modal.getInstance(document.getElementById('modalAtualizar')).hide();
    } else {
        const err = await response.json();
        alert('Erro: ' + err.error);
    }
});

// Remover Personal
document.querySelector('#modalRemover form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();

    if (!confirm('Tem certeza que deseja remover este personal?')) return;

    const response = await fetch(`${apiBaseUrl}/${email}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Personal removido!');
        carregarPersonais();
        e.target.reset();
        bootstrap.Modal.getInstance(document.getElementById('modalRemover')).hide();
    } else {
        const erro = await response.json();
        alert('Erro: ' + erro.error);
    }
}); 