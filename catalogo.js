const catalogStorageKey = 'mundoLivros.catalog';

function readCatalog() {
  try {
    return JSON.parse(localStorage.getItem(catalogStorageKey) || '[]');
  } catch {
    return [];
  }
}

function formatCatalogPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function createPublicationId() {
  return globalThis.crypto?.randomUUID?.()
    || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function getBookIndex(books, key) {
  if (key.startsWith('legacy-')) {
    const index = Number(key.slice('legacy-'.length));
    return Number.isInteger(index) && books[index] && !books[index].id ? index : -1;
  }

  return books.findIndex((book) => book.id === key);
}

function ensureCatalogBookIds(books) {
  let changed = false;
  books.forEach((book) => {
    if (!book.id) {
      book.id = createPublicationId();
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem(catalogStorageKey, JSON.stringify(books));
  }
}

const bookForm = document.querySelector('#new-book-form');

if (bookForm) {
  const status = document.querySelector('#book-form-status');
  const coverInput = document.querySelector('#capa-livro');
  const coverPreview = document.querySelector('#capa-preview');
  let previewUrl = null;

  coverInput.addEventListener('change', () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }

    const file = coverInput.files[0];
    coverPreview.hidden = !file;

    if (file) {
      previewUrl = URL.createObjectURL(file);
      coverPreview.src = previewUrl;
    } else {
      coverPreview.removeAttribute('src');
    }
  });

  bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(bookForm);
    const coverFile = coverInput.files[0];
    let cover = '';

    if (coverFile) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(coverFile.type)) {
        status.textContent = 'Escolha uma imagem PNG, JPG ou WebP.';
        return;
      }

      if (coverFile.size > 5 * 1024 * 1024) {
        status.textContent = 'A imagem deve ter no máximo 5 MB.';
        return;
      }

      status.textContent = 'Preparando a capa...';

      try {
        cover = await compressCoverImage(coverFile);
      } catch {
        status.textContent = 'Não foi possível carregar esta imagem. Escolha outro arquivo.';
        return;
      }
    }

    const book = {
      id: createPublicationId(),
      title: String(formData.get('titulo')).trim(),
      description: String(formData.get('descricao')).trim(),
      oldPrice: formData.get('preco-original') ? Number(formData.get('preco-original')) : null,
      price: Number(formData.get('preco-venda')),
      cover
    };

    const books = readCatalog();
    books.unshift(book);

    try {
      localStorage.setItem(catalogStorageKey, JSON.stringify(books));
      bookForm.reset();
      coverPreview.hidden = true;
      coverPreview.removeAttribute('src');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        previewUrl = null;
      }
      status.textContent = 'Livro cadastrado neste navegador. Acesse Novos livros para visualizá-lo.';
    } catch {
      status.textContent = 'Não foi possível salvar o livro neste navegador.';
    }
  });
}

function compressCoverImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Falha ao ler a imagem.'));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
      image.onload = () => {
        const maxWidth = 600;
        const maxHeight = 900;
        const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Não foi possível processar a imagem.'));
          return;
        }

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

const productsGrid = document.querySelector('#new-books-grid');

