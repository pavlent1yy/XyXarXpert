// ===== REGISTER FORM HANDLER =====

const form = document.querySelector('.register-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const termsCheckbox = document.querySelector('input[name="terms"]');
const submitBtn = document.querySelector('.btn-register');

// Toggle пароля
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.getElementById(e.currentTarget.dataset.target);
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        e.currentTarget.textContent = isPassword ? '🙈' : '👁️';
    });
});

// Проверка совпадения паролей в реальном времени
if (passwordInput && confirmPasswordInput) {
    const checkPasswordsMatch = () => {
        if (confirmPasswordInput.value === '') return;

        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.style.borderColor = '#ff6b6b';
            confirmPasswordInput.style.background = 'rgba(255, 107, 107, 0.05)';
        } else {
            confirmPasswordInput.style.borderColor = 'var(--color-orange)';
            confirmPasswordInput.style.background = 'rgba(247, 154, 36, 0.05)';
        }
    };

    passwordInput.addEventListener('change', checkPasswordsMatch);
    confirmPasswordInput.addEventListener('change', checkPasswordsMatch);
    confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
}

// Отправка формы
if (form) {
    form.addEventListener('submit', (e) => {
        // Проверка совпадения паролей перед отправкой
        if (passwordInput.value !== confirmPasswordInput.value) {
            e.preventDefault();
            confirmPasswordInput.style.borderColor = '#ff6b6b';
            confirmPasswordInput.style.background = 'rgba(255, 107, 107, 0.05)';
            return;
        }

        // Проверка согласия с условиями
        if (!termsCheckbox.checked) {
            e.preventDefault();
            termsCheckbox.closest('.form-checkbox').style.borderColor = '#ff6b6b';
            return;
        }

        // Добавляем эффект к кнопке
        submitBtn.style.position = 'relative';
        submitBtn.classList.add('loading');

        // Анимация загрузки
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span>';

        // Имитация задержки перед отправкой
        setTimeout(() => {
            // Форма отправится через стандартный POST запрос
        }, 300);
    });
}

// Анимация появления элементов при загрузке
window.addEventListener('load', () => {
    const formContainer = document.querySelector('.form-container');
    const brandingContent = document.querySelector('.branding-content');

    // Анимация формы слева
    if (formContainer) {
        formContainer.style.animation = 'slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // Анимация текста справа
    if (brandingContent) {
        brandingContent.style.animation = 'slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
});

// Добавляем стили для анимаций в JS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .btn-register.loading {
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

    .form-group {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(style);

// Проверка фокуса на полях ввода
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.closest('.form-group').style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
        input.closest('.form-group').style.transform = 'scale(1)';
    });
});

// Проверка согласия с условиями
if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
        if (termsCheckbox.checked) {
            termsCheckbox.closest('.form-checkbox').style.borderColor = 'var(--border-color)';
        }
    });
}