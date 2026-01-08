// Каталог з фільтрами
document.addEventListener('DOMContentLoaded', function() {
  // Дані продуктів (приклад)
  const products = [
    {
      id: 1,
      name: 'Гранітна плита сіра',
      category: 'plates',
      price: 1200,
      color: 'gray',
      size: 'large',
      image: 'assets/images/img1.png',
      sku: 'ГП-001'
    },
    {
      id: 2,
      name: 'Брусчатка коричнева',
      category: 'paving',
      price: 950,
      color: 'brown',
      size: 'medium',
      image: 'assets/images/img2.png',
      sku: 'БР-002'
    },
    {
      id: 3,
      name: 'Бордюр гранітний',
      category: 'curbs',
      price: 450,
      color: 'gray',
      size: 'medium',
      image: 'assets/images/img3.png',
      sku: 'БД-003'
    },
    {
      id: 4,
      name: 'Плита чорна',
      category: 'plates',
      price: 1500,
      color: 'black',
      size: 'large',
      image: 'assets/images/img4.png',
      sku: 'ГП-004'
    },
    {
      id: 5,
      name: 'Брусчатка сіра',
      category: 'paving',
      price: 850,
      color: 'gray',
      size: 'small',
      image: 'assets/images/img1-1.png',
      sku: 'БР-005'
    },
    {
      id: 6,
      name: 'Бордюр малий',
      category: 'curbs',
      price: 350,
      color: 'gray',
      size: 'small',
      image: 'assets/images/img2-2.png',
      sku: 'БД-006'
    }
  ];

  let filteredProducts = [...products];
  let currentPage = 1;
  const productsPerPage = 12;

  // Ініціалізація
  initializeFilters();
  applyFilters();

  // Функції фільтрів
  function initializeFilters() {
    // Відкривання/закривання фільтрів
    document.querySelectorAll('.filter-header').forEach(header => {
      header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('i');

        content.classList.toggle('expanded');
        icon.classList.toggle('rotated');
      });
    });

    // Кнопка скидання фільтрів
    document.getElementById('reset-filters').addEventListener('click', resetFilters);

    // Мобільні фільтри
    setupMobileFilters();
  }

  function applyFilters() {
    const selectedCategories = getSelectedValues('input[value][type="checkbox"]:checked');
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
    const selectedColors = getSelectedValues('input[value][type="checkbox"]:checked');
    const selectedSizes = getSelectedValues('input[value][type="checkbox"]:checked');
    const sortOption = document.getElementById('sort-select').value;

    // Фільтрація продуктів
    filteredProducts = products.filter(product => {
      const categoryMatch = selectedCategories.length === 0 ||
                          selectedCategories.includes(product.category);
      const priceMatch = product.price >= minPrice && product.price <= maxPrice;
      const colorMatch = selectedColors.length === 0 ||
                        selectedColors.includes(product.color);
      const sizeMatch = selectedSizes.length === 0 ||
                       selectedSizes.includes(product.size);

      return categoryMatch && priceMatch && colorMatch && sizeMatch;
    });

    // Сортування
    switch (sortOption) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // За замовчуванням - без сортування
        break;
    }

    renderProducts();
    updateResultsCount();
  }

  function getSelectedValues(selector) {
    const checkboxes = document.querySelectorAll(selector);
    const values = [];

    checkboxes.forEach(checkbox => {
      const filterGroup = checkbox.closest('.filter-group');
      if (filterGroup) {
        const filterType = getFilterType(filterGroup);
        if (filterType && checkbox.checked) {
          values.push(checkbox.value);
        }
      }
    });

    return values;
  }

  function getFilterType(filterGroup) {
    if (filterGroup.querySelector('#categories-content')) return 'category';
    if (filterGroup.querySelector('#price-content')) return 'price';
    if (filterGroup.querySelector('#color-content')) return 'color';
    if (filterGroup.querySelector('#size-content')) return 'size';
    return null;
  }

  function resetFilters() {
    // Скидання чекбоксів
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });

    // Скидання цін
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';

    // Скидання сортування
    document.getElementById('sort-select').value = 'default';

    applyFilters();
  }

  function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsGrid.innerHTML = '';

    if (productsToShow.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products">
          <p>Немає товарів, що відповідають критеріям пошуку</p>
        </div>
      `;
      return;
    }

    productsToShow.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <a href="#" class="product-name">${product.name}</a>
          <div class="product-price">${product.price} ₴</div>
          <span class="product-sku">Артикул: ${product.sku}</span>
          <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
            Додати в кошик
          </button>
        </div>
      `;
      productsGrid.appendChild(productCard);
    });

    renderPagination();
  }

  function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Попередня сторінка
    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'pagination-btn';
      prevBtn.textContent = '←';
      prevBtn.onclick = () => changePage(currentPage - 1);
      pagination.appendChild(prevBtn);
    }

    // Номери сторінок
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.onclick = () => changePage(i);
      pagination.appendChild(pageBtn);
    }

    // Наступна сторінка
    if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'pagination-btn';
      nextBtn.textContent = '→';
      nextBtn.onclick = () => changePage(currentPage + 1);
      pagination.appendChild(nextBtn);
    }
  }

  function changePage(page) {
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateResultsCount() {
    const countElement = document.getElementById('results-count');
    countElement.textContent = filteredProducts.length;
  }

  function toggleFilter(filterId) {
    const content = document.getElementById(`${filterId}-content`);
    const icon = document.querySelector(`[onclick="toggleFilter('${filterId}')"] i`);

    content.classList.toggle('expanded');
    icon.classList.toggle('rotated');
  }

  function setupMobileFilters() {
    const mobileFilterBtn = document.querySelector('.mobile-filter-button');
    const mobileOverlay = document.getElementById('mobile-filters-overlay');
    const mobilePanel = document.getElementById('mobile-filters-panel');
    const closeMobileFilters = document.getElementById('close-mobile-filters');
    const applyMobileFilters = document.getElementById('apply-mobile-filters');
    const resetMobileFilters = document.getElementById('reset-mobile-filters');

    if (mobileFilterBtn) {
      mobileFilterBtn.addEventListener('click', () => {
        mobilePanel.classList.add('open');
        mobileOverlay.classList.add('show');
      });
    }

    if (closeMobileFilters) {
      closeMobileFilters.addEventListener('click', closeMobileFiltersPanel);
    }

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobileFiltersPanel);
    }

    if (applyMobileFilters) {
      applyMobileFilters.addEventListener('click', () => {
        closeMobileFiltersPanel();
        applyFilters();
      });
    }

    if (resetMobileFilters) {
      resetMobileFilters.addEventListener('click', () => {
        resetFilters();
        closeMobileFiltersPanel();
      });
    }

    function closeMobileFiltersPanel() {
      mobilePanel.classList.remove('open');
      mobileOverlay.classList.remove('show');
    }
  }

  // Функція додавання в кошик (заглушка)
  window.addToCart = function(productId) {
    alert(`Товар додано в кошик! ID: ${productId}`);
  };

  // Функція для перемикання фільтрів (глобальна)
  window.toggleFilter = toggleFilter;
});
