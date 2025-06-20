const form = document.getElementById('registroForm');
const alerta = document.getElementById('alerta');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const responsabilidade = document.getElementById('responsabilidade').value;

    try {
      const resposta = await fetch('/api/auth/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, responsabilidade })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Usuário registrado com sucesso!');
        window.location.href = 'login.html';
      } else {
        alerta.textContent = dados.mensagem || 'Erro ao registrar.';
        alerta.classList.remove('d-none');
      }
    } catch (err) {
      alerta.textContent = 'Erro na comunicação com o servidor.';
      alerta.classList.remove('d-none');
    }
  });
}
