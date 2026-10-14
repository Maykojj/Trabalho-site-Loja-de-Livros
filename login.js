const loginForm = document.querySelector('#login-form');
const adminLogin = new URLSearchParams(window.location.search).get('tipo') === 'administrador';
const passwordInput = document.querySelector('#password');
const passwordToggle = document.querySelector('.password-visibility-toggle');

if (passwordToggle && passwordInput) {
  passwordToggle.addEventListener('click', (event) => {
    event.preventDefault();
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    passwordToggle.setAttribute('aria-pressed', String(!isVisible));
    passwordToggle.setAttribute('aria-label', isVisible ? 'Mostrar senha' : 'Ocultar senha');
    passwordInput.focus();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const accessType = adminLogin
      ? 'administrador'
      : document.querySelector('#access-type').value;

    localStorage.setItem('mundoLivros.userLoggedIn', 'true');
    localStorage.setItem('mundoLivros.userType', accessType);
    window.location.assign(accessType === 'administrador' ? 'admin.html' : 'index.html');
  });
}

if (adminLogin) {
  document.title = 'Mundo Livros | Login Administrativo';
  document.querySelector('#login-badge').textContent = 'Área administrativa';
  document.querySelector('#login-title').textContent = 'Login Administrativo';
  document.querySelector('#email-label').textContent = 'E-mail administrativo';
  document.querySelector('#login-submit').textContent = 'Entrar no painel';
  document.querySelector('#access-type-group').hidden = true;
  document.querySelector('#login-signup').hidden = true;
}
