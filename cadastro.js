const registrationForm = document.querySelector('#registration-form');

if (registrationForm) {
  const passwordInput = registrationForm.querySelector('#pass');
  const confirmationInput = registrationForm.querySelector('#confirm-pass');
  const visibilityButtons = registrationForm.querySelectorAll('.password-visibility-toggle');

  visibilityButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const input = registrationForm.querySelector(`#${button.getAttribute('aria-controls')}`);
      if (!input) return;

      const isVisible = input.type === 'text';
      input.type = isVisible ? 'password' : 'text';
      button.setAttribute('aria-pressed', String(!isVisible));
      button.setAttribute(
        'aria-label',
        isVisible
          ? (input === passwordInput ? 'Mostrar senha' : 'Mostrar confirmação da senha')
          : (input === passwordInput ? 'Ocultar senha' : 'Ocultar confirmação da senha')
      );
      input.focus();
    });
  });

  function validatePasswordConfirmation() {
    confirmationInput.setCustomValidity(
      confirmationInput.value && confirmationInput.value !== passwordInput.value
        ? 'As senhas não coincidem.'
        : ''
    );
  }

  passwordInput.addEventListener('input', validatePasswordConfirmation);
  confirmationInput.addEventListener('input', validatePasswordConfirmation);
}
