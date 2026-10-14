const genres = {
  classicos: {
    title: 'Livros Clássicos',
    description: 'Obras marcantes e histórias que atravessam gerações.',
    books: [{
      title: 'O Rei Arthur e os Cavaleiros da Távola Redonda',
      price: 'R$ 40,00',
      oldPrice: 'R$ 80,00',
      cover: 'img/OReiArthureosCavaleirosdaTavolaRedonda.png',
      href: 'produto.html'
    }, {
      title: 'A Ilha do Tesouro',
      price: 'R$ 15,00',
      oldPrice: 'R$ 30,00',
      cover: 'img/AIlhadoTesouro.png',
      href: 'produto.html?livro=ilhaDoTesouro'
    }, {
      title: 'A Metamorfose',
      price: 'R$ 10,00',
      oldPrice: 'R$ 20,00',
      cover: 'img/AMetamorfose.png',
      href: 'produto.html?livro=aMetamorfose'
    }, {
      title: 'Um Conto de Natal',
      price: 'R$ 35,00',
      oldPrice: 'R$ 70,00',
      cover: 'img/UmContodeNatal.png',
      href: 'produto.html?livro=umContoDeNatal'
    }]
  },
  comedia: {
    title: 'Livros de Comédia',
    description: 'Leituras leves e bem-humoradas para momentos descontraídos.',
    books: []
  },
  sociologia: {
    title: 'Livros de Sociologia',
    description: 'Leituras sobre sociedade, cultura e relações humanas.',
    books: []
  },
  aventuras: {
    title: 'Livros de Aventuras',
    description: 'Jornadas, desafios e descobertas em cada história.',
    books: [{
      title: 'O Rei Arthur e os Cavaleiros da Távola Redonda',
      price: 'R$ 40,00',
      oldPrice: 'R$ 80,00',
      cover: 'img/OReiArthureosCavaleirosdaTavolaRedonda.png',
      href: 'produto.html'
    }, {
      title: 'A Ilha do Tesouro',
      price: 'R$ 15,00',
      oldPrice: 'R$ 30,00',
      cover: 'img/AIlhadoTesouro.png',
      href: 'produto.html?livro=ilhaDoTesouro'
    }, {
      title: 'Novo Mundo em Chamas',
      price: 'R$ 40,00',
      oldPrice: 'R$ 90,00',
      cover: 'img/NovoMundoemChamas.png',
      href: 'produto.html?livro=novoMundoEmChamas'
    }]
  },
  quadrinhos: {
    title: 'Gibis e Quadrinhos',
    description: 'Histórias contadas em imagens, ilustrações e balões.',
    books: []
  },
  filosofia: {
    title: 'Livros de Filosofia',
    description: 'Ideias e reflexões para olhar o mundo por outros ângulos.',
    books: []
  },
  contos: {
    title: 'Livros de Contos',
    description: 'Narrativas curtas para diferentes momentos de leitura.',
    books: [{
      title: 'Um Conto de Natal',
      price: 'R$ 35,00',
      oldPrice: 'R$ 70,00',
      cover: 'img/UmContodeNatal.png',
      href: 'produto.html?livro=umContoDeNatal'
    }]
  },
  poesias: {
    title: 'Poemas e Poesias',
    description: 'Versos, sentimentos e diferentes formas de expressão.',
    books: []
  },
  suspense: {
    title: 'Livros de Suspense',
    description: 'Mistérios e acontecimentos que prendem a atenção.',
    books: [{
      title: 'O Mistério das Linhas Tortas',
      price: 'R$ 29,90',
      oldPrice: 'R$ 50,00',
      href: 'produto.html?livro=misterio'
    }, {
      title: 'No Meio da Noite',
      price: 'R$ 30,00',
      oldPrice: 'R$ 60,00',
      cover: 'img/NoMeiodaNoite.png',
      href: 'produto.html?livro=noMeioDaNoite'
    }]
  },
  culinaria: {
    title: 'Livros de Culinária',
    description: 'Receitas, técnicas e inspirações para cozinhar.',
    books: [{
      title: 'Todas as Técnicas Culinárias',
      price: 'R$ 130,00',
      oldPrice: 'R$ 190,00',
      cover: 'img/TodasasTecnicasCulinarias.png',
      href: 'produto.html?livro=todasTecnicasCulinarias'
    }]
  },
  fabulas: {
    title: 'Livros de Fábulas',
    description: 'Histórias imaginativas com personagens e ensinamentos.',
    books: []
  },
  biografia: {
    title: 'Livros de Biografia',
    description: 'Trajetórias de pessoas e suas realizações.',
    books: []
  },
  ficcao: {
    title: 'Livros de Ficção',
    description: 'Histórias imaginadas para explorar outros mundos e possibilidades.',
    books: [{
      title: 'O Mistério das Linhas Tortas',
      price: 'R$ 29,90',
      oldPrice: 'R$ 50,00',
      href: 'produto.html?livro=misterio'
    }, {
      title: 'Novo Mundo em Chamas',
      price: 'R$ 40,00',
      oldPrice: 'R$ 90,00',
      cover: 'img/NovoMundoemChamas.png',
      href: 'produto.html?livro=novoMundoEmChamas'
    }]
  },
  historia: {
    title: 'Livros de História',
    description: 'Conheça acontecimentos, épocas e personagens históricos.',
    books: [{
      title: 'O Grande Livro de História do Manual do Mundo',
      price: 'R$ 60,00',
      oldPrice: 'R$ 120,00',
      cover: 'img/OGrandeLivrodeHistóriadoManualdoMundo.png',
      href: 'produto-historia.html'
    }, {
      title: 'Novo Mundo em Chamas',
      price: 'R$ 40,00',
      oldPrice: 'R$ 90,00',
      cover: 'img/NovoMundoemChamas.png',
      href: 'produto.html?livro=novoMundoEmChamas'
    }]
  },
  didaticos: {
    title: 'Livros Didáticos',
    description: 'Materiais de estudo e apoio para acompanhar diferentes etapas da aprendizagem.',
    books: [{
      title: 'O Grande Livro de Matemática do Manual do Mundo',
      price: 'R$ 50,00',
      oldPrice: 'R$ 100,00',
      cover: 'img/OGrandeLivrodeMatemáticadoManualdoMundo.png',
      href: 'produto-matematica.html'
    }, {
      title: 'O Grande Livro de História do Manual do Mundo',
      price: 'R$ 60,00',
      oldPrice: 'R$ 120,00',
      cover: 'img/OGrandeLivrodeHistóriadoManualdoMundo.png',
      href: 'produto-historia.html'
    }, {
      title: 'O Grande Livro de Ciências do Manual do Mundo',
      price: 'R$ 55,00',
      oldPrice: 'R$ 110,00',
      cover: 'img/OGrandeLivrodeCiênciasdoManualdoMundo.png',
      href: 'produto-ciencias.html'
    }, {
      title: 'Os Mistérios do Universo',
      price: 'R$ 90,00',
      oldPrice: 'R$ 120,00',
      cover: 'img/OsMistériosdoUniverso.png',
      href: 'produto-universo.html'
    }, {
      title: 'O Grande Livro de Biologia do Manual do Mundo',
      price: 'R$ 60,00',
      oldPrice: 'R$ 100,00',
      cover: 'img/OGrandeLivrodeBiologiadoManualdoMundo.png',
      href: 'produto.html?livro=biologia'
    }, {
      title: 'O Grande Livro de Química do Manual do Mundo',
      price: 'R$ 60,00',
      oldPrice: 'R$ 100,00',
      cover: 'img/OGrandeLivrodeQuimicadoManualdoMundo.png',
      href: 'produto.html?livro=quimica'
    }]
  }
};