if (productsGrid) {
  let actionStatus = document.querySelector('#publication-action-status');
  if (!actionStatus) {
    actionStatus = document.createElement('p');
    actionStatus.id = 'publication-action-status';
    actionStatus.className = 'auth-footer';
    actionStatus.setAttribute('role', 'status');
    actionStatus.setAttribute('aria-live', 'polite');
    productsGrid.before(actionStatus);
  }

  let editDialog = document.querySelector('#edit-book-dialog');
  if (!editDialog) {
    editDialog = document.createElement('dialog');
    editDialog.id = 'edit-book-dialog';
    editDialog.className = 'publication-edit-dialog';
    editDialog.setAttribute('aria-labelledby', 'edit-book-title');
    editDialog.innerHTML = `
      <form id="edit-book-form" class="inline-form">
        <div class="auth-header">
          <span class="badge">Publicação</span>
          <h2 id="edit-book-title">Editar publicação</h2>
        </div>
        <div class="form-group">
          <label for="edit-book-name">Título da obra</label>
          <input type="text" id="edit-book-name" name="titulo" required>
        </div>
        <div class="form-group">
          <label for="edit-book-description">Descrição do livro</label>
          <textarea id="edit-book-description" name="descricao" rows="4" required></textarea>
        </div>
        <div class="form-group">
          <label for="edit-book-cover">Trocar foto da capa (opcional)</label>
          <input type="file" id="edit-book-cover" name="capa" accept="image/png,image/jpeg,image/webp">
          <label class="publication-remove-cover">
            <input type="checkbox" id="edit-remove-cover" name="remover-capa">
            Remover a capa atual
          </label>
          <img id="edit-cover-preview" class="book-image-box admin-cover-preview" alt="Prévia da capa da publicação" hidden>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="edit-book-old-price">Preço anterior (R$), opcional</label>
            <input type="number" id="edit-book-old-price" name="preco-original" min="0" step="0.01">
          </div>
          <div class="form-group">
            <label for="edit-book-price">Preço de venda (R$)</label>
            <input type="number" id="edit-book-price" name="preco-venda" min="0.01" step="0.01" required>
          </div>
        </div>
        <p id="edit-book-status" class="auth-footer" role="status" aria-live="polite"></p>
        <div class="publication-dialog-actions">
          <button type="button" id="cancel-edit-book" class="publication-cancel-button">Cancelar</button>
          <button type="submit" class="btn-submit">Salvar alterações</button>
        </div>
      </form>`;
    document.body.append(editDialog);
  }

  const editForm = document.querySelector('#edit-book-form');
  let editingKey = null;
  let editPreviewUrl = null;
  const viewObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && window.MundoLivrosAnalytics) {
          window.MundoLivrosAnalytics.trackBookView(entry.target.dataset.catalogPublication);
          viewObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 })
    : null;

  function setEditCoverPreview(source) {
    const preview = document.querySelector('#edit-cover-preview');
    preview.hidden = !source;

    if (source) {
      preview.src = source;
    } else {
      preview.removeAttribute('src');
    }
  }

  function clearEditPreviewUrl() {
    if (editPreviewUrl) {
      URL.revokeObjectURL(editPreviewUrl);
      editPreviewUrl = null;
    }
  }

  function closePublicationMenus(except = null) {
    productsGrid.querySelectorAll('.publication-actions.is-open').forEach((actions) => {
      if (actions !== except) {
        actions.classList.remove('is-open');
        actions.querySelector('.publication-options-button').setAttribute('aria-expanded', 'false');
        actions.querySelector('.publication-options-menu').hidden = true;
        actions.closest('.product-card').classList.remove('publication-menu-open');
      }
    });
  }

  function openEditDialog(key) {
    const books = readCatalog();
    const bookIndex = getBookIndex(books, key);
    if (bookIndex < 0) {
      actionStatus.textContent = 'Esta publicação não foi encontrada. Atualize a página e tente novamente.';
      return;
    }

    const book = books[bookIndex];
    editingKey = key;
    editForm.elements.titulo.value = book.title || '';
    editForm.elements.descricao.value = book.description || '';
    editForm.elements['preco-original'].value = book.oldPrice ?? '';
    editForm.elements['preco-venda'].value = book.price ?? '';
    editForm.elements.capa.value = '';
    editForm.elements['remover-capa'].checked = false;
    document.querySelector('#edit-book-status').textContent = '';
    clearEditPreviewUrl();
    setEditCoverPreview(book.cover || '');
    editDialog.showModal();
  }

  function renderPublishedBooks() {
    productsGrid.querySelectorAll('[data-catalog-publication]').forEach((card) => card.remove());

    const catalog = readCatalog();
    try {
      ensureCatalogBookIds(catalog);
    } catch {
      actionStatus.textContent = 'Não foi possível atualizar os identificadores dos livros neste navegador.';
    }

    const catalogEntries = catalog
      .map((book, index) => ({ book, index }))
      .reverse();

    for (const { book, index } of catalogEntries) {
      const key = book.id || `legacy-${index}`;
      const card = document.createElement('article');
      card.className = 'product-card published-book-card';
      card.dataset.catalogPublication = key;

      const cover = book.cover ? document.createElement('img') : document.createElement('div');
      cover.className = book.cover
        ? 'book-image-box'
        : 'book-image-box book-image-placeholder';

      if (book.cover) {
        cover.src = book.cover;
        cover.alt = `Capa de ${book.title}`;
      } else {
        cover.textContent = 'Capa do livro';
      }

      const metadata = document.createElement('div');
      metadata.className = 'product-meta';

      const title = document.createElement('h3');
      title.className = 'product-name-row';
      title.textContent = book.title;

      const description = document.createElement('p');
      description.className = 'new-book-description';
      description.textContent = book.description;

      const price = document.createElement('div');
      price.className = 'price-row';
      price.append('Preço', document.createElement('br'));
      if (book.oldPrice) {
        const oldPrice = document.createElement('span');
        oldPrice.className = 'old-price-amount';
        oldPrice.textContent = formatCatalogPrice(book.oldPrice);
        price.append('De: ', oldPrice, document.createElement('br'));
      }
      const salePrice = document.createElement('span');
      salePrice.textContent = formatCatalogPrice(book.price);
      price.append('Por: ', salePrice);

      const detailsLink = document.createElement('a');
      detailsLink.className = 'collection-book-link';
      detailsLink.href = `livro-publicado.html?id=${encodeURIComponent(book.id || key)}`;
      detailsLink.textContent = 'Conhecer livro';

      const actions = document.createElement('div');
      actions.className = 'publication-actions';

      const optionsButton = document.createElement('button');
      optionsButton.type = 'button';
      optionsButton.className = 'publication-options-button';
      optionsButton.textContent = '⋮';
      optionsButton.setAttribute('aria-label', `Mais opções para ${book.title}`);
      optionsButton.setAttribute('aria-haspopup', 'true');
      optionsButton.setAttribute('aria-expanded', 'false');

      const menu = document.createElement('div');
      menu.className = 'publication-options-menu';
      menu.setAttribute('role', 'menu');
      menu.hidden = true;

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'publication-menu-item';
      editButton.textContent = 'Editar publicação';
      editButton.setAttribute('role', 'menuitem');
      editButton.addEventListener('click', () => {
        closePublicationMenus();
        openEditDialog(key);
      });

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'publication-menu-item publication-delete-item';
      deleteButton.textContent = 'Excluir publicação';
      deleteButton.setAttribute('role', 'menuitem');
      deleteButton.addEventListener('click', () => {
        closePublicationMenus();

        if (!window.confirm(`Excluir a publicação “${book.title}”?`)) {
          return;
        }

        const books = readCatalog();
        const currentIndex = getBookIndex(books, key);
        if (currentIndex < 0) {
          actionStatus.textContent = 'Esta publicação não foi encontrada. Atualize a página e tente novamente.';
          return;
        }

        books.splice(currentIndex, 1);
        try {
          localStorage.setItem(catalogStorageKey, JSON.stringify(books));
          renderPublishedBooks();
          actionStatus.textContent = 'Publicação excluída.';
        } catch {
          actionStatus.textContent = 'Não foi possível excluir a publicação neste navegador.';
        }
      });

      optionsButton.addEventListener('click', () => {
        const isOpen = actions.classList.contains('is-open');
        closePublicationMenus(actions);
        actions.classList.toggle('is-open', !isOpen);
        card.classList.toggle('publication-menu-open', !isOpen);
        optionsButton.setAttribute('aria-expanded', String(!isOpen));
        menu.hidden = isOpen;
      });

      menu.append(editButton, deleteButton);
      actions.append(optionsButton, menu);
      metadata.append(title, description, price, detailsLink);
      card.append(actions, cover, metadata);
      productsGrid.prepend(card);

      if (viewObserver) {
        viewObserver.observe(card);
      } else if (window.MundoLivrosAnalytics) {
        window.MundoLivrosAnalytics.trackBookView(key);
      }
    }
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.publication-actions')) {
      closePublicationMenus();
    }
  });

  document.querySelector('#edit-book-cover').addEventListener('change', (event) => {
    clearEditPreviewUrl();
    const file = event.currentTarget.files[0];
    if (file) {
      document.querySelector('#edit-remove-cover').checked = false;
      editPreviewUrl = URL.createObjectURL(file);
      setEditCoverPreview(editPreviewUrl);
    }
  });

  document.querySelector('#edit-remove-cover').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      document.querySelector('#edit-book-cover').value = '';
      clearEditPreviewUrl();
      setEditCoverPreview('');
    }
  });

  document.querySelector('#cancel-edit-book').addEventListener('click', () => editDialog.close());

  editDialog.addEventListener('close', () => {
    clearEditPreviewUrl();
    setEditCoverPreview('');
    editForm.reset();
    editingKey = null;
  });

  editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('#edit-book-status');
    const coverFile = editForm.elements.capa.files[0];
    const removingCover = editForm.elements['remover-capa'].checked;
    let newCover = null;

    if (coverFile) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(coverFile.type)) {
        status.textContent = 'Escolha uma imagem PNG, JPG ou WebP.';
        return;
      }

      if (coverFile.size > 5 * 1024 * 1024) {
        status.textContent = 'A imagem deve ter no máximo 5 MB.';
        return;
      }

      status.textContent = 'Preparando a capa...';
      try {
        newCover = await compressCoverImage(coverFile);
      } catch {
        status.textContent = 'Não foi possível carregar esta imagem. Escolha outro arquivo.';
        return;
      }
    }

    const books = readCatalog();
    const bookIndex = editingKey ? getBookIndex(books, editingKey) : -1;
    if (bookIndex < 0) {
      status.textContent = 'Esta publicação não foi encontrada. Feche e tente novamente.';
      return;
    }

    const existingBook = books[bookIndex];
    books[bookIndex] = {
      ...existingBook,
      id: existingBook.id || createPublicationId(),
      title: editForm.elements.titulo.value.trim(),
      description: editForm.elements.descricao.value.trim(),
      oldPrice: editForm.elements['preco-original'].value
        ? Number(editForm.elements['preco-original'].value)
        : null,
      price: Number(editForm.elements['preco-venda'].value),
      cover: newCover || (removingCover ? '' : existingBook.cover || '')
    };

    try {
      localStorage.setItem(catalogStorageKey, JSON.stringify(books));
      editDialog.close();
      renderPublishedBooks();
      actionStatus.textContent = 'Publicação atualizada.';
    } catch {
      status.textContent = 'Não foi possível salvar as alterações neste navegador.';
    }
  });

  renderPublishedBooks();
}
