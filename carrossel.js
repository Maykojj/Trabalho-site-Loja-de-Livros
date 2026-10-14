const promoCarousel = document.querySelector('.promo-carousel');

if (promoCarousel) {
  const promoTrack = promoCarousel.querySelector('.promo-track');
  const promoSlides = [...promoTrack.querySelectorAll('.promo-slide')];
  const previousButton = promoCarousel.querySelector('.carousel-prev');
  const nextButton = promoCarousel.querySelector('.carousel-next');
  const slideDots = [...promoCarousel.querySelectorAll('.carousel-dot')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = 0;
  let autoplayTimer;

  function showSlide(index) {
    currentSlide = (index + promoSlides.length) % promoSlides.length;
    promoTrack.style.transform = `translateX(-${currentSlide * (100 / promoSlides.length)}%)`;
    slideDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentSlide;
      dot.classList.toggle('active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function startAutoplay() {
    if (reduceMotion.matches || autoplayTimer) return;
    autoplayTimer = window.setInterval(() => showSlide(currentSlide + 1), 4500);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = undefined;
  }

  previousButton.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    stopAutoplay();
    startAutoplay();
  });

  nextButton.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    stopAutoplay();
    startAutoplay();
  });

  slideDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      stopAutoplay();
      startAutoplay();
    });
  });

  promoCarousel.addEventListener('mouseenter', stopAutoplay);
  promoCarousel.addEventListener('mouseleave', startAutoplay);
  promoCarousel.addEventListener('focusin', stopAutoplay);
  promoCarousel.addEventListener('focusout', (event) => {
    if (!promoCarousel.contains(event.relatedTarget)) startAutoplay();
  });

  showSlide(0);
  startAutoplay();
}