const category = document.body.dataset.category
  || new URLSearchParams(window.location.search).get('categoria');
const genre = genres[category];
const title = document.querySelector('#genre-title');
const description = document.querySelector('#genre-description');
const bookList = document.querySelector('#genre-books');
const emptyState = document.querySelector('#genre-empty');
const kicker = document.querySelector('#genre-kicker');

if (genre) {
  document.title = `Mundo Livros | ${genre.title}`;
  title.textContent = genre.title;
  description.textContent = genre.description;
  emptyState.hidden = true;
  bookList.setAttribute('aria-label', genre.title);

  function createBookCard(book, slot) {
    const item = document.createElement('article');
    item.className = book ? 'product-card' : 'product-card product-card-placeholder';
    item.dataset.bookSlot = String(slot);

    if (book?.cover) {
      const cover = document.createElement('img');
      cover.className = 'book-image-box';
      cover.src = book.cover;
      cover.alt = `Capa do livro ${book.title}`;
      item.appendChild(cover);
    } else {
      const cover = document.createElement('div');
      cover.className = 'book-image-box book-image-placeholder';
      cover.setAttribute('role', 'img');
      cover.setAttribute('aria-label', book ? `Capa não disponível para ${book.title}` : 'Espaço reservado para a capa do livro');
      cover.textContent = 'Capa do livro';
      item.appendChild(cover);
    }

    const controls = document.createElement('div');
    controls.className = 'buy-control-row';

    function createQuantityStepper() {
      const stepper = document.createElement('div');
      stepper.className = 'quantity-stepper';
      stepper.setAttribute(
        'aria-label',
        book ? `Quantidade de ${book.title}` : 'Quantidade'
      );

      const decreaseButton = document.createElement('button');
      decreaseButton.type = 'button';
      decreaseButton.setAttribute('aria-label', 'Diminuir quantidade');
      decreaseButton.textContent = '−';
      const increaseButton = document.createElement('button');
      increaseButton.type = 'button';
      increaseButton.setAttribute('aria-label', 'Aumentar quantidade');
      increaseButton.textContent = '+';
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.value = '1';
      quantityInput.min = '1';
      quantityInput.max = '99';
      quantityInput.setAttribute('aria-label', book ? `Quantidade de ${book.title}` : 'Quantidade');

      decreaseButton.dataset.quantityStep = '-1';
      increaseButton.dataset.quantityStep = '1';

      stepper.append(decreaseButton, quantityInput, increaseButton);
      return stepper;
    }

    if (book) {
      const buyLink = document.createElement('a');
      buyLink.className = 'btn-buy-now';
      buyLink.href = book.href;
      buyLink.textContent = 'Comprar agora';
      controls.appendChild(buyLink);
      controls.appendChild(createQuantityStepper());
    } else {
      const buyButton = document.createElement('button');
      buyButton.className = 'btn-buy-now';
      buyButton.type = 'button';
      buyButton.disabled = true;
      buyButton.textContent = 'Comprar agora';
      controls.appendChild(buyButton);
      controls.appendChild(createQuantityStepper());
    }

    item.appendChild(controls);

    const meta = document.createElement('div');
    meta.className = 'product-meta';

    const bookTitle = document.createElement('div');
    bookTitle.className = 'product-name-row';
    const marker = document.createElement('span');
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = '■';
    bookTitle.append(marker, document.createTextNode(book ? book.title : 'Nome do livro'));

    const price = document.createElement('div');
    price.className = 'price-row';
    price.append('Preço', document.createElement('br'));
    if (book?.oldPrice) {
      const oldPrice = document.createElement('span');
      oldPrice.className = 'old-price-amount';
      oldPrice.textContent = book.oldPrice;
      price.append('De: ', oldPrice, document.createElement('br'));
    } else if (!book) {
      price.append('De: R$ --', document.createElement('br'));
    }
    price.appendChild(document.createTextNode('Por: '));
    const salePrice = document.createElement('span');
    salePrice.textContent = book ? book.price : 'R$ --';
    price.appendChild(salePrice);

    meta.append(bookTitle, price);
    item.appendChild(meta);
    bookList.appendChild(item);
  }

  const totalSlots = category === 'didaticos'
    ? genre.books.length + 3
    : Math.max(3, genre.books.length);

  for (let slot = 0; slot < totalSlots; slot += 1) {
    createBookCard(genre.books[slot] || null, slot + 1);
  }
} else {
  document.title = 'Mundo Livros | Gênero não encontrado';
  title.textContent = 'Gênero não encontrado';
  description.textContent = 'Escolha um gênero no menu da loja para explorar a seleção.';
  emptyState.hidden = true;
  kicker.textContent = 'Explore por categoria';
}
