// ===== ALL REQUESTS PAGE HANDLER =====

let currentRequestId = null;
let currentRequestData = null;
const requests = [];

// Получаем данные заявок из HTML
document.querySelectorAll('.request-card').forEach(card => {
    const requestId = card.dataset.id;
    requests.push({
        id: requestId,
        title: card.querySelector('.card-title-block h3').textContent,
        description: card.querySelector('.description-text').textContent,
        phoneModel: card.querySelector('.card-phone').textContent,
        issueType: card.querySelectorAll('.meta-value')[0]?.textContent,
        priority: card.dataset.priority,
        client: card.querySelectorAll('.meta-value')[1]?.textContent,
        contact: card.querySelectorAll('.meta-value')[3]?.textContent,
    });
});

// ===== ПОИСК И СОРТИРОВКА =====
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const requestCards = document.querySelectorAll('.request-card');

function filterAndSort() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortType = sortSelect.value;
    const cards = Array.from(requestCards);

    // Фильтрация
    cards.forEach(card => {
        const title = card.querySelector('.card-title-block h3').textContent.toLowerCase();
        const phone = card.querySelector('.card-phone').textContent.toLowerCase();
        const contact = card.querySelectorAll('.meta-value')[3]?.textContent.toLowerCase() || '';

        const matches = title.includes(searchTerm) || phone.includes(searchTerm) || contact.includes(searchTerm);
        card.style.display = matches ? 'flex' : 'none';
    });

    // Сортировка
    const visibleCards = cards.filter(card => card.style.display === 'flex');
    const container = document.querySelector('.requests-grid');

    visibleCards.sort((a, b) => {
        switch (sortType) {
            case 'oldest':
                return 1; // Обратный порядок
            case 'priority':
                const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };
                return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
            case 'title':
                const titleA = a.querySelector('.card-title-block h3').textContent;
                const titleB = b.querySelector('.card-title-block h3').textContent;
                return titleA.localeCompare(titleB, 'ru');
            case 'newest':
            default:
                return -1;
        }
    });

    // Переставляем карточки
    visibleCards.forEach(card => {
        container.appendChild(card);
    });

    // Анимация
    visibleCards.forEach(card => {
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'slideInUp 0.4s ease';
        }, 10);
    });
}

searchInput.addEventListener('input', filterAndSort);
sortSelect.addEventListener('change', filterAndSort);

// ===== ПРИНЯТЬ ЗАЯВКУ =====
document.querySelectorAll('.btn-accept').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const requestId = e.currentTarget.dataset.id;

        // Отправляем запрос на сервер
        fetch(`/api/repair-request/${requestId}/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || ''
            }
        })
            .then(response => {
                if (response.ok) {
                    // Удаляем карточку
                    document.querySelector(`[data-id="${requestId}"]`).style.animation = 'slideOutUp 0.3s ease forwards';
                    setTimeout(() => {
                        document.querySelector(`[data-id="${requestId}"]`).remove();
                    }, 300);

                    // Пока��ываем уведомление
                    showToast('Заявка принята! Клиент получит уведомление.');

                    // Обновляем счетчик
                    updateCounts();
                }
            })
            .catch(err => console.error('Ошибка:', err));
    });
});

// ===== МОДАЛ ОТКЛОНЕНИЯ =====
const rejectModal = document.getElementById('rejectModal');
const closeRejectModal = document.getElementById('closeRejectModal');
const cancelRejectBtn = document.getElementById('cancelRejectBtn');
const confirmRejectBtn = document.getElementById('confirmRejectBtn');
const rejectReason = document.getElementById('rejectReason');
const charCount = document.getElementById('charCount');

document.querySelectorAll('.btn-reject').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentRequestId = e.currentTarget.dataset.id;
        rejectReason.value = '';
        charCount.textContent = '0';
        rejectModal.style.display = 'flex';
    });
});

closeRejectModal.addEventListener('click', () => {
    rejectModal.style.display = 'none';
    currentRequestId = null;
});

document.querySelector('.modal-overlay', rejectModal).addEventListener('click', () => {
    rejectModal.style.display = 'none';
});

cancelRejectBtn.addEventListener('click', () => {
    rejectModal.style.display = 'none';
    currentRequestId = null;
});

rejectReason.addEventListener('input', (e) => {
    charCount.textContent = e.target.value.length;
});

confirmRejectBtn.addEventListener('click', () => {
    if (rejectReason.value.trim() === '') {
        alert('Пожалуйста, укажите причину отклонения');
        return;
    }

    // Отправляем запрос на сервер
    fetch(`/api/repair-request/${currentRequestId}/reject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || ''
        },
        body: JSON.stringify({
            reason: rejectReason.value
        })
    })
        .then(response => {
            if (response.ok) {
                // Удаляем карточку
                document.querySelector(`[data-id="${currentRequestId}"]`).style.animation = 'slideOutUp 0.3s ease forwards';
                setTimeout(() => {
                    document.querySelector(`[data-id="${currentRequestId}"]`).remove();
                }, 300);

                // Закрываем модал
                rejectModal.style.display = 'none';

                // Показываем уведомление
                showToast('Заявка отклонена. Клиент получит ваше сообщение.');

                // Обновляем счетчик
                updateCounts();
            }
        })
        .catch(err => console.error('Ошибка:', err));
});

// ===== МОДАЛ ДЕТАЛЕЙ =====
const detailsModal = document.getElementById('detailsModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');

document.querySelectorAll('.btn-expand').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const requestId = e.currentTarget.dataset.id;
        const requestData = requests.find(r => r.id === requestId);

        if (requestData) {
            document.getElementById('modalTitle').textContent = requestData.title;
            document.getElementById('modalDescription').textContent = requestData.description;
            document.getElementById('modalPhone').textContent = requestData.phoneModel;
            document.getElementById('modalIssue').textContent = requestData.issueType;
            document.getElementById('modalPriority').textContent = requestData.priority;
            document.getElementById('modalClient').textContent = requestData.client;
            document.getElementById('modalContact').textContent = requestData.contact;

            detailsModal.style.display = 'flex';
        }
    });
});

closeDetailsModal.addEventListener('click', () => {
    detailsModal.style.display = 'none';
});

// Закрытие модалов по клику на overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.closest('.modal').style.display = 'none';
        }
    });
});

// ===== TOAST УВЕДОМЛЕНИЕ =====
function showToast(message) {
    const toast = document.getElementById('successToast');
    document.getElementById('toastText').textContent = message;
    toast.style.display = 'flex';

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.animation = '';
        }, 300);
    }, 3000);
}

// ===== ОБНОВЛЕНИЕ СЧЕТЧИКОВ =====
function updateCounts() {
    const totalCount = document.querySelectorAll('.request-card').length;
    const urgentCount = document.querySelectorAll('.request-card[data-priority="HIGH"]').length;

    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('urgentCount').textContent = urgentCount;

    // Если нет заявок, показываем пустое состояние
    if (totalCount === 0) {
        document.querySelector('.requests-grid').style.display = 'none';
        let emptyState = document.querySelector('.empty-state');
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon">📭</div>
                <h3>Нет новых заявок</h3>
                <p>Все заявки уже распределены между мастерами</p>
            `;
            document.querySelector('.container').appendChild(emptyState);
        }
    }
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
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