const purchaseStorageKey = 'mundoLivros.purchase';
const cartStorageKey = 'mundoLivros.cart';
const bannerBooks = {
  arthur: {
    title: 'O Rei Arthur e os Cavaleiros da Távola Redonda',
    price: 40,
    oldPrice: 80,
    cover: 'img/OReiArthureosCavaleirosdaTavolaRedonda.png',
    description: 'Uma aventura clássica para acompanhar a lenda do Rei Arthur e os cavaleiros da Távola Redonda.'
  },
  misterio: {
    title: 'O Mistério das Linhas Tortas',
    price: 29.9,
    oldPrice: 50,
    description: 'Um mistério cheio de pistas e reviravoltas para descobrir página a página.'
  },
  noMeioDaNoite: {
    title: 'No Meio da Noite',
    price: 30,
    oldPrice: 60,
    cover: 'img/NoMeiodaNoite.png',
    description: 'Um suspense de Riley Sager que envolve mistério e acontecimentos inquietantes.'
  },
  matematica: {
    title: 'O Grande Livro de Matemática do Manual do Mundo',
    price: 50,
    oldPrice: 100,
    cover: 'img/OGrandeLivrodeMatemáticadoManualdoMundo.png',
    description: 'Explore conceitos e curiosidades da matemática de forma acessível e divertida.'
  },
  historia: {
    title: 'O Grande Livro de História do Manual do Mundo',
    price: 60,
    oldPrice: 120,
    cover: 'img/OGrandeLivrodeHistóriadoManualdoMundo.png',
    description: 'Uma leitura para conhecer acontecimentos, personagens e curiosidades que marcaram a história.'
  },
  ciencias: {
    title: 'O Grande Livro de Ciências do Manual do Mundo',
    price: 55,
    oldPrice: 110,
    cover: 'img/OGrandeLivrodeCiênciasdoManualdoMundo.png',
    description: 'Descubra temas e fenômenos científicos em uma leitura curiosa e envolvente.'
  },
  universo: {
    title: 'Os Mistérios do Universo',
    price: 90,
    oldPrice: 120,
    cover: 'img/OsMistériosdoUniverso.png',
    description: 'Uma jornada fascinante por estrelas, planetas e mistérios do universo.'
  },
  biologia: {
    title: 'O Grande Livro de Biologia do Manual do Mundo',
    price: 60,
    oldPrice: 100,
    cover: 'img/OGrandeLivrodeBiologiadoManualdoMundo.png',
    description: 'Anotações curiosas e divertidas para aprender sobre plantas, animais, o corpo humano e o funcionamento da vida.'
  },
  quimica: {
    title: 'O Grande Livro de Química do Manual do Mundo',
    price: 60,
    oldPrice: 100,
    cover: 'img/OGrandeLivrodeQuimicadoManualdoMundo.png',
    description: 'Aprenda sobre átomos, moléculas e reações químicas com anotações incríveis e divertidas.'
  },
  novoMundoEmChamas: {
    title: 'Novo Mundo em Chamas',
    price: 40,
    oldPrice: 90,
    cover: 'img/NovoMundoemChamas.png',
    description: 'Uma aventura épica sobre a batalha pelo destino de uma nação.'
  },
  ilhaDoTesouro: {
    title: 'A Ilha do Tesouro',
    price: 15,
    oldPrice: 30,
    cover: 'img/AIlhadoTesouro.png',
    description: 'Uma aventura clássica de Robert Louis Stevenson, repleta de mapas, piratas e busca por um tesouro.'
  },
  aMetamorfose: {
    title: 'A Metamorfose',
    price: 10,
    oldPrice: 20,
    cover: 'img/AMetamorfose.png',
    description: 'Uma obra clássica de Franz Kafka sobre Gregor Samsa e a transformação que muda a vida de sua família.'
  },
  umContoDeNatal: {
    title: 'Um Conto de Natal',
    price: 35,
    oldPrice: 70,
    cover: 'img/UmContodeNatal.png',
    description: 'Uma edição ilustrada do clássico conto de Charles Dickens sobre Ebenezer Scrooge e o espírito do Natal.'
  },
  todasTecnicasCulinarias: {
    title: 'Todas as Técnicas Culinárias',
    price: 130,
    oldPrice: 190,
    cover: 'img/TodasasTecnicasCulinarias.png',
    description: 'Um guia de técnicas culinárias da escola Le Cordon Bleu, com mais de 200 receitas básicas.'
  }
};
const couponRules = {
  DESCONTO30: { type: 'percentage', rate: 0.3 },
  FRETEGRATIS3: { type: 'freeShipping' },
  DESCONTA50: { type: 'percentage', rate: 0.5, minimum: 100 },
  DESCONTO20OFF: { type: 'percentage', rate: 0.2 }
};

function formatPurchasePrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function findPublishedBook(bookId) {
  try {
    const catalog = JSON.parse(localStorage.getItem('mundoLivros.catalog') || '[]');
    return Array.isArray(catalog)
      ? catalog.find((book) => book.id === bookId) || null
      : null;
  } catch {
    return null;
  }
}

function getStoreBook(bookId) {
  if (typeof bookId !== 'string') return null;

  if (Object.prototype.hasOwnProperty.call(bannerBooks, bookId)) {
    return bannerBooks[bookId];
  }

  if (bookId.startsWith('published:')) {
    return findPublishedBook(bookId.slice('published:'.length));
  }

  return null;
}

function createPixField(identifier, value) {
  const fieldValue = String(value);
  return `${identifier}${String(fieldValue.length).padStart(2, '0')}${fieldValue}`;
}

function calculatePixChecksum(payload) {
  let checksum = 0xffff;

  for (let index = 0; index < payload.length; index += 1) {
    checksum ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      checksum = checksum & 0x8000
        ? (checksum << 1) ^ 0x1021
        : checksum << 1;
      checksum &= 0xffff;
    }
  }

  return checksum.toString(16).toUpperCase().padStart(4, '0');
}

function createDemoPixPayload(amount) {
  const accountInfo = createPixField('00', 'br.gov.bcb.pix')
    + createPixField('01', 'nao-pagavel@exemplo.invalid');
  const additionalInfo = createPixField('05', 'NAOPAGAR');
  const payload = createPixField('00', '01')
    + createPixField('01', '12')
    + createPixField('26', accountInfo)
    + createPixField('52', '0000')
    + createPixField('53', '986')
    + createPixField('54', Number(amount).toFixed(2))
    + createPixField('58', 'BR')
    + createPixField('59', 'MUNDO LIVROS DEMO')
    + createPixField('60', 'SAO PAULO')
    + createPixField('62', additionalInfo)
    + '6304';

  return payload + calculatePixChecksum(payload);
}

const purchaseParameters = new URLSearchParams(window.location.search);
const requestedBookId = document.body.dataset.bookId || purchaseParameters.get('livro');
const publishedProductId = document.body.hasAttribute('data-published-product')
  ? purchaseParameters.get('id')
  : null;
const publishedProduct = publishedProductId ? findPublishedBook(publishedProductId) : null;
const currentBookId = Object.prototype.hasOwnProperty.call(bannerBooks, requestedBookId)
  ? requestedBookId
  : publishedProduct
    ? `published:${publishedProduct.id}`
    : 'arthur';
const currentBook = bannerBooks[currentBookId] || publishedProduct;
const productTitle = document.querySelector('#product-title');

if (productTitle) {
  const publishedDetail = document.querySelector('#published-product-detail');
  const notFoundNotice = document.querySelector('#published-book-not-found');

  if (document.body.hasAttribute('data-published-product') && !publishedProduct) {
    publishedDetail.hidden = true;
    notFoundNotice.hidden = false;
    productTitle.closest('.product-detail-card').hidden = true;
  } else {
    const productCover = document.querySelector('#product-cover');
    const oldPriceOutput = document.querySelector('#product-old-price');
    document.title = `Mundo Livros | ${currentBook.title}`;
    productTitle.textContent = currentBook.title;
    if (productCover) {
      productCover.hidden = !currentBook.cover;
      if (currentBook.cover) productCover.src = currentBook.cover;
      productCover.alt = `Capa do livro ${currentBook.title}`;
    }
    const coverPlaceholder = document.querySelector('#product-cover-placeholder');
    if (coverPlaceholder) coverPlaceholder.hidden = Boolean(currentBook.cover);
    if (oldPriceOutput) {
      oldPriceOutput.hidden = !currentBook.oldPrice;
      const oldPriceValue = oldPriceOutput.querySelector('.old-price-amount');
      if (oldPriceValue) {
        oldPriceValue.textContent = currentBook.oldPrice
          ? formatPurchasePrice(currentBook.oldPrice)
          : '';
      } else {
        oldPriceOutput.textContent = currentBook.oldPrice
          ? `De: ${formatPurchasePrice(currentBook.oldPrice)}`
          : '';
      }
    }
    document.querySelector('#product-price').textContent = `Por: ${formatPurchasePrice(currentBook.price)}`;
    document.querySelector('#product-description').textContent = currentBook.description;
    const fullDescription = document.querySelector('#product-full-description');
    if (fullDescription) fullDescription.textContent = currentBook.description;
    document.querySelector('#product-buy-link').href = `compra.html?livro=${encodeURIComponent(currentBookId)}`;
    if (publishedDetail) publishedDetail.hidden = false;
    if (window.MundoLivrosAnalytics && publishedProduct) {
      window.MundoLivrosAnalytics.trackBookView(publishedProduct.id);
    }
  }
}

