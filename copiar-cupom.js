document.querySelectorAll('.coupon-code').forEach((copyControl) => {
  const copyStatus = document.createElement('span');
  copyStatus.className = 'coupon-copy-status';
  copyStatus.setAttribute('role', 'status');
  copyStatus.setAttribute('aria-live', 'polite');
  copyControl.closest('.coupon-card').appendChild(copyStatus);
  let statusTimer;

  function showCopyStatus(message, isError = false) {
    copyStatus.textContent = message;
    copyStatus.classList.toggle('coupon-copy-error', isError);
    window.clearTimeout(statusTimer);
    if (message) {
      statusTimer = window.setTimeout(() => {
        copyStatus.textContent = '';
        copyStatus.classList.remove('coupon-copy-error');
      }, 2500);
    }
  }

  async function copyCouponCode() {
    const couponCode = copyControl.dataset.code;

    try {
      await navigator.clipboard.writeText(couponCode);
      showCopyStatus('Cupom Copiado');
    } catch {
      const temporaryInput = document.createElement('textarea');
      temporaryInput.value = couponCode;
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.appendChild(temporaryInput);

      try {
        temporaryInput.select();
        if (!document.execCommand('copy')) {
          throw new Error('O navegador não conseguiu copiar o cupom.');
        }
        showCopyStatus('Cupom Copiado');
      } catch (error) {
        showCopyStatus('Não foi possível copiar. Selecione o código para copiá-lo.', true);
        console.error('Falha ao copiar cupom:', error);
      } finally {
        temporaryInput.remove();
      }
    }
  }

  copyControl.addEventListener('click', copyCouponCode);

  copyControl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      copyCouponCode();
    }
  });
});
