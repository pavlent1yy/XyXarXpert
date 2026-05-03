// ===== PROFILE PAGE HANDLER =====

// Фильтрация заявок
const filterBtns = document.querySelectorAll('.filter-btn');
const repairItems = document.querySelectorAll('.repair-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем активный класс со всех кнопок
        filterBtns.forEach(b => b.classList.remove('active'));
        // Добавляем активный класс текущей кнопке
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Фильтруем заявки
        repairItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
                item.style.animation = 'slideInUp 0.3s ease';
            } else {
                const status = item.className.match(/status-(\w+)/)?.[1]?.toUpperCase() || '';
                if (status === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'slideInUp 0.3s ease';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
});

// Добавляем анимацию
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Обработка кнопок действий
document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const requestId = e.currentTarget.dataset.id;
        window.location.href = `/repair-request/${requestId}`;
    });
});


document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const requestId = e.currentTarget.dataset.id;
        if (confirm('Вы уверены, что хотите отменить эту заявку?')) {
            // Отмена заявки
            alert(`Заявка #${requestId} отменена`);
        }
    });
});

// Avatar upload
const avatarUpload = document.querySelector('.avatar-upload');
if (avatarUpload) {
    avatarUpload.addEventListener('click', () => {
        alert('Загрузка аватара (скоро будет реализовано)');
    });
}