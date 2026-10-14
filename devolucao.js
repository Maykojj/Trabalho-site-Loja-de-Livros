const returnForm = document.querySelector('#return-request-form');

if (returnForm) {
  const status = document.querySelector('#return-form-status');

  returnForm.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Formulário preenchido. Para registrar a devolução, é necessário conectar o site ao atendimento da loja.';
  });
}
