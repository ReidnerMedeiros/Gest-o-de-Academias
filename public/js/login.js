const toggleSenha = document.getElementById('toggleSenha');
const senhaInput = document.getElementById('senha');

if (toggleSenha && senhaInput) {
    toggleSenha.addEventListener('click', function () {
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            toggleSenha.textContent = 'Ocultar';
        } else {
            senhaInput.type = 'password';
            toggleSenha.textContent = 'Mostrar';
        }
    });
}

const form = document.getElementById('loginForm');
const alerta = document.getElementById('alerta');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        // Validação simples: exemplo de credenciais
        if (email === 'admin@fitness.com' && senha === '123456') {
            window.location.href = 'dashboard.html';
        } else {
            alerta.classList.remove('d-none');
        }
    });
} 