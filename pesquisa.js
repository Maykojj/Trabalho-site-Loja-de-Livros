const searchBooks = [
  'O Rei Arthur e os Cavaleiros da Távola Redonda',
  'Um Conto de Natal',
  'Todas as Técnicas Culinárias',
  'A Metamorfose',
  'No Meio da Noite',
  'O Mistério das Linhas Tortas',
  'Explorando o Cosmos Infinito',
  'O Grande Livro de Matemática do Manual do Mundo',
  'O Grande Livro de História do Manual do Mundo',
  'O Grande Livro de Ciências do Manual do Mundo',
  'Os mistérios do Universo'
];

function normalizeSearchText(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

document.querySelectorAll('.search-wrapper').forEach((wrapper) => {
  const input = wrapper.querySelector('input');
  const suggestions = wrapper.querySelector('.search-suggestions');
  let activeIndex = -1;

  function closeSuggestions() {
    suggestions.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }

  function chooseSuggestion(title) {
    input.value = title;
    closeSuggestions();
    input.focus();
  }

  function updateSuggestions() {
    const query = normalizeSearchText(input.value.trim());
    suggestions.replaceChildren();
    activeIndex = -1;

    if (!query) {
      closeSuggestions();
      return;
    }

    const matches = searchBooks
      .filter((title) => normalizeSearchText(title).includes(query))
      .slice(0, 7);

    if (matches.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'search-no-results';
      emptyMessage.textContent = 'Nenhum livro encontrado';
      suggestions.appendChild(emptyMessage);
    } else {
      matches.forEach((title) => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'search-suggestion';
        option.setAttribute('role', 'option');
        option.textContent = title;
        option.addEventListener('click', () => chooseSuggestion(title));
        suggestions.appendChild(option);
      });
    }

    suggestions.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener('input', updateSuggestions);
  input.addEventListener('keydown', (event) => {
    const options = [...suggestions.querySelectorAll('.search-suggestion')];

    if (event.key === 'Escape') {
      closeSuggestions();
      return;
    }

    if (!options.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + options.length) % options.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      chooseSuggestion(options[activeIndex < 0 ? 0 : activeIndex].textContent);
      return;
    } else {
      return;
    }

    options.forEach((option, index) => {
      option.classList.toggle('active', index === activeIndex);
      option.setAttribute('aria-selected', String(index === activeIndex));
    });
  });

  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) closeSuggestions();
  });
});
