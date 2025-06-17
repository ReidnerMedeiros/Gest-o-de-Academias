const API_URL = 'http://localhost:3000/api/pagamentos';
const API_MEMBROS = 'http://localhost:3000/api/membros';
const API_BASE = 'http://localhost:3000';

async function carregarMembros() {
  const select = document.getElementById('membroSelect');
  select.innerHTML = '<option value="">Selecione...</option>';
  try {
    const res = await fetch(API_MEMBROS);
    if (!res.ok) throw new Error('Erro ao buscar membros');
    const membros = await res.json();
    membros.forEach(m => {
      select.innerHTML += `<option value="${m.id}">${m.nome} (${m.email})</option>`;
    });
  } catch (err) {
    select.innerHTML = '<option value="">Erro ao carregar membros</option>';
  }
}

document.addEventListener('DOMContentLoaded', carregarMembros);

document.getElementById('formPagamento').addEventListener('submit', async function (e) {
  e.preventDefault();
  const membro_id = document.getElementById('membroSelect').value;
  const forma_pagamento = document.getElementById('formaPagamento').value;
  const valor = document.getElementById('valorPagamento').value;
  if (!membro_id || !forma_pagamento || !valor) return alert('Preencha todos os campos!');
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membro_id, forma_pagamento, valor })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao registrar pagamento');
    }
    document.getElementById('formPagamento').reset();
    listarPagamentos();
    alert('Pagamento registrado com sucesso!');
  } catch (err) {
    alert(err.message);
  }
});

async function listarPagamentos() {
  const tabela = document.getElementById('tabelaPagamentos');
  const msgErro = document.getElementById('mensagemErro');
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Erro ao buscar dados');
    const pagamentos = await res.json();
    tabela.innerHTML = '';
    pagamentos.forEach(pagamento => {
      const membro = pagamento.membros || {};
      const nome = membro.nome || '-';
      const email = membro.email || '-';
      tabela.innerHTML += `
                <tr>
                  <td>${nome}</td>
                  <td>${email}</td>
                  <td>${pagamento.forma_pagamento}</td>
                  <td>R$ ${parseFloat(pagamento.valor).toFixed(2)}</td>
                </tr>
            `;
    });
    msgErro.classList.add('d-none');
  } catch (error) {
    msgErro.textContent = error.message;
    msgErro.classList.remove('d-none');
  }
}

async function removerPagamento(email) {
  if (!confirm('Tem certeza que deseja remover este pagamento?')) return;
  try {
    const res = await fetch(`${API_URL}/${email}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover pagamento');
    listarPagamentos();
  } catch (error) {
    alert(error.message);
  }
}

listarPagamentos();

fetch(`${API_BASE}/api/dashboard/stats`); 