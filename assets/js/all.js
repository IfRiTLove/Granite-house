const imageTabs = document.querySelectorAll('.image-tabs .tab');
const images = document.querySelectorAll('.image-tabs .image');
const tooltip = document.querySelector('.image-tabs .tooltip');
const arrowLeft = document.querySelector('.image-tabs .arrow-left');
const arrowRight = document.querySelector('.image-tabs .arrow-right');

// Перевіряємо, що кнопки знайдені
console.log('Left arrow:', arrowLeft);
console.log('Right arrow:', arrowRight);
let currentIndex = 0;

// Функція для автоматичної нумерації точок на кожній вкладці
function numberPoints() {
  images.forEach(image => {
    const points = image.querySelectorAll('.point');
    points.forEach((point, index) => {
      point.setAttribute('data-number', index + 1);
      point.textContent = index + 1;
    });
  });
}

function showImage(index) {
  images.forEach(img => img.classList.remove('active'));
  imageTabs.forEach(tab => {
    tab.classList.remove('active');
    // Видаляємо елементи відблисків з усіх вкладок
    const highlights = tab.querySelectorAll('.corner-highlight, .corner-highlight-bottom');
    highlights.forEach(el => el.remove());
  });

  // Перемикаємо контент у секції manufacture
  const manufactureContents = document.querySelectorAll('.manufacture-content');
  manufactureContents.forEach(content => content.classList.remove('active'));
  const activeContent = document.querySelector(`.manufacture-content[data-content="${index}"]`);
  if (activeContent) {
    activeContent.classList.add('active');
  }

  images[index].classList.add('active');
  imageTabs[index].classList.add('active');

  // Додаємо елементи відблисків до активної вкладки
  const activeTab = imageTabs[index];
  const cornerHighlight = document.createElement('div');
  cornerHighlight.className = 'corner-highlight';
  const cornerHighlightBottom = document.createElement('div');
  cornerHighlightBottom.className = 'corner-highlight-bottom';

  activeTab.appendChild(cornerHighlight);
  activeTab.appendChild(cornerHighlightBottom);

  currentIndex = index;
}

// Встановлюємо background-image для .image з data-bg
function setImageBackgrounds() {
  document.querySelectorAll('.image').forEach(image => {
    const bg = image.getAttribute('data-bg');
    if (bg) image.style.backgroundImage = `url('${bg}')`;
  });
}

// Функції ініціалізації
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.header_menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const closeMobileMenu = document.getElementById('close-mobile-menu');

  console.log('Mobile menu init:', {
    toggle: mobileMenuToggle,
    menu: mobileMenu,
    overlay: mobileOverlay,
    close: closeMobileMenu,
    toggleDisplay: mobileMenuToggle ? window.getComputedStyle(mobileMenuToggle).display : 'null',
    menuDisplay: mobileMenu ? window.getComputedStyle(mobileMenu).display : 'null',
    windowWidth: window.innerWidth,
    allElementsExist: !!(mobileMenuToggle && mobileMenu && mobileOverlay && closeMobileMenu)
  });

  if (!mobileMenuToggle || !mobileMenu || !mobileOverlay || !closeMobileMenu) {
    console.error('Mobile menu elements missing:', {
      toggle: !!mobileMenuToggle,
      menu: !!mobileMenu,
      overlay: !!mobileOverlay,
      close: !!closeMobileMenu
    });
  }

  function openMobileMenu() {
    console.log('Opening mobile menu...');
    if (mobileMenu && mobileOverlay) {
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
      console.log('Mobile menu opened successfully');
    } else {
      console.error('Mobile menu or overlay not found!', { mobileMenu, mobileOverlay });
    }
  }

  function closeMobileMenuFunc() {
    if (mobileMenu && mobileOverlay) {
      mobileMenu.classList.remove('open');
      mobileOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // Відкрити мобільне меню (тільки якщо кнопка видна)
  if (mobileMenuToggle) {
    const isVisible = window.getComputedStyle(mobileMenuToggle).display !== 'none';
    console.log('Mobile menu toggle visibility:', isVisible);

    if (isVisible) {
      mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Mobile menu toggle clicked on page:', window.location.pathname);
        openMobileMenu();
      });
      console.log('Mobile menu click listener added');
    } else {
      console.log('Mobile menu toggle is not visible, skipping click listener');
    }
  } else {
    console.warn('Mobile menu toggle not found!');
  }

  if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', closeMobileMenuFunc);
    console.log('Close mobile menu button listener added');
  } else {
    console.warn('Close mobile menu button not found!');
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenuFunc);
    console.log('Mobile overlay listener added');
  } else {
    console.warn('Mobile overlay not found!');
  }

  // Закрити меню при кліку на посилання
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenuFunc);
  });
}

