// ===== VERIFY FORM HANDLER =====

const form = document.querySelector('.verify-form');
const emailInput = document.getElementById('email');
const codeInput = document.getElementById('code');
const submitBtn = document.querySelector('.btn-verify');
const resendBtn = document.querySelector('.resend-link');

// Форма��ирование кода верификации
if (codeInput) {
    codeInput.addEventListener('input', (e) => {
        // Оставляем только цифры
        e.target.value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);

        // Визуальная проверка при заполнении
        if (e.target.value.length === 6) {
            e.target.style.borderColor = 'var(--color-orange)';
            e.target.style.background = 'rgba(247, 154, 36, 0.05)';
        } else if (e.target.value.length > 0) {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.background = 'var(--bg-secondary)';
        }
    });
}

// Отправка формы
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Проверка длины кода
        if (codeInput.value.length !== 6) {
            codeInput.style.borderColor = '#ff6b6b';
            codeInput.style.background = 'rgba(255, 107, 107, 0.05)';
            return;
        }

        // Отключаем кнопку
        submitBtn.disabled = true;
        submitBtn.style.position = 'relative';

        // Анимация загрузки
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span>';

        // Имитация задержки перед отправко��
        setTimeout(() => {
            form.submit();
        }, 300);
    });
}

// Повторная отправка кода
if (resendBtn) {
    let resendTimeout = 0;

    resendBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (resendTimeout > 0) return;

        // Отключаем кнопку на 60 секунд
        resendBtn.disabled = true;
        let timeLeft = 60;

        const interval = setInterval(() => {
            resendBtn.textContent = `Отправить повторно (${timeLeft}с)`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(interval);
                resendBtn.disabled = false;
                resendBtn.textContent = 'Отправить код повторно';
                resendTimeout = 0;
            }
        }, 1000);

        resendTimeout = 60;

        // Здесь можно добавить реальный запрос на отправку кода
        console.log('Код повторно отправлен на:', emailInput.value);
    });
}

// Анимация появления при загрузке
window.addEventListener('load', () => {
    const formContainer = document.querySelector('.form-container');
    const infoContent = document.querySelector('.info-content');

    if (formContainer) {
        formContainer.style.animation = 'slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    if (infoContent) {
        infoContent.style.animation = 'slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
});

// Добавляем стили для анимаций
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

// Проверка фокуса на полях
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.closest('.form-group').style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
        input.closest('.form-group').style.transform = 'scale(1)';
    });
});

// Очистка ошибки при вводе
if (codeInput) {
    codeInput.addEventListener('input', () => {
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.animation = 'slideUp 0.4s ease forwards';
        }
    });
}

// Стиль для удаления ошибки
const style2 = document.createElement('style');
style2.textContent = `
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
`;
document.head.appendChild(style2);