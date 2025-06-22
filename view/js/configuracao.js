document.getElementById('formAlterarSenha').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const novaSenha = document.getElementById('novaSenha').value.trim();
  const confirmaSenha = document.getElementById('confirmaSenha').value.trim();
  const alerta = document.getElementById('alerta');

  alerta.classList.add('d-none');
  alerta.textContent = '';

  if (novaSenha !== confirmaSenha) {
    alerta.textContent = 'As senhas não coincidem.';
    alerta.classList.remove('d-none');
    return;
  }

  try {
    const resposta = await fetch('/api/auth/alterar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, novaSenha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert('Senha alterada com sucesso!');
      window.location.href = 'login.html';
    } else {
      alerta.textContent = dados.mensagem || 'Erro ao alterar senha.';
      alerta.classList.remove('d-none');
    }
  } catch (err) {
    alerta.textContent = 'Erro na comunicação com o servidor.';
    alerta.classList.remove('d-none');
  }
});
