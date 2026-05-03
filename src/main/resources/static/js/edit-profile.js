// ===== EDIT PROFILE PAGE HANDLER =====

const profileForm = document.getElementById('profileForm');
const logoutBtn = document.querySelector('.btn-logout');
const logoutModal = document.getElementById('logoutModal');
const closeLogoutModal = document.getElementById('closeLogoutModal');
const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

// ===== ОБРАБОТКА ФОРМЫ =====
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();

        if (!firstName || !lastName) {
            e.preventDefault();
            showErrorMessage('Имя и фамилия обязательны');
            return;
        }

        const submitBtn = profileForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
    });
}

// ===== МОДАЛ ВЫХОДА =====
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutModal.style.display = 'flex';
    });
}

if (closeLogoutModal) {
    closeLogoutModal.addEventListener('click', () => {
        logoutModal.style.display = 'none';
    });
}

if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener('click', () => {
        logoutModal.style.display = 'none';
    });
}

const logoutOverlay = logoutModal?.querySelector('.modal-overlay');
if (logoutOverlay) {
    logoutOverlay.addEventListener('click', (e) => {
        if (e.target === logoutOverlay) {
            logoutModal.style.display = 'none';
        }
    });
}

// ===== СООБЩЕНИЯ ОБ ОШИБКАХ =====
function showErrorMessage(message) {
    const section = document.querySelector('.edit-profile-section .container');
    const existingMessage = section.querySelector('.form-message');

    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message error-message';
    messageDiv.textContent = message;

    const header = section.querySelector('.edit-header');
    section.insertBefore(messageDiv, header.nextElementSibling);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}