const addToCartButton = document.querySelector('#add-to-cart');

if (addToCartButton) {
  const cartActionStatus = document.querySelector('#cart-action-status');

  addToCartButton.addEventListener('click', () => {
    try {
      const cart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
      if (!Array.isArray(cart)) throw new Error('Os dados do carrinho estão inválidos.');

      const existingItem = cart.find((item) => item.id === currentBookId);
      if (existingItem) {
        existingItem.quantity = Math.min(99, Number(existingItem.quantity) + 1);
      } else {
        cart.push({ id: currentBookId, quantity: 1 });
      }

      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
      if (currentBookId.startsWith('published:')) {
        window.MundoLivrosAnalytics?.trackCartAdd(currentBookId.slice('published:'.length));
      }
      cartActionStatus.textContent = 'Livro adicionado ao carrinho. Abra o carrinho para conferir.';
    } catch {
      cartActionStatus.textContent = 'Não foi possível adicionar o livro ao carrinho neste navegador.';
    }
  });
}

const cartItemsContainer = document.querySelector('#cart-items');

if (cartItemsContainer) {
  const emptyCart = document.querySelector('#empty-cart');
  const cartContent = document.querySelector('#cart-content');
  const cartStatus = document.querySelector('#cart-status');
  const cartTotalOutput = document.querySelector('#cart-total');
  const emptyCartLogin = document.querySelector('#empty-cart-login');

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
    if (!Array.isArray(cart)) throw new Error('Os dados do carrinho estão inválidos.');

    const validItems = cart.filter((item) =>
      getStoreBook(item.id)
      && Number.isInteger(Number(item.quantity))
      && Number(item.quantity) >= 1
    );
    const loginCta = document.querySelector('#cart-login-cta');
    const isLoggedIn = localStorage.getItem('mundoLivros.userLoggedIn') === 'true';
    cartItemsContainer.replaceChildren();
    emptyCart.hidden = validItems.length > 0;
    cartContent.hidden = validItems.length === 0;

    if (emptyCartLogin) {
      emptyCartLogin.hidden = isLoggedIn;
    }

    if (loginCta) {
      loginCta.hidden = isLoggedIn || validItems.length === 0;
    }

    let total = 0;
    validItems.forEach((item) => {
      const book = getStoreBook(item.id);
      const quantity = Math.min(99, Number(item.quantity));
      const subtotal = book.price * quantity;
      total += subtotal;

      const card = document.createElement('article');
      card.className = 'cart-item';
      const details = document.createElement('div');
      const title = document.createElement('h2');
      title.textContent = book.title;
      const price = document.createElement('p');
      price.textContent = `${quantity} × ${formatPurchasePrice(book.price)} — ${formatPurchasePrice(subtotal)}`;
      details.append(title, price);

      const actions = document.createElement('div');
      actions.className = 'cart-item-actions';
      const checkoutLink = document.createElement('a');
      checkoutLink.href = isLoggedIn
        ? `compra.html?livro=${encodeURIComponent(item.id)}&quantidade=${quantity}`
        : 'login.html';
      checkoutLink.textContent = isLoggedIn ? 'Comprar' : 'Faça login para comprar';
      if (!isLoggedIn) {
        checkoutLink.setAttribute('aria-label', 'Faça login para poder comprar');
      }
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'cart-item-remove';
      removeButton.dataset.removeCartItem = item.id;
      removeButton.textContent = 'Remover';
      actions.append(checkoutLink, removeButton);
      card.append(details, actions);
      cartItemsContainer.appendChild(card);
    });

    cartTotalOutput.textContent = `Total dos livros: ${formatPurchasePrice(total)}`;
  }

  cartItemsContainer.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove-cart-item]');
    if (!removeButton) return;

    try {
      const cart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
      if (!Array.isArray(cart)) throw new Error('Os dados do carrinho estão inválidos.');
      const updatedCart = cart.filter((item) => item.id !== removeButton.dataset.removeCartItem);
      localStorage.setItem(cartStorageKey, JSON.stringify(updatedCart));
      cartStatus.textContent = 'Livro removido do carrinho.';
      renderCart();
    } catch {
      cartStatus.textContent = 'Não foi possível atualizar o carrinho neste navegador.';
    }
  });

  try {
    renderCart();
  } catch {
    cartStatus.textContent = 'Não foi possível carregar os itens do carrinho neste navegador.';
  }
}

