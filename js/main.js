/**
 * КСС — Клініка сімейної стоматології (Ужгород)
 * Головний JavaScript-модуль
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initBeforeAfterSlider();
  initCaseSwitcher();
  initServicesFilter();
  initBookingModal();
  initPhoneMask();
  initForms();
  initStickyWidget();
});

/* ==========================================================================
   1. Header Scroll Effect
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Мобільне меню
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-menu .nav-link');

  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Інтерактивний Before / After Слайдер
   ========================================================================== */
let currentSliderRatio = 50;

function initBeforeAfterSlider() {
  const container = document.querySelector('.comparison-container');
  const beforeImage = document.querySelector('.comparison-image.image-before');
  const handle = document.querySelector('.slider-handle');

  if (!container || !beforeImage || !handle) return;

  let isDragging = false;

  const updateSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;

    // Обмеження від 2% до 98%
    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;

    currentSliderRatio = percentage;
    beforeImage.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  // Події Pointer (працюють для мишки, стилуса та тач-екранів)
  const onPointerDown = (e) => {
    isDragging = true;
    updateSlider(e.clientX);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  };

  const onPointerUp = () => {
    isDragging = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  container.addEventListener('pointerdown', onPointerDown);

  // Оновлення при ресайзі
  window.addEventListener('resize', () => {
    beforeImage.style.width = `${currentSliderRatio}%`;
    handle.style.left = `${currentSliderRatio}%`;
  });
}

/* ==========================================================================
   4. Перемикач клінічних кейсів Before / After
   ========================================================================== */
const CLINICAL_CASES = {
  whitening: {
    title: "Професійне відбілювання Beyond Ultra 2",
    notes: "Освітлення на 6 тонів за 1 сеанс без гіперчутливості емалі",
    before: "assets/before_after/case_08_whitening_1.jpg",
    after: "assets/before_after/case_08_whitening_2.jpg"
  },
  veneers: {
    title: "Безметалеві керамічні коронки та вініри E-MAX",
    notes: "Ідеальне відновлення форми, кольору та природної анатомії",
    before: "assets/before_after/case_02_veneers_1.jpg",
    after: "assets/before_after/case_02_veneers_2.jpg"
  },
  braces: {
    title: "Ортодонтичне виправлення прикусу брекет-системою",
    notes: "Вирівнювання зубного ряду та правильне змикання щелеп",
    before: "assets/before_after/case_05_braces_1.jpg",
    after: "assets/before_after/case_05_braces_2.jpg"
  },
  allon4: {
    title: "Тотальна імплантація All-on-4 на верхню щелепу",
    notes: "Незнімна конструкція з діоксиду цирконію на титановій балці",
    before: "assets/before_after/case_03_all_on_4_1.jpg",
    after: "assets/before_after/case_03_all_on_4_2.jpg"
  },
  restoration: {
    title: "Пряма художня реставрація фронтальних зубів",
    notes: "Усунення відколу та дефекту емалі фотополімерним нанокомпозитом",
    before: "assets/before_after/case_01_restoration_1.jpg",
    after: "assets/before_after/case_01_restoration_2.jpg"
  },
  hygiene: {
    title: "Професійна гігієна Air-Flow (Prophy Pearls)",
    notes: "Зняття під'ясенного каменю, пігментованого нальоту та полірування",
    before: "assets/before_after/case_07_hygiene_1.jpg",
    after: "assets/before_after/case_07_hygiene_2.jpg"
  }
};

function initCaseSwitcher() {
  const tabBtns = document.querySelectorAll('.case-tab-btn');
  const imgBefore = document.getElementById('sliderImgBefore');
  const imgAfter = document.getElementById('sliderImgAfter');
  const caseTitle = document.getElementById('caseTitle');
  const caseNotes = document.getElementById('caseNotes');

  if (!tabBtns.length || !imgBefore || !imgAfter) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const caseKey = btn.getAttribute('data-case');
      const data = CLINICAL_CASES[caseKey];

      if (data) {
        imgBefore.src = data.before;
        imgAfter.src = data.after;
        if (caseTitle) caseTitle.textContent = data.title;
        if (caseNotes) caseNotes.textContent = data.notes;
      }
    });
  });
}

/* ==========================================================================
   5. Фільтрація послуг
   ========================================================================== */
function initServicesFilter() {
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const cards = document.querySelectorAll('.service-card');

  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Модальне вікно запису
   ========================================================================== */
function initBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtn = document.getElementById('modalCloseBtn');
  const serviceSelect = document.getElementById('modalServiceSelect');

  if (!modalOverlay) return;

  const openModal = (preselectedService = '') => {
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');

    if (serviceSelect && preselectedService) {
      const exists = Array.from(serviceSelect.options).some(o => o.value === preselectedService);
      if (exists) {
        serviceSelect.value = preselectedService;
      }
    }
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Маска та валідація телефону
   ========================================================================== */
function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (!input.value) {
        input.value = '+380';
      }
    });

    input.addEventListener('input', () => {
      let val = input.value.replace(/[^\d+]/g, '');
      if (!val.startsWith('+380')) {
        val = '+380';
      }
      input.value = val.slice(0, 13);
    });
  });
}

/* ==========================================================================
   8. Обробка відправки форм & Кастомний тост
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll('form[data-ajax-form]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');

      if (nameInput && nameInput.value.trim().length < 2) {
        showToast('Будь ласка, введіть коректне ім’я');
        nameInput.focus();
        return;
      }

      if (phoneInput && phoneInput.value.length < 13) {
        showToast('Введіть повний номер телефону (+380...)');
        phoneInput.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Відправка...';
      }

      // Імітація швидкої відправки
      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        const modal = document.getElementById('bookingModal');
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
        }

        showToast('✅ Дякуємо! Адміністратор КСС зателефонує вам протягом 5 хвилин.');
      }, 700);
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   9. Sticky CTA Віджет
   ========================================================================== */
function initStickyWidget() {
  const mainBtn = document.getElementById('stickyMainBtn');
  const menu = document.getElementById('stickyMenu');

  if (!mainBtn || !menu) return;

  mainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== mainBtn) {
      menu.classList.remove('open');
    }
  });
}
