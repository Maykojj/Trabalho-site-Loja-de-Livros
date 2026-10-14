const contactForm = document.querySelector('#contact-form');

if (contactForm) {
  const messageInput = document.querySelector('#contact-message-input');
  const messageList = document.querySelector('#contact-messages');

  function addMessage(message) {
    if (!message) return;

    const userMessage = document.createElement('p');
    userMessage.className = 'contact-message contact-message-user';
    userMessage.textContent = message;
    messageList.appendChild(userMessage);

    const reply = document.createElement('p');
    reply.className = 'contact-message';
    const normalizedMessage = message.toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const asksForReturn = normalizedMessage.includes('troca') || normalizedMessage.includes('devolu');

    if (normalizedMessage.includes('cupom') || normalizedMessage.includes('cupon') || normalizedMessage.includes('desconto')) {
      reply.textContent = 'Cupons disponíveis: DESCONTO30 (30% em uma compra), DESCONTA50 (50% em compras acima de R$ 100), DESCONTO20OFF (20% em uma compra) e FRETEGRATIS3 (frete grátis em 3 compras). Digite o código no campo de cupom do checkout.';
    } else if (normalizedMessage.includes('pagamento') || normalizedMessage.includes('pagar') || normalizedMessage.includes('pix') || normalizedMessage.includes('cartao')) {
      reply.textContent = 'A tela oferece cartão de crédito, cartão de débito e Pix.';
    } else if (normalizedMessage.includes('entrega') || normalizedMessage.includes('prazo') || normalizedMessage.includes('frete')) {
      reply.textContent = 'No checkout há duas opções: econômica pelos Correios por R$ 12,00, com prazo informado de 7 dias úteis, ou expressa pela Jadlog por R$ 25,00, com prazo informado de 2 dias úteis. O prazo real pode variar conforme o destino.';
    } else if (normalizedMessage.includes('pedido') || normalizedMessage.includes('rastrear') || normalizedMessage.includes('acompanhar')) {
      reply.textContent = 'O site ainda não possui consulta de status ou rastreamento de pedidos. Os prazos de frete disponíveis são 7 dias úteis (Correios) ou 2 dias úteis (Jadlog).';
    } else if (asksForReturn) {
      reply.textContent = 'Para informar os dados da compra e o motivo, comece sua solicitação aqui: ';
      const returnLink = document.createElement('a');
      returnLink.href = 'devolucao.html';
      returnLink.textContent = 'Iniciar devolução';
      reply.appendChild(returnLink);
    } else {
      reply.textContent = 'Posso ajudar com frete, cupons, formas de pagamento, pedidos ou trocas. Escolha uma pergunta rápida ou escreva um desses assuntos.';
    }
    messageList.appendChild(reply);

    messageInput.value = '';
    messageList.scrollTop = messageList.scrollHeight;
    messageInput.focus();
  }

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addMessage(messageInput.value.trim());
  });

  document.querySelectorAll('.contact-quick-questions button').forEach((button) => {
    button.addEventListener('click', () => addMessage(button.dataset.question));
  });
}
