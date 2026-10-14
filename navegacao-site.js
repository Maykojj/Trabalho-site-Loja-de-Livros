const currentPage = window.location.pathname.split('/').pop().toLowerCase();
const pagesWithoutNavigation = new Set([
  'admin.html',
  'cadastro.html',
  'carrinho.html',
  'faturamento.html',
  'login.html',
  'pagamento.html',
  'pagamento-credito.html',
  'pagamento-debito.html',
  'pagamento-pix.html',
  'pix-qrcode.html',
  'pedido-confirmado.html'
]);

if (document.body.dataset.category && !document.querySelector('.search-wrapper')) {
  const headerContainer = document.querySelector('.main-header .header-container');
  if (headerContainer) {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper';
    searchWrapper.innerHTML = `
      <div class="search-loupe"></div>
      <input type="text" placeholder="Pesquisar livros, autores e temas" aria-label="Pesquisar livros" aria-autocomplete="list" aria-controls="search-suggestions" aria-expanded="false" autocomplete="off">
      <div class="search-suggestions" id="search-suggestions" role="listbox" hidden></div>
    `;

    const utilitiesNav = document.createElement('div');
    utilitiesNav.className = 'utilities-nav';
    utilitiesNav.innerHTML = `
      <a href="cupons.html" class="utility-link" title="Cupons" aria-label="Cupons">🎟️</a>
      <a href="carrinho.html" class="cart-trigger" title="Carrinho">🛒</a>
      <a href="login.html" class="user-avatar" title="Minha Conta" aria-label="Minha conta"></a>
    `;

    headerContainer.appendChild(searchWrapper);
    headerContainer.appendChild(utilitiesNav);
  }
}

if (!document.querySelector('.categories-navbar') && !pagesWithoutNavigation.has(currentPage)) {
  const navigation = document.createElement('nav');
  navigation.className = 'categories-navbar';
  navigation.setAttribute('aria-label', 'Navegação principal');
  navigation.innerHTML = `
    <ul class="categories-menu">
      <li>
        <details class="genres-dropdown">
          <summary>Mais gêneros</summary>
          <ul class="genres-menu" aria-label="Gêneros literários">
            <li><a href="genero-classicos.html">Livros Clássicos</a></li>
            <li><a href="genero-comedia.html">Livros de Comédia</a></li>
            <li><a href="genero-sociologia.html">Livros de Sociologia</a></li>
            <li><a href="genero-aventuras.html">Livros de Aventuras</a></li>
            <li><a href="genero-quadrinhos.html">Gibis/Quadrinhos</a></li>
            <li><a href="genero-filosofia.html">Livros de Filosofia</a></li>
            <li><a href="genero-contos.html">Livros de Contos</a></li>
            <li><a href="genero-poesias.html">Poemas/Poesias</a></li>
            <li><a href="genero-suspense.html">Livros de Suspense</a></li>
            <li><a href="genero-culinaria.html">Livros de Culinária</a></li>
            <li><a href="genero-fabulas.html">Livros de Fábulas</a></li>
            <li><a href="genero-biografia.html">Livros de Biografia</a></li>
            <li><a href="genero-ficcao.html">Livros de Ficção</a></li>
            <li><a href="genero-historia.html">Livros de História</a></li>
            <li><a href="livros-didaticos.html">+ Livros Didáticos</a></li>
          </ul>
        </details>
      </li>
      <li><a href="mais-desejados.html">Mais desejados</a></li>
      <li><a href="melhores-promocoes.html">Melhores promoções</a></li>
      <li><a href="novos-livros.html">Novos livros</a></li>
      <li><a href="contato.html">Fale conosco</a></li>
    </ul>
  `;

  const header = document.querySelector('.main-header');
  if (header) {
    header.insertAdjacentElement('afterend', navigation);
  } else {
    document.body.insertBefore(navigation, document.body.firstChild);
  }
}

if (document.body.dataset.category && !document.querySelector('script[src="pesquisa.js"]')) {
  const searchScript = document.createElement('script');
  searchScript.src = 'pesquisa.js';
  document.body.appendChild(searchScript);
}

document.querySelectorAll('.genres-menu').forEach((menu) => {
  if (menu.querySelector('a[href="livros-didaticos.html"]')) return;

  const item = document.createElement('li');
  const link = document.createElement('a');
  link.href = 'livros-didaticos.html';
  link.textContent = '+ Livros Didáticos';
  item.appendChild(link);
  menu.appendChild(item);
});
