// ===== LOGIN FORM HANDLER =====

const form = document.querySelector('.login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.querySelector('.toggle-password');

// Автоскрытие сообщений об ошибках через 5 сек
window.addEventListener('load', () => {
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');

    if (successMessage) {
        setTimeout(() => {
            successMessage.style.animation = 'slideUp 0.4s ease forwards';
            setTimeout(() => successMessage.remove(), 400);
        }, 5000);
    }

    if (errorMessage) {
        setTimeout(() => {
            errorMessage.style.animation = 'slideUp 0.4s ease forwards';
            setTimeout(() => errorMessage.remove(), 400);
        }, 5000);
    }

    // Анимация появления элементов
    const formContainer = document.querySelector('.form-container');
    const brandingContent = document.querySelector('.branding-content');

    if (brandingContent) {
        brandingContent.style.animation = 'slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    if (formContainer) {
        formContainer.style.animation = 'slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
});

// Toggle пароля
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.getElementById(e.currentTarget.dataset.target);
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        e.currentTarget.textContent = isPassword ? '🙈' : '👁️';
    });
}

// Отправка формы
if (form) {
    form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('.btn-login');
        submitBtn.style.position = 'relative';
        submitBtn.classList.add('loading');

        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span>';

        setTimeout(() => {
            // Форма отправится через стандартный POST запрос
        }, 300);
    });
}

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

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }

    .btn-login.loading {
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
if (emailInput) {
    emailInput.addEventListener('focus', () => {
        emailInput.closest('.form-group').style.transform = 'scale(1.02)';
    });

    emailInput.addEventListener('blur', () => {
        emailInput.closest('.form-group').style.transform = 'scale(1)';
    });
}

if (passwordInput) {
    passwordInput.addEventListener('focus', () => {
        passwordInput.closest('.form-group').style.transform = 'scale(1.02)';
    });

    passwordInput.addEventListener('blur', () => {
        passwordInput.closest('.form-group').style.transform = 'scale(1)';
    });
}