function initModals() {
  // Створюємо модальні вікна динамічно, якщо вони не існують
  function createModalsIfNeeded() {
    if (!document.getElementById('consultation-modal')) {
      const consultationModalHTML = `
        <div id="consultation-modal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Безкоштовна консультація</h3>
              <button id="close-consultation-modal" class="modal-close">
                <i class="ri-close-line"></i>
              </button>
            </div>
            <div class="modal-body">
              <p class="title">Наш менеджер зв'яжеться з вами в найближчий час</p>
              <form id="consultation-form">
                <div class="form-group">
                  <input type="text" placeholder="Ваше ім'я*" required>
                </div>
                <div class="form-group">
                  <input type="tel" placeholder="Ваш телефон*" required>
                </div>
                <div class="form-group">
                  <textarea placeholder="Ваше повідомлення (необов'язково)"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Надіслати заявку</button>
                <p class="privacy-notice">
                  Натискаючи на кнопку, ви погоджуєтесь з
                  <a href="#">політикою обробки персональних даних</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      `;

      const successModalHTML = `
        <div id="success-modal" class="modal-overlay">
          <div class="modal-content success-modal">
            <div class="modal-header">
              <button id="close-success-modal" class="modal-close">
                <i class="ri-close-line"></i>
              </button>
            </div>
            <div class="modal-body text-center">
              <div class="success-icon">
                <i class="ri-check-line"></i>
              </div>
              <h3>Дякуємо!</h3>
              <p>Ваша заявка успішно надіслана.<br>Ми зв'яжемося з вами найближчим часом.</p>
              <button id="close-success-btn" class="btn btn-primary">Добре</button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', consultationModalHTML);
      document.body.insertAdjacentHTML('beforeend', successModalHTML);
    }
  }

  createModalsIfNeeded();

  // Функції модальних вікон
  function openConsultationModal() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeConsultationModalFunc() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  function openSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSuccessModalFunc() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // Обробники подій для попапів
  const consultationButtons = document.querySelectorAll('.forma-consult');
  consultationButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openConsultationModal();
    });
  });

  // Також обробляємо кнопки з текстом консультації
  // Але виключаємо кнопки всередині форм ask_form_no-bg
  const allButtons = document.querySelectorAll('.btn, button, a');
  allButtons.forEach(button => {
    const text = button.textContent.toLowerCase();
    if (text.includes('консультац') || text.includes('розрахун')) {
      // Перевіряємо, чи кнопка знаходиться всередині форми ask_form_no-bg
      const isInsideAskForm = button.closest('.ask_form_no-bg') !== null;
      if (!isInsideAskForm) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          openConsultationModal();
        });
      }
    }
  });

  // Додати обробники подій для модальних вікон після невеликої затримки
  setTimeout(() => {
    const closeConsultationModalEl = document.getElementById('close-consultation-modal');
    const closeSuccessModalEl = document.getElementById('close-success-modal');
    const closeSuccessBtnEl = document.getElementById('close-success-btn');
    const consultationModalEl = document.getElementById('consultation-modal');
    const successModalEl = document.getElementById('success-modal');

    if (closeConsultationModalEl) {
      closeConsultationModalEl.addEventListener('click', closeConsultationModalFunc);
    }

    if (closeSuccessModalEl) {
      closeSuccessModalEl.addEventListener('click', closeSuccessModalFunc);
    }

    if (closeSuccessBtnEl) {
      closeSuccessBtnEl.addEventListener('click', closeSuccessModalFunc);
    }

    // Закрити попап при кліку на overlay
    if (consultationModalEl) {
      consultationModalEl.addEventListener('click', function(e) {
        if (e.target === consultationModalEl) {
          closeConsultationModalFunc();
        }
      });
    }

    if (successModalEl) {
      successModalEl.addEventListener('click', function(e) {
        if (e.target === successModalEl) {
          closeSuccessModalFunc();
        }
      });
    }
  }, 100);

  // Форма консультації
  const consultationForm = document.getElementById('consultation-form');
  if (consultationForm) {
    consultationForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Валідація форми
      const nameInput = consultationForm.querySelector('input[type="text"]');
      const phoneInput = consultationForm.querySelector('input[type="tel"]');

      if (!nameInput.value.trim()) {
        alert('Будь ласка, введіть ваше ім\'я');
        nameInput.focus();
        return;
      }

      if (!phoneInput.value.trim()) {
        alert('Будь ласка, введіть ваш телефон');
        phoneInput.focus();
        return;
      }

      // Тут можна додати логіку відправки форми на сервер
      console.log('Форма консультації відправлена:', {
        name: nameInput.value,
        phone: phoneInput.value,
        message: consultationForm.querySelector('textarea').value
      });

      // Показати індикатор завантаження
      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Відправка...';
        submitBtn.disabled = true;
      }

      // Симулюємо відправку форми (замініть на реальну логіку AJAX)
      setTimeout(() => {
        // Закрити попап консультації та відкрити успішний
        closeConsultationModalFunc();

        setTimeout(() => {
          openSuccessModal();

          // Повернути кнопку в початковий стан
          if (submitBtn) {
            submitBtn.textContent = 'Надіслати заявку';
            submitBtn.disabled = false;
          }

          // Очистити форму
          consultationForm.reset();
        }, 300);
      }, 1000); // Симулюємо затримку відправки
    });
  }

  // Глобальні функції для зовнішнього використання
  window.openConsultationModal = openConsultationModal;
  window.closeConsultationModal = closeConsultationModalFunc;
}

function initImageTabs() {
  // Ініціалізація табів зображень (.image-tabs)
  const tabs = document.querySelectorAll('.image-tabs .tabs .tab');
  const images = document.querySelectorAll('.image-tabs .image-wrapper .images .image');

  if (tabs.length > 0 && images.length > 0) {
    function showImage(index) {
      // Приховуємо всі зображення
      images.forEach(img => img.classList.remove('active'));

      // Видаляємо активний клас з усіх табів
      tabs.forEach(tab => tab.classList.remove('active'));

      // Показуємо вибране зображення та активуємо таб
      if (images[index]) images[index].classList.add('active');
      if (tabs[index]) tabs[index].classList.add('active');
    }

    // Додаємо обробники подій для табів
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        showImage(index);
      });
    });

    // Показуємо перше зображення за замовчуванням
    showImage(0);
  }

  // Ініціалізація контентних табів (.content-tabs)
  const contentTabsBlocks = document.querySelectorAll('.content-tabs');
  contentTabsBlocks.forEach(block => {
    const tabs = block.querySelectorAll('.tabs .tab');
    const panes = block.querySelectorAll('.panes .pane');
    if (tabs.length === 0 || panes.length === 0) return;

    function showPane(index) {
      panes.forEach(p => p.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));
      if (panes[index]) {
        panes[index].classList.add('active');
        // Завантажуємо відео в активному табі
        const videoIframe = panes[index].querySelector('iframe[data-src]');
        if (videoIframe) {
          videoIframe.src = videoIframe.dataset.src;
          videoIframe.removeAttribute('data-src');
        }
      }
      if (tabs[index]) {
        tabs[index].classList.add('active');
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        showPane(index);
      });
    });

    // Показуємо перший таб за замовчуванням
    showPane(0);
  });
}

function initBlogFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const vacancyCards = document.querySelectorAll('.vacancy-card');

  console.log('Blog filters init:', { filterButtons: filterButtons.length, vacancyCards: vacancyCards.length });

  if (filterButtons.length === 0 || vacancyCards.length === 0) return;

  function filterVacancies(category) {
    console.log('Filtering by category:', category);

    let visibleCount = 0;
    vacancyCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === 'all' || cardCategory === category;

      if (shouldShow) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }

      console.log('Card:', cardCategory, 'should show:', shouldShow, 'visible count:', visibleCount);
    });

    console.log('Total visible cards:', visibleCount);

    // Оновлюємо активну кнопку
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      }
    });
  }

  // Додаємо обробники подій
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Filter button clicked:', button.dataset.category);
      const category = button.dataset.category;
      filterVacancies(category);
    });
  });

  // Додаємо глобальні функції для зовнішнього використання
  window.vacanciesFilter = {
    filter: filterVacancies
  };

  // Ініціалізація: показуємо всі вакансії
  console.log('Initializing blog filters with "all" category');
  setTimeout(() => {
    filterVacancies('all');
  }, 100);
}

function initSliders() {
  // Слайдер років
  const timeline = document.getElementById('timeline');
  const slider = document.getElementById('slider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slides = document.querySelectorAll('.slide');
  const timelineContainer = document.querySelector('.timeline-container');
  const sliderContainer = document.querySelector('.slider-container');

  // Внутренняя дорожка таймлайна, которую будем трансформировать
  const timelineTrack = (() => {
    if (!timeline) return null;
    let track = timeline.querySelector('.timeline-track');
    if (!track) {
      track = document.createElement('div');
      track.className = 'timeline-track';
      timeline.appendChild(track);
    }
    return track;
  })();

  if (!timeline || !timelineTrack || !slider || !prevBtn || !nextBtn || slides.length === 0 || !timelineContainer || !sliderContainer) {
    return;
  }

  // Збираємо роки зі слайдів
  const years = Array.from(slides).map(slide => slide.dataset.year);

  let currentIndex = years.indexOf('2018') !== -1 ? years.indexOf('2018') : 0;

  // Створюємо елементи таймлайну
  function createTimelineItems() {
    const activeIndex = currentIndex;
    timelineTrack.innerHTML = '';
    years.forEach((year, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.className = `timeline-item ${index === activeIndex ? 'active' : ''}`;
      timelineItem.dataset.index = index;

      const timelineDot = document.createElement('div');
      timelineDot.className = 'timeline-dot';
      timelineDot.textContent = year;

      timelineItem.appendChild(timelineDot);

      timelineItem.addEventListener('click', () => {
        goToSlide(index);
      });

      timelineTrack.appendChild(timelineItem);
    });
  }

  // Перехід до слайду
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;

    currentIndex = index;

    // Оновлюємо позицію слайдера
    const slideWidth = slides[0].offsetWidth;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;

    // Оновлюємо таймлайн
    createTimelineItems();

    // Центруємо активний елемент таймлайну з більшою затримкою для точності
    setTimeout(() => {
      centerActiveTimelineItem();
    }, 200);

    // Управління кнопками
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
  }

  // Управління кнопками
  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
  });

  // Функції для тач подій
  let startX = 0;
  let isDragging = false;

  function onTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
  }

  function onTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) { // Минимальное расстояние для свайпа
      if (diffX > 0) {
        goToSlide(currentIndex + 1); // Свайп влево - следующий слайд
      } else {
        goToSlide(currentIndex - 1); // Свайп вправо - предыдущий слайд
      }
    }
  }

  // Додаємо тач події
  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', onTouchStart, { passive: true });
    sliderContainer.addEventListener('touchmove', onTouchMove, { passive: false });
    sliderContainer.addEventListener('touchend', onTouchEnd, { passive: true });
    sliderContainer.addEventListener('touchcancel', onTouchEnd, { passive: true });
  }

  // Запуск додатку
  function init() {
    createTimelineItems();
    goToSlide(currentIndex);
    // Додаткове центрування після ініціалізації
    setTimeout(() => {
      centerActiveTimelineItem();
    }, 150);
  }

  init();
}

// Глобальная функция для открытия модального окна входа
function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Основная инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing components...');
  console.log('Current page:', window.location.pathname);
  console.log('Body class:', document.body.className);
  // Ініціалізація зображень та нумерації
  setImageBackgrounds();
  numberPoints();

  // Мобильное меню
  initMobileMenu();

  // Модальные окна
  initModals();

  // Табы в секции use/manufacture
  initImageTabs();

  // Фильтры вакансий
  initBlogFilters();

  // Слайдери та інші компоненти
  initSliders();

  // Ініціалізація мобільного меню
  initMobileMenu();

  // Обробка кнопок та модальних вікон (після ініціалізації всього)
  setTimeout(() => {
    // Обробка кнопок входу
    const loginButtons = document.querySelectorAll('.login-btn, [data-action="login"]');

    loginButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        openLoginModal();
      });
    });

    // Обробка закриття модального вікна входу
    const closeLoginBtn = document.getElementById('close-login-modal');
    const loginModal = document.getElementById('login-modal');

    if (closeLoginBtn) {
      closeLoginBtn.addEventListener('click', closeLoginModal);
    }

    if (loginModal) {
      loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
          closeLoginModal();
        }
      });
    }

    // Обробка форми входу
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = loginForm.querySelector('input[type="email"]');
        const passwordInput = loginForm.querySelector('input[type="password"]');

        if (!emailInput || !emailInput.value.trim()) {
          alert('Будь ласка, введіть email або телефон');
          if (emailInput) emailInput.focus();
          return;
        }

        if (!passwordInput || !passwordInput.value.trim()) {
          alert('Будь ласка, введіть пароль');
          if (passwordInput) passwordInput.focus();
          return;
        }

        console.log('Форма входу відправлена:', {
          email: emailInput.value,
          password: passwordInput.value,
          remember: loginForm.querySelector('input[name="remember"]').checked
        });

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Вхід...';
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          alert('Ви успішно увійшли в систему!');
          if (submitBtn) {
            submitBtn.textContent = 'Увійти';
            submitBtn.disabled = false;
          }
          closeLoginModal();
        }, 1500);
      });
    }
  }, 100);
});

imageTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    showImage(+tab.dataset.tab);
  });
});

if (arrowLeft) {
  arrowLeft.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(newIndex);
  });
}

if (arrowRight) {
  arrowRight.addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % images.length;
    showImage(newIndex);
  });
}

if (tooltip) {
  document.querySelectorAll('.point').forEach(point => {
    point.addEventListener('mouseenter', e => {
      tooltip.textContent = point.dataset.text;
      tooltip.style.display = 'block';

      const pointRect = point.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Позиционируем tooltip сверху над точкой
      tooltip.style.top = (pointRect.top - tooltipRect.height - 15 + window.scrollY) + 'px';
      // Центрируем tooltip по горизонтали относительно точки
      tooltip.style.left = (pointRect.left + pointRect.width / 2 - tooltipRect.width / 2 + window.scrollX) + 'px';
    });
    point.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}



// Слайдер годов - КОД ПЕРЕМІЩЕНО В initSliders()
/*
document.addEventListener('DOMContentLoaded', function () {
  const timeline = document.getElementById('timeline');
  const slider = document.getElementById('slider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slides = document.querySelectorAll('.slide');
  const timelineContainer = document.querySelector('.timeline-container');
  const sliderContainer = document.querySelector('.slider-container');
  // Внутренняя дорожка таймлайна, которую будем трансформировать
  const timelineTrack = (() => {
    if (!timeline) return null;
    let track = timeline.querySelector('.timeline-track');
    if (!track) {
      track = document.createElement('div');
      track.className = 'timeline-track';
      timeline.appendChild(track);
    }
    return track;
  })();

  if (!timeline || !timelineTrack || !slider || !prevBtn || !nextBtn || slides.length === 0 || !timelineContainer || !sliderContainer) {
    return;
  }

  // Збираємо роки зі слайдів
  const years = Array.from(slides).map(slide => slide.dataset.year);

  let currentIndex = years.indexOf('2018') !== -1 ? years.indexOf('2018') : 0;

  // Створюємо елементи таймлайну
  function createTimelineItems() {
    const activeIndex = currentIndex;
    timelineTrack.innerHTML = '';
    years.forEach((year, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.className = `timeline-item ${index === activeIndex ? 'active' : ''}`;
      timelineItem.dataset.index = index;

      timelineItem.innerHTML = `
                <div class="timeline-dot">${year}</div>
            `;

      timelineItem.addEventListener('click', () => {
        goToSlide(index);
      });

      timelineTrack.appendChild(timelineItem);
    });
  }

  // Функції навігації
  function getContainerInnerWidth() {
    const styles = getComputedStyle(sliderContainer);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    return sliderContainer.clientWidth - paddingLeft - paddingRight;
  }
  function goToSlide(index) {
    if (index < 0 || index >= years.length) return;

    currentIndex = index;
    // Смещение кратно ширине контейнера для точного позиционирования
    const slideWidth = getContainerInnerWidth();
    const offset = Math.round(slideWidth * currentIndex);
    slider.style.transform = `translateX(-${offset}px)`;
    updateActiveTimelineItem();
    updateNavButtons();
    centerActiveTimelineItem();
    adjustSliderHeight();
  }

  function updateActiveTimelineItem() {
    timelineTrack.querySelectorAll('.timeline-item').forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function isSmallScreen() {
    return window.innerWidth <= 1430;
  }

  function isMobileScreen() {
    const width = window.innerWidth;
    const isMobile = width <= 768;
    console.log('Screen width:', width, 'Is mobile:', isMobile);
    return isMobile;
  }

  function centerActiveTimelineItem() {
    const items = timelineTrack.querySelectorAll('.timeline-item');
    const activeItem = items[currentIndex];

    if (!activeItem) {
      console.log('No active item found for centering');
      return;
    }

    // Для малих екранів (<= 1430px) використовуємо scrollTo
    if (isSmallScreen()) {
      console.log('Centering active timeline item for small screens...');

      // Розрахуємо позицію для центрування
      const containerWidth = timelineContainer.offsetWidth;
      const itemLeft = activeItem.offsetLeft;
      const itemWidth = activeItem.offsetWidth;

      const itemCenter = itemLeft + itemWidth / 2;
      const containerCenter = containerWidth / 2;
      const targetScrollLeft = itemCenter - containerCenter;

      console.log('Small screen centering calculations:', {
        containerWidth,
        itemLeft,
        itemWidth,
        itemCenter,
        containerCenter,
        targetScrollLeft,
        currentScrollLeft: timelineContainer.scrollLeft
      });

      // Плавна прокрутка до центру активного елемента
      timelineContainer.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });

      console.log('Scrolled container to center active item');
      return;
    }

    // Для великих екранів (>= 1431px) використовуємо transform
    console.log('Centering active timeline item for large screens...');

    const containerRect = timelineContainer.getBoundingClientRect();
    const activeRect = activeItem.getBoundingClientRect();

    const containerCenter = containerRect.left + containerRect.width / 2;
    const activeCenter = activeRect.left + activeRect.width / 2;

    const delta = containerCenter - activeCenter;

    const currentTransform = getComputedStyle(timelineTrack).transform;
    let currentTranslateX = 0;
    if (currentTransform && currentTransform !== 'none') {
      const matrix = new DOMMatrixReadOnly(currentTransform);
      currentTranslateX = matrix.m41;
    }

    let nextTranslateX = currentTranslateX + delta;

    // Обмежуємо рух в межах контейнера
    const maxTranslate = 0; // не уходим правее начала
    const trackWidth = timelineTrack.scrollWidth;
    const containerWidth = timelineContainer.clientWidth;
    const minTranslate = Math.min(0, containerWidth - trackWidth); // не уходим левее конца

    nextTranslateX = Math.max(minTranslate, Math.min(maxTranslate, nextTranslateX));

    console.log('Large screen centering calculations:', {
      containerCenter,
      activeCenter,
      delta,
      currentTranslateX,
      nextTranslateX,
      minTranslate,
      maxTranslate
    });

    timelineTrack.style.transform = `translateX(${nextTranslateX}px)`;
    timelineTrack.style.transition = 'transform 0.3s ease';
  }

  function updateNavButtons() {
    prevBtn.classList.toggle('disabled', currentIndex === 0);
    nextBtn.classList.toggle('disabled', currentIndex === years.length - 1);
  }

  // Адаптація висоти слайдера для мобільних (<= 768px)
  function adjustSliderHeight() {
    if (window.innerWidth > 768) {
      sliderContainer.style.height = '';
      return;
    }
    const activeSlide = slides[currentIndex];
    if (!activeSlide) return;

    // Дочекатися завантаження зображень в активному слайді
    const images = Array.from(activeSlide.querySelectorAll('img'));
    const unloaded = images.filter(img => !img.complete);

    const setHeight = () => {
      // Временно сбрасываем высоту, чтобы измерить естественную
      sliderContainer.style.height = 'auto';
      const contentHeight = activeSlide.scrollHeight + 40; // учесть внутренние отступы контейнера
      sliderContainer.style.height = contentHeight + 'px';
    };

    if (unloaded.length > 0) {
      let remaining = unloaded.length;
      unloaded.forEach(img => {
        img.addEventListener('load', () => {
          remaining -= 1;
          if (remaining === 0) setHeight();
        }, { once: true });
        img.addEventListener('error', () => {
          remaining -= 1;
          if (remaining === 0) setHeight();
        }, { once: true });
      });
    } else {
      setHeight();
    }
  }

  // Ініціалізація
  function init() {
    createTimelineItems();
    goToSlide(currentIndex);
    // adjustSliderHeight(); // Вимкнено, розміри регулюються через CSS

    // Додатково центруємо після ініціалізації
    setTimeout(() => {
      console.log('Additional centering after init');
      centerActiveTimelineItem();
    }, 100);

    // Обробники кнопок
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < years.length - 1) {
        goToSlide(currentIndex + 1);
      }
    });

    window.addEventListener('resize', () => {
      // Спочатку центруємо таймлайн
      centerActiveTimelineItem();

      // Потім регулюємо висоту слайдера
      adjustSliderHeight();

      // Пересчёт смещения слайдера под новую ширину контейнера
      const slideWidth = getContainerInnerWidth();
      const offset = Math.round(slideWidth * currentIndex);
      slider.style.transform = `translateX(-${offset}px)`;

      // Додаткове центрування після зміни розміру з більшою затримкою
      setTimeout(() => {
        centerActiveTimelineItem();
      }, 200);
    });

    initSwipe();
    adjustSliderHeight();
  }

  // Сенсорне гортання слайдера
  function initSwipe() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
    let isTracking = false;
    const SWIPE_THRESHOLD = 50; // px

    function onTouchStart(e) {
      const t = e.touches && e.touches[0] ? e.touches[0] : null;
      if (!t) return;
      isTracking = true;
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchCurrentX = touchStartX;
      touchCurrentY = touchStartY;
    }

    function onTouchMove(e) {
      if (!isTracking) return;
      const t = e.touches && e.touches[0] ? e.touches[0] : null;
      if (!t) return;
      touchCurrentX = t.clientX;
      touchCurrentY = t.clientY;
    }

    function onTouchEnd() {
      if (!isTracking) return;
      isTracking = false;
      const deltaX = touchCurrentX - touchStartX;
      const deltaY = touchCurrentY - touchStartY;

      // Вважаємо свайпом тільки домінуючий горизонтальний рух
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0 && currentIndex < years.length - 1) {
          goToSlide(currentIndex + 1);
        } else if (deltaX > 0 && currentIndex > 0) {
          goToSlide(currentIndex - 1);
        }
      }
    }

    sliderContainer.addEventListener('touchstart', onTouchStart, { passive: true });
    sliderContainer.addEventListener('touchmove', onTouchMove, { passive: true });
    sliderContainer.addEventListener('touchend', onTouchEnd, { passive: true });
    sliderContainer.addEventListener('touchcancel', onTouchEnd, { passive: true });
  }

  // Запуск додатку
  init();

  // Зміна розміру
  // window.addEventListener('resize', adjustSliderHeight); // Вимкнено
});
*/

// Контентные табы на about.html (.content-tabs) - КОД ПЕРЕМІЩЕНО В initImageTabs()
/*
document.addEventListener('DOMContentLoaded', () => {
  const contentTabsBlocks = document.querySelectorAll('.content-tabs');
  contentTabsBlocks.forEach(block => {
    const tabs = block.querySelectorAll('.tabs .tab');
    const panes = block.querySelectorAll('.panes .pane');
    if (tabs.length === 0 || panes.length === 0) return;

    function showPane(index) {
      panes.forEach(p => p.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));
      if (panes[index]) {
        panes[index].classList.add('active');
        // Завантажуємо відео в активному табі
        const videoIframe = panes[index].querySelector('iframe[data-src]');
        if (videoIframe) {
          videoIframe.src = videoIframe.dataset.src;
          videoIframe.removeAttribute('data-src');
        }
      }
      if (tabs[index]) tabs[index].classList.add('active');
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = Number(tab.dataset.tab) || 0;
        showPane(idx);
      });
    });

    // Ініціалізація
    showPane(0);
  });
*/

  // Lazy loading та обробка помилок YouTube iframe - ПЕРЕМІЩЕНО В ОСНОВНУ ІНІЦІАЛІЗАЦІЮ
  /*
  document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('iframe[data-src*="youtube.com"]');

    // Функція для завантаження відео
    function loadVideo(iframe) {
      if (iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
        iframe.removeAttribute('data-src');
      }
    }

    // Спостерігач для lazy loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    iframes.forEach(iframe => {
      // Спостерігаємо за iframe
      observer.observe(iframe);

      // Обробка помилок
      iframe.addEventListener('error', () => {
        const container = iframe.parentElement;
        container.innerHTML = `
        <div class="video-error">
          <div>
            <p>Відео тимчасово недоступне</p>
            <p style="font-size: 14px; margin-top: 10px; opacity: 0.8;">Спробуйте оновити сторінку або вимкнути блокувальник реклами</p>
          </div>
        </div>
      `;
      });
    });
  });
});
*/

// Geography табы - ПЕРЕМІЩЕНО В ОСНОВНУ ІНІЦІАЛІЗАЦІЮ
/*
document.addEventListener('DOMContentLoaded', () => {
  function initGeographyTabs() {
    const geographyTabs = document.querySelectorAll('.geography-tabs .tab');
    const geographyImages = document.querySelectorAll('.geography-images .geo-image');
    const isProductionPage = document.body.classList.contains('production');
    const tabsContainer = document.querySelector('.geography-tabs .tabs');

    if (!tabsContainer || geographyTabs.length === 0) {
      console.warn('Geography tabs not found or container missing');
      return;
    }

    console.log('Initializing geography tabs:', {
      tabsCount: geographyTabs.length,
      imagesCount: geographyImages.length,
      isProduction: isProductionPage
    });

    function showGeographyTab(index) {
      console.log('Switching to tab:', index);

      // Оновлюємо активну вкладку
      geographyTabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
      });

      // Оновлюємо активне зображення
      geographyImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });

      // Оновлюємо кастомний селект
      const customSelect = document.querySelector('.custom-geo-select');
      if (customSelect) {
        const selected = customSelect.querySelector('.custom-select-selected');
        const options = customSelect.querySelectorAll('.custom-select-option');

        if (selected && geographyTabs[index]) {
          selected.textContent = geographyTabs[index].textContent.trim();
        }

        options.forEach((opt, i) => {
          opt.classList.toggle('active', i === index);
        });
      }
    }

    // Обробники для звичайних табів
    geographyTabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        showGeographyTab(index);
      });
    });

    // Створюємо кастомний селект для мобільних на production
    if (isProductionPage) {
      const customSelect = document.createElement('div');
      customSelect.className = 'custom-geo-select';

      const selectedDiv = document.createElement('div');
      selectedDiv.className = 'custom-select-selected';
      selectedDiv.textContent = geographyTabs[0].textContent.trim();

      const arrow = document.createElement('div');
      arrow.className = 'custom-select-arrow';
      const arrowImg = document.createElement('img');
      arrowImg.src = 'assets/images/right-select.png';
      arrowImg.alt = '';
      arrow.appendChild(arrowImg);

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'custom-select-options';

      // Створюємо опції
      geographyTabs.forEach((tab, index) => {
        const option = document.createElement('div');
        option.className = 'custom-select-option';
        option.textContent = tab.textContent.trim();
        if (index === 0) option.classList.add('active');

        option.addEventListener('click', (e) => {
          e.stopPropagation();
          showGeographyTab(index);
          customSelect.classList.remove('open');
        });

        optionsDiv.appendChild(option);
      });

      // Открытие/закрытие селекта
      selectedDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = customSelect.classList.contains('open');

        // Закрываем все другие селекты
        document.querySelectorAll('.custom-geo-select.open').forEach(select => {
          if (select !== customSelect) {
            select.classList.remove('open');
          }
        });

        customSelect.classList.toggle('open', !wasOpen);
      });

      // Закрытие при клике вне
      document.addEventListener('click', () => {
        customSelect.classList.remove('open');
      });

      // Збираємо селект
      customSelect.appendChild(selectedDiv);
      customSelect.appendChild(arrow);
      customSelect.appendChild(optionsDiv);

      // Вставляем в начало контейнера
      tabsContainer.insertBefore(customSelect, tabsContainer.firstChild);
    }

    // Показываем первый таб
    showGeographyTab(0);
  }

  // Ініціалізація после загрузки DOM
  initGeographyTabs();
});
*/



// Функциональность фильтрации вакансий - ПЕРЕМІЩЕНО В initVacancyFilters()
/*
document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const vacancyCards = document.querySelectorAll('.vacancy-card');



  // Функция фильтрации
  function filterVacancies(category) {
    // Додаємо клас animating для всіх карток
    vacancyCards.forEach(card => card.classList.add('animating'));

    // Сначала скрываем все карточки плавно
    vacancyCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        // Карточка должна быть видна
        if (card.style.display === 'none') {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';

          // Плавная анимация появления
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        }
      } else {
        // Карточка должна быть скрыта
        if (card.style.display !== 'none') {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(-10px)';

          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      }
    });

    // Убираем класс animating после завершения анимации
    setTimeout(() => {
      vacancyCards.forEach(card => card.classList.remove('animating'));
    }, 500);


  }



  // Обробники кліків по кнопкам фільтра
  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Знімаємо активний клас з усіх кнопок
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Додаємо активний клас до натиснутої кнопки
      this.classList.add('active');

      // Получаем категорию для фильтрации
      const category = this.dataset.category;

      // Применяем фильтрацию
      filterVacancies(category);

    });
  });

  // Додаємо глобальні функції для зовнішнього використання
  window.vacanciesFilter = {
    filter: filterVacancies
  };

  // Ініціалізація: показуємо всі вакансії
  filterVacancies('all');
});
*/

// Мобільне меню та попапи - КОД ПЕРЕМІЩЕНО В initMobileMenu() та initModals()
/*
document.addEventListener('DOMContentLoaded', function() {
  // Створюємо модальні вікна динамічно, якщо вони не існують
  function createModalsIfNeeded() {
    if (!document.getElementById('consultation-modal')) {
      const consultationModalHTML = `
        <div id="consultation-modal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Безкоштовна консультація</h3>
              <button id="close-consultation-modal" class="modal-close">
                <i class="ri-close-line"></i>
              </button>
            </div>
            <div class="modal-body">
              <p class="title">Наш менеджер зв'яжеться з вами в найближчий час</p>
              <form id="consultation-form">
                <div class="form-group">
                  <input type="text" placeholder="Ваше ім'я*" required>
                </div>
                <div class="form-group">
                  <input type="tel" placeholder="Ваш телефон*" required>
                </div>
                <div class="form-group">
                  <textarea placeholder="Ваше повідомлення (необов'язково)"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Надіслати заявку</button>
                <p class="privacy-notice">
                  Натискаючи на кнопку, ви погоджуєтесь з
                  <a href="#">політикою обробки персональних даних</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      `;

      const successModalHTML = `
        <div id="success-modal" class="modal-overlay">
          <div class="modal-content success-modal">
            <div class="modal-header">
              <button id="close-success-modal" class="modal-close">
                <i class="ri-close-line"></i>
              </button>
            </div>
            <div class="modal-body text-center">
              <div class="success-icon">
                <i class="ri-check-line"></i>
              </div>
              <h3>Дякуємо!</h3>
              <p>Ваша заявка успішно надіслана.<br>Ми зв'яжемося з вами найближчим часом.</p>
              <button id="close-success-btn" class="btn btn-primary">Добре</button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', consultationModalHTML);
      document.body.insertAdjacentHTML('beforeend', successModalHTML);
    }
  }

  createModalsIfNeeded();

  // Отримати елементи модальних вікон після їх створення
  const consultationModal = document.getElementById('consultation-modal');
  const successModal = document.getElementById('success-modal');
  const consultationForm = document.getElementById('consultation-form');
  const closeConsultationModal = document.getElementById('close-consultation-modal');
  const closeSuccessModal = document.getElementById('close-success-modal');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  // Мобільне меню
  const mobileMenuToggle = document.querySelector('.header_menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const closeMobileMenu = document.getElementById('close-mobile-menu');

  // Відкрити мобільне меню (тільки якщо кнопка видна)
  if (mobileMenuToggle && window.getComputedStyle(mobileMenuToggle).display !== 'none') {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  }

  // Закрити мобільне меню
  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', closeMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  // Закрити меню при кліку на посилання
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Попапи консультації
  function openConsultationModal() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeConsultationModalFunc() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // Функції модальних вікон входу винесені в глобальний scope вище

  function openSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSuccessModalFunc() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  // Обробники подій для попапів
  const consultationButtons = document.querySelectorAll('.forma-consult');
  consultationButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openConsultationModal();
    });
  });

  // Також обробляємо кнопки з текстом консультації
  // Але виключаємо кнопки всередині форм ask_form_no-bg
  const allButtons = document.querySelectorAll('.btn, button, a');
  allButtons.forEach(button => {
    const text = button.textContent.toLowerCase();
    if (text.includes('консультац') || text.includes('розрахун')) {
      // Перевіряємо, чи кнопка знаходиться всередині форми ask_form_no-bg
      const isInsideAskForm = button.closest('.ask_form_no-bg') !== null;
      if (!isInsideAskForm) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          openConsultationModal();
        });
      }
    }
  });


  // Форма консультації
  const consultationForm = document.getElementById('consultation-form');
  if (consultationForm) {
    consultationForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Валідація форми
      const nameInput = consultationForm.querySelector('input[type="text"]');
      const phoneInput = consultationForm.querySelector('input[type="tel"]');

      if (!nameInput.value.trim()) {
        alert('Будь ласка, введіть ваше ім\'я');
        nameInput.focus();
        return;
      }

      if (!phoneInput.value.trim()) {
        alert('Будь ласка, введіть ваш телефон');
        phoneInput.focus();
        return;
      }

      // Тут можна додати логіку відправки форми на сервер
      console.log('Форма консультації відправлена:', {
        name: nameInput.value,
        phone: phoneInput.value,
        message: consultationForm.querySelector('textarea').value
      });

      // Показати індикатор завантаження
      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Відправка...';
        submitBtn.disabled = true;
      }

      // Симулюємо відправку форми (замініть на реальну логіку AJAX)
      setTimeout(() => {
        // Закрити попап консультації та відкрити успішний
        closeConsultationModalFunc();

        setTimeout(() => {
          openSuccessModal();

          // Повернути кнопку в початковий стан
          if (submitBtn) {
            submitBtn.textContent = 'Надіслати заявку';
            submitBtn.disabled = false;
          }

          // Очистити форму
          consultationForm.reset();
        }, 300);
      }, 1000); // Симулюємо затримку відправки
    });
  }

  // Обробка всіх inline форм консультації (ask_form_no-bg)
  function handleInlineConsultationForm(formId, buttonText = 'Отримати консультацію') {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Валідація форми
      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');

      if (!nameInput || !nameInput.value.trim()) {
        alert('Будь ласка, введіть ваше ім\'я');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!phoneInput || !phoneInput.value.trim()) {
        alert('Будь ласка, введіть ваш телефон');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Тут можна додати логіку відправки форми на сервер
      console.log(`Inline форма ${formId} відправлена:`, {
        name: nameInput.value,
        phone: phoneInput.value
      });

      // Показати індикатор завантаження
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Відправка...';
        submitBtn.disabled = true;
      }

      // Симулюємо відправку форми (замініть на реальну логіку AJAX)
      setTimeout(() => {
        // Показати повідомлення про успішну відправку
        alert('Дякуємо! Ваша заявка на консультацію успішно відправлена. Ми зв\'яжемося з вами найближчим часом.');

        // Повернути кнопку в початковий стан
        if (submitBtn) {
          submitBtn.textContent = buttonText;
          submitBtn.disabled = false;
        }

        // Очистити форму
        form.reset();
      }, 1000); // Симулюємо затримку відправки
    });
  }

  // Ініціалізація всіх inline форм консультації
  handleInlineConsultationForm('consultation-form-inline', 'Отримати консультацію');
  handleInlineConsultationForm('consultation-form-mission', 'Отримати консультацію');
  handleInlineConsultationForm('consultation-form-about-consultation', 'Отримати консультацію');
  handleInlineConsultationForm('consultation-form-production', 'Отримати консультацію');
  handleInlineConsultationForm('consultation-form-contacts', 'Отримати консультацію');
  handleInlineConsultationForm('consultation-form-blog', 'Отримати консультацію');
  handleInlineConsultationForm('consultation-form-article', 'Отримати консультацію');
  handleInlineConsultationForm('consultation-form-portfolio', 'Отримати консультацію');

  // Обробка кнопок входу винесена в основний DOMContentLoaded обробник


  // Додати обробники подій для модальних вікон після невеликої затримки
  setTimeout(() => {
    const closeConsultationModalEl = document.getElementById('close-consultation-modal');
    const closeSuccessModalEl = document.getElementById('close-success-modal');
    const closeSuccessBtnEl = document.getElementById('close-success-btn');
    const consultationModalEl = document.getElementById('consultation-modal');
    const successModalEl = document.getElementById('success-modal');

    if (closeConsultationModalEl) {
      closeConsultationModalEl.addEventListener('click', closeConsultationModalFunc);
    }

    if (closeSuccessModalEl) {
      closeSuccessModalEl.addEventListener('click', closeSuccessModalFunc);
    }

    if (closeSuccessBtnEl) {
      closeSuccessBtnEl.addEventListener('click', closeSuccessModalFunc);
    }

    // Закрити попап при кліку на overlay
    if (consultationModalEl) {
      consultationModalEl.addEventListener('click', function(e) {
        if (e.target === consultationModalEl) {
          closeConsultationModalFunc();
        }
      });
    }

    if (successModalEl) {
      successModalEl.addEventListener('click', function(e) {
        if (e.target === successModalEl) {
          closeSuccessModalFunc();
        }
      });
    }
  }, 100);

  // Додати обробники для модального вікна входу
  setTimeout(() => {
    const closeLoginModalEl = document.getElementById('close-login-modal');
    const loginModalEl = document.getElementById('login-modal');

    if (closeLoginModalEl) {
      closeLoginModalEl.addEventListener('click', closeLoginModalFunc);
    }

    if (loginModalEl) {
      loginModalEl.addEventListener('click', function(e) {
        if (e.target === loginModalEl) {
          closeLoginModalFunc();
        }
      });
    }
  }, 100);

  // Глобальні функції для зовнішнього використання
  window.openConsultationModal = openConsultationModal;
  window.closeConsultationModal = closeConsultationModalFunc;
});
*/




