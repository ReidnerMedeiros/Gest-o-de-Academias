const API_URL = 'http://localhost:3000/api/pagamentos';

async function listarPagamentos() {
    const tabela = document.getElementById('tabelaPagamentos');
    const msgErro = document.getElementById('mensagemErro');
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Erro ao buscar dados');
        const pagamentos = await res.json();
        tabela.innerHTML = '';
        pagamentos.forEach(pagamento => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <img src="${pagamento.foto || 'https://via.placeholder.com/40'}" class="me-2 table-avatar" alt="Avatar">
            ${pagamento.nome}
          </div>
        </td>
        <td>${pagamento.idade}</td>
        <td>${pagamento.sexo}</td>
        <td><a href="mailto:${pagamento.email}">${pagamento.email}</a></td>
        <td>${pagamento.tipoPagamento}</td>
        <td>R$ ${parseFloat(pagamento.valor).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removerPagamento('${pagamento.email}')">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
            tabela.appendChild(tr);
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