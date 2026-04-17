// ===== HOME PAGE HANDLER =====

const orderBtn = document.getElementById('orderBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const repairFormSection = document.getElementById('repair-form-section');
const repairForm = document.getElementById('repairRequestForm');
const heroSection = document.getElementById('hero');
const descriptionInput = document.getElementById('description');
const charCountSpan = document.getElementById('charCount');
const prioritySelect = document.getElementById('priority');
const priorityWarning = document.getElementById('priorityWarning');

// Открытие формы
if (orderBtn) {
    orderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        repairFormSection.style.display = 'block';

        setTimeout(() => {
            repairFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
}

// Закрытие формы
if (closeFormBtn) {
    closeFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        repairFormSection.style.animation = 'sectionSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';

        setTimeout(() => {
            repairFormSection.style.display = 'none';
            repairFormSection.style.animation = 'sectionSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

            heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
    });
}

// Счётчик символов в описании
if (descriptionInput && charCountSpan) {
    descriptionInput.addEventListener('input', (e) => {
        charCountSpan.textContent = e.target.value.length;
    });
}

// Предупреждение о срочности
if (prioritySelect && priorityWarning) {
    prioritySelect.addEventListener('change', (e) => {
        if (e.target.value === 'HIGH') {
            priorityWarning.style.display = 'flex';
        } else {
            priorityWarning.style.display = 'none';
        }
    });
}

// Отправка формы
if (repairForm) {
    repairForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Проверка согласия
        const agreeCheckbox = repairForm.querySelector('input[name="agree"]');
        if (!agreeCheckbox.checked) {
            showFormError('Пожалуйста, согласитесь с условиями');
            return;
        }

        const submitBtn = repairForm.querySelector('.btn-submit');
        submitBtn.disabled = true;

        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span>';

        setTimeout(() => {
            repairForm.submit();
        }, 300);
    });
}

// Функция для показа ошибки
function showFormError(message) {
    const errorDiv = document.getElementById('formError');
    const errorText = document.getElementById('errorText');

    errorText.textContent = message;
    errorDiv.style.display = 'flex';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes sectionSlideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(30px);
        }
    }

    .btn-submit.loading {
        pointer-events: none;
    }

    .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Обработка мобильного меню
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link, .menu-service');
const menuClose = document.querySelector('.menu-close');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        hamburger.classList.add('active');
        navMenu.classList.add('hidden');
        document.body.style.overflow = 'hidden';
    });
}

function closeMenu() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    navMenu.classList.remove('hidden');
    document.body.style.overflow = 'auto';
}

if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
}

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(closeMenu, 300);
    });
});

// Прозрачность навбара при скролле
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});