const checkoutForm = document.querySelector('#checkout-form');

if (checkoutForm) {
  sessionStorage.removeItem('mundoLivros.orderCode');

  const quantityInput = document.querySelector('#quantidade');
  const shippingSelect = document.querySelector('#log');
  const couponInput = document.querySelector('#coupon-code');
  const couponMessage = document.querySelector('#coupon-message');
  const subtotalOutput = document.querySelector('#checkout-subtotal');
  const shippingOutput = document.querySelector('#checkout-shipping');
  const discountLabel = document.querySelector('#checkout-discount-label');
  const discountOutput = document.querySelector('#checkout-discount');
  const totalOutput = document.querySelector('#checkout-total');
  const bookOutput = document.querySelector('#checkout-book');
  const bookId = new URLSearchParams(window.location.search).get('livro');
  const checkoutBook = getStoreBook(bookId) || bannerBooks.arthur;
  const checkoutBookId = getStoreBook(bookId) ? bookId : 'arthur';
  const initialQuantity = new URLSearchParams(window.location.search).get('quantidade');
  if (initialQuantity) {
    quantityInput.value = String(Math.min(99, Math.max(1, Number(initialQuantity) || 1)));
  }
  let activeCoupon = '';
  bookOutput.textContent = checkoutBook.title;
  checkoutForm.action = 'pagamento.html';

  function setCouponMessage(message, state = '') {
    couponMessage.textContent = message;
    couponMessage.dataset.state = state;
  }

  function updatePurchaseSummary() {
    const quantity = Math.min(99, Math.max(1, Number(quantityInput.value) || 1));
    quantityInput.value = String(quantity);
    const subtotal = quantity * checkoutBook.price;
    const shipping = Number(shippingSelect.value);
    const rule = couponRules[activeCoupon];
    let discount = 0;
    let appliedDiscountLabel = 'Desconto';

    if (rule?.minimum && subtotal <= rule.minimum) {
      activeCoupon = '';
      couponInput.value = '';
      setCouponMessage('Este cupom vale para compras acima de R$ 100,00.', 'invalid');
    } else if (rule?.type === 'percentage') {
      discount = subtotal * rule.rate;
      appliedDiscountLabel = `Desconto ${activeCoupon}`;
    } else if (rule?.type === 'freeShipping') {
      discount = shipping;
      appliedDiscountLabel = `Frete grátis ${activeCoupon}`;
    }

    const total = subtotal + shipping - discount;
    subtotalOutput.textContent = formatPurchasePrice(subtotal);
    shippingOutput.textContent = formatPurchasePrice(shipping);
    discountLabel.textContent = appliedDiscountLabel;
    discountOutput.textContent = discount > 0
      ? `−${formatPurchasePrice(discount)}`
      : formatPurchasePrice(0);
    totalOutput.textContent = formatPurchasePrice(total);

    sessionStorage.setItem(purchaseStorageKey, JSON.stringify({
      bookId: checkoutBookId,
      title: checkoutBook.title,
      unitPrice: checkoutBook.price,
      quantity,
      subtotal,
      shipping,
      discount,
      discountLabel: appliedDiscountLabel,
      total,
      coupon: activeCoupon
    }));
  }

  function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();
    activeCoupon = '';

    if (!code) {
      setCouponMessage('Digite um cupom ou deixe o campo vazio.', '');
      updatePurchaseSummary();
      return;
    }

    const rule = couponRules[code];
    if (!rule) {
      couponInput.setCustomValidity('Cupom inválido. Verifique o código e tente novamente.');
      couponInput.reportValidity();
      couponInput.setCustomValidity('');
      setCouponMessage('Cupom inválido. Verifique o código e tente novamente.', 'invalid');
      updatePurchaseSummary();
      return;
    }

    const subtotal = Math.min(99, Math.max(1, Number(quantityInput.value) || 1)) * checkoutBook.price;
    if (rule.minimum && subtotal <= rule.minimum) {
      setCouponMessage('Este cupom vale para compras acima de R$ 100,00.', 'invalid');
      updatePurchaseSummary();
      return;
    }

    activeCoupon = code;
    setCouponMessage('Cupom aplicado com sucesso!', 'valid');
    updatePurchaseSummary();
  }

  document.querySelector('#apply-coupon').addEventListener('click', applyCoupon);
  couponInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyCoupon();
    }
  });
  quantityInput.addEventListener('input', updatePurchaseSummary);
  shippingSelect.addEventListener('change', updatePurchaseSummary);
  checkoutForm.addEventListener('submit', updatePurchaseSummary);
  updatePurchaseSummary();
}

