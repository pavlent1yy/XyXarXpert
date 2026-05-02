// ===== CHANGE PASSWORD PAGE HANDLER =====

const changePasswordForm = document.getElementById('changePasswordForm');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');

// ===== ПРОВЕРКА ТРЕБОВАНИЙ ПАРОЛЯ =====
function checkPasswordRequirements() {
    const password = newPassword.value;
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqNumber = document.getElementById('req-number');

    // Проверка длины
    if (password.length >= 8) {
        reqLength.classList.add('met');
    } else {
        reqLength.classList.remove('met');
    }

    // Проверка заглавной буквы
    if (/[A-Z]/.test(password)) {
        reqUppercase.classList.add('met');
    } else {
        reqUppercase.classList.remove('met');
    }

    // Проверка цифры
    if (/[0-9]/.test(password)) {
        reqNumber.classList.add('met');
    } else {
        reqNumber.classList.remove('met');
    }
}

if (newPassword) {
    newPassword.addEventListener('input', checkPasswordRequirements);
}

// ===== ПЕРЕКЛЮЧЕНИЕ ВИДИМОСТИ ПАРОЛЯ =====
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);

        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '👁️‍🗨️';
        } else {
            input.type = 'password';
            btn.textContent = '👁️';
        }
    });
});

// ===== ОБРАБОТКА ФОРМЫ =====
if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const current = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;

        // Валидация
        if (newPass !== confirm) {
            showErrorMessage('Пароли не совпадают');
            return;
        }

        if (newPass.length < 8) {
            showErrorMessage('Пароль должен содержать минимум 8 символов');
            return;
        }

        if (!/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass)) {
            showErrorMessage('Пароль должен содержать заглавную букву и цифру');
            return;
        }

        const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span>';

        setTimeout(() => {
            changePasswordForm.submit();
        }, 300);
    });
}

// ===== СООБЩЕНИЯ ОБ ОШИБКАХ =====
function showErrorMessage(message) {
    const container = document.querySelector('.change-container');
    const existingMessage = container.querySelector('.form-message');

    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message error-message';
    messageDiv.textContent = message;

    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
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