const form = document.getElementById('loginForm');
const alerta = document.getElementById('alerta');
const btnEntrar = form.querySelector('button[type="submit"]');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    alerta.classList.add('d-none');
    alerta.textContent = '';

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const lembrar = document.getElementById('lembrar').checked;

    // Salva ou remove o email no localStorage logo no início
    if (lembrar) {
      localStorage.setItem('usuarioLogado', JSON.stringify({ email }));
    } else {
      localStorage.removeItem('usuarioLogado');
    }

    // Ativa loading no botão
    btnEntrar.disabled = true;
    btnEntrar.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Carregando...`;

    // Credenciais do super usuário (se quiser manter)
    const SUPER_USUARIO_EMAIL = "admin@fitness.com";
    const SUPER_USUARIO_SENHA = "123456";

    if (email === SUPER_USUARIO_EMAIL && senha === SUPER_USUARIO_SENHA) {
      localStorage.setItem('token', 'super-usuario-token'); // token fictício

      alert('Login realizado com sucesso! (Super usuário)');
      window.location.href = 'dashboard.html';
      return;
    }

    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        localStorage.setItem('token', dados.token);
        alert('Login realizado com sucesso!');
        window.location.href = 'dashboard.html';
      } else {
        alerta.textContent = dados.mensagem || 'Email ou senha incorretos.';
        alerta.classList.remove('d-none');
      }
    } catch (err) {
      alerta.textContent = 'Erro na comunicação com o servidor.';
      alerta.classList.remove('d-none');
    } finally {
      // Remove loading e reativa o botão
      btnEntrar.disabled = false;
      btnEntrar.innerHTML = 'Entrar';
    }
  });
}

// Alternar visualização da senha
const toggleSenhaBtn = document.getElementById('toggleSenha');
const senhaInput = document.getElementById('senha');

if (toggleSenhaBtn && senhaInput) {
  toggleSenhaBtn.addEventListener('click', () => {
    if (senhaInput.type === 'password') {
      senhaInput.type = 'text';
      toggleSenhaBtn.textContent = 'Ocultar';
    } else {
      senhaInput.type = 'password';
      toggleSenhaBtn.textContent = 'Mostrar';
    }
  });
}

// Preenche email salvo ao carregar a página
window.addEventListener('load', () => {
  const usuarioSalvo = localStorage.getItem('usuarioLogado');
  if (usuarioSalvo) {
    const dados = JSON.parse(usuarioSalvo);
    document.getElementById('email').value = dados.email;
    document.getElementById('lembrar').checked = true;
  }
});