const paymentSubtotal = document.querySelector('#payment-subtotal');

if (paymentSubtotal) {
  try {
    const purchase = JSON.parse(sessionStorage.getItem(purchaseStorageKey) || 'null');
    if (purchase) {
      document.querySelector('#payment-book').textContent = purchase.title || bannerBooks.arthur.title;
      document.querySelector('#payment-subtotal').textContent = formatPurchasePrice(purchase.subtotal);
      document.querySelector('#payment-shipping').textContent = formatPurchasePrice(purchase.shipping);
      document.querySelector('#payment-discount-label').textContent = purchase.discountLabel;
      document.querySelector('#payment-discount').textContent = purchase.discount > 0
        ? `−${formatPurchasePrice(purchase.discount)}`
        : formatPurchasePrice(0);
      document.querySelector('#payment-total').textContent = formatPurchasePrice(purchase.total);
    }
  } catch {
    sessionStorage.removeItem(purchaseStorageKey);
  }
}

const pixTotalOutput = document.querySelector('#pix-total');

if (pixTotalOutput) {
  try {
    const purchase = JSON.parse(sessionStorage.getItem(purchaseStorageKey) || 'null');
    if (purchase) pixTotalOutput.textContent = formatPurchasePrice(purchase.total);
  } catch {
    sessionStorage.removeItem(purchaseStorageKey);
  }
}

const copyPixButton = document.querySelector('#copy-pix-code');

if (copyPixButton) {
  const pixCodeInput = document.querySelector('#pix-copy-code');
  const pixCopyStatus = document.querySelector('#pix-copy-status');
  let amount = 52;

  try {
    const purchase = JSON.parse(sessionStorage.getItem(purchaseStorageKey) || 'null');
    if (purchase && Number.isFinite(Number(purchase.total))) amount = Number(purchase.total);
  } catch {
    sessionStorage.removeItem(purchaseStorageKey);
  }

  pixCodeInput.value = createDemoPixPayload(amount);

  copyPixButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pixCodeInput.value);
    } catch {
      pixCodeInput.select();
      document.execCommand('copy');
      pixCodeInput.setSelectionRange(0, 0);
    }

    pixCopyStatus.textContent = 'Código copiado.';
  });
}

const orderCodeOutput = document.querySelector('#order-code');

if (orderCodeOutput) {
  let orderCode = sessionStorage.getItem('mundoLivros.orderCode');

  if (!orderCode) {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const randomPart = randomValues[0].toString(36).toUpperCase().padStart(7, '0').slice(-7);
    orderCode = `ML-${randomPart}`;
    sessionStorage.setItem('mundoLivros.orderCode', orderCode);
  }

  orderCodeOutput.textContent = orderCode;
}

const cardPaymentForm = document.querySelector('.payment-card-form');

if (cardPaymentForm) {
  try {
    const purchase = JSON.parse(sessionStorage.getItem(purchaseStorageKey) || 'null');
    const totalOutput = document.querySelector('#card-payment-total');
    if (purchase && Number.isFinite(Number(purchase.total))) {
      totalOutput.textContent = formatPurchasePrice(Number(purchase.total));
    }
  } catch (error) {
    console.error('Não foi possível carregar o total do pedido.', error);
  }

  cardPaymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.assign(`pedido-confirmado.html?metodo=${encodeURIComponent(cardPaymentForm.dataset.paymentMethod)}`);
  });
}
