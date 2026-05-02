// ===== FORGOT PASSWORD PAGE HANDLER =====

const forgotForm = document.getElementById('forgotForm');

if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
        const submitBtn = forgotForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span>';
    });
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