document.querySelectorAll('.quantity-stepper').forEach((stepper) => {
  const input = stepper.querySelector('input[type="number"]');

  stepper.querySelectorAll('button[data-quantity-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const minimum = Number(input.min) || 1;
      const maximum = Number(input.max) || 99;
      const current = Number(input.value) || minimum;
      const step = Number(button.dataset.quantityStep);
      input.value = String(Math.min(maximum, Math.max(minimum, current + step)));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  input.addEventListener('change', () => {
    const minimum = Number(input.min) || 1;
    const maximum = Number(input.max) || 99;
    const current = Number(input.value) || minimum;
    input.value = String(Math.min(maximum, Math.max(minimum, current)));
  });
});
