(() => {
  const catalogStorageKey = 'mundoLivros.catalog';
  const analyticsStorageKey = 'mundoLivros.analytics';
  const visitorStorageKey = 'mundoLivros.analyticsVisitorId';

  function createId() {
    return globalThis.crypto?.randomUUID?.()
      || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function getVisitorId() {
    let visitorId = localStorage.getItem(visitorStorageKey);
    if (!visitorId) {
      visitorId = createId();
      localStorage.setItem(visitorStorageKey, visitorId);
    }
    return visitorId;
  }

  function readAnalytics() {
    return readJson(analyticsStorageKey, { books: {} });
  }

  function trackBookView(bookId) {
    try {
      const analytics = readAnalytics();
      const bookMetrics = analytics.books[bookId] || {
        views: [],
        cartAdds: 0,
        purchases: 0,
        refunds: 0
      };
      const visitorId = getVisitorId();

      if (!bookMetrics.views.includes(visitorId)) {
        bookMetrics.views.push(visitorId);
        analytics.books[bookId] = bookMetrics;
        localStorage.setItem(analyticsStorageKey, JSON.stringify(analytics));
      }
    } catch {
      // Analytics are best-effort and must not interrupt browsing.
    }
  }

  function trackCartAdd(bookId) {
    try {
      const analytics = readAnalytics();
      const bookMetrics = analytics.books[bookId] || {
        views: [],
        cartAdds: 0,
        purchases: 0,
        refunds: 0
      };
      bookMetrics.cartAdds = (Number(bookMetrics.cartAdds) || 0) + 1;
      analytics.books[bookId] = bookMetrics;
      localStorage.setItem(analyticsStorageKey, JSON.stringify(analytics));
    } catch {
      // Analytics are best-effort and must not interrupt browsing.
    }
  }

  window.MundoLivrosAnalytics = { trackBookView, trackCartAdd };

  const reportList = document.querySelector('#revenue-books-list');
  if (!reportList) return;

  const status = document.querySelector('#revenue-report-status');
  const formatCount = (value) => new Intl.NumberFormat('pt-BR').format(value);

  function showMetric(label, value) {
    const metric = document.createElement('div');
    metric.className = 'admin-report-book-metric';
    const name = document.createElement('span');
    name.textContent = label;
    const count = document.createElement('strong');
    count.textContent = formatCount(value);
    metric.append(name, count);
    return metric;
  }

  try {
    const catalog = readJson(catalogStorageKey, []);
    if (!Array.isArray(catalog)) throw new Error('O catálogo de livros está inválido.');
    const analytics = readAnalytics();
    const books = analytics.books || {};
    const totals = { views: 0, cartAdds: 0, purchases: 0, refunds: 0 };

    document.querySelector('#report-total-books').textContent = formatCount(catalog.length);

    catalog.forEach((book, index) => {
      const key = book.id || `legacy-${index}`;
      const metrics = books[key] || {};
      const views = Array.isArray(metrics.views) ? metrics.views.length : 0;
      const cartAdds = Number(metrics.cartAdds) || 0;
      const purchases = Number(metrics.purchases) || 0;
      const refunds = Number(metrics.refunds) || 0;
      totals.views += views;
      totals.cartAdds += cartAdds;
      totals.purchases += purchases;
      totals.refunds += refunds;

      const card = document.createElement('article');
      card.className = 'admin-report-book';

      if (book.cover) {
        const cover = document.createElement('img');
        cover.className = 'admin-report-book-cover';
        cover.src = book.cover;
        cover.alt = `Capa de ${book.title}`;
        card.append(cover);
      } else {
        const coverPlaceholder = document.createElement('div');
        coverPlaceholder.className = 'admin-report-book-cover admin-report-cover-placeholder';
        coverPlaceholder.textContent = 'Sem capa';
        card.append(coverPlaceholder);
      }

      const details = document.createElement('div');
      details.className = 'admin-report-book-details';
      const title = document.createElement('h3');
      title.textContent = book.title || 'Livro sem título';
      const description = document.createElement('p');
      description.textContent = book.description || '';
      const metricsGrid = document.createElement('div');
      metricsGrid.className = 'admin-report-book-metrics';
      metricsGrid.append(
        showMetric('Visualizações únicas', views),
        showMetric('Adições ao carrinho', cartAdds),
        showMetric('Compras', purchases),
        showMetric('Pedidos de reembolso', refunds)
      );
      details.append(title, description);
      card.append(details, metricsGrid);
      reportList.append(card);
    });

    document.querySelector('#report-total-views').textContent = formatCount(totals.views);
    document.querySelector('#report-total-cart-adds').textContent = formatCount(totals.cartAdds);
    document.querySelector('#report-total-purchases').textContent = formatCount(totals.purchases);
    document.querySelector('#report-total-refunds').textContent = formatCount(totals.refunds);

    if (catalog.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'admin-report-empty';
      emptyMessage.textContent = 'Ainda não há livros publicados para exibir.';
      reportList.append(emptyMessage);
    }
  } catch {
    status.textContent = 'Não foi possível carregar o relatório neste navegador.';
  }
})();
