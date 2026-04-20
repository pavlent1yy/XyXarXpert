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

if (searchInput) {
    searchInput.addEventListener('input', filterAndSort);
}

if (sortSelect) {
    sortSelect.addEventListener('change', filterAndSort);
}

// ===== МОДАЛ ПОДТВЕРЖДЕНИЯ ПРИНЯТИЯ =====
const acceptModal = document.getElementById('acceptModal') || createAcceptModal();

function createAcceptModal() {
    const modal = document.createElement('div');
    modal.id = 'acceptModal';
    modal.className = 'modal modal-accept';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content modal-compact">
            <div class="modal-header">
                <h2>Принять заявку?</h2>
                <button class="modal-close" id="closeAcceptModal">✕</button>
            </div>
            <div class="modal-body">
                <p class="modal-text">Вы уверены, что хотите принять эту заявку? После принятия её увидят только вы.</p>
                <div class="request-preview" id="acceptRequestPreview"></div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" id="cancelAcceptBtn">Отмена</button>
                <button class="btn-confirm btn-accept-confirm" id="confirmAcceptBtn">Да, принять</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

const closeAcceptModal = document.getElementById('closeAcceptModal');
const cancelAcceptBtn = document.getElementById('cancelAcceptBtn');
const confirmAcceptBtn = document.getElementById('confirmAcceptBtn');

// ===== ПРИНЯТЬ ЗАЯВКУ =====
document.querySelectorAll('.btn-accept').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const requestId = e.currentTarget.dataset.id;
        const requestData = requests.find(r => r.id === requestId);

        if (requestData) {
            // Заполняем информацию в модал
            const preview = document.getElementById('acceptRequestPreview');
            preview.innerHTML = `
                <div class="preview-item">
                    <span class="preview-label">Заявка:</span>
                    <span class="preview-value">${requestData.title}</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Телефон:</span>
                    <span class="preview-value">${requestData.phoneModel}</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Клиент:</span>
                    <span class="preview-value">${requestData.client}</span>
                </div>
                <div class="preview-item">
                    <span class="preview-label">Контакт:</span>
                    <span class="preview-value">${requestData.contact}</span>
                </div>
            `;

            // Сохраняем ID текущей заявки
            currentRequestId = requestId;

            // Показываем модал
            acceptModal.style.display = 'flex';
        }
    });
});

// Закрытие модала подтверждения
if (closeAcceptModal) {
    closeAcceptModal.addEventListener('click', () => {
        acceptModal.style.display = 'none';
        currentRequestId = null;
    });
}

if (cancelAcceptBtn) {
    cancelAcceptBtn.addEventListener('click', () => {
        acceptModal.style.display = 'none';
        currentRequestId = null;
    });
}

// Подтверждение принятия заявки
if (confirmAcceptBtn) {
    confirmAcceptBtn.addEventListener('click', () => {
        if (!currentRequestId) return;

        // Отправляем запрос на сервер
        fetch(`/api/repair-request/${currentRequestId}/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || ''
            }
        })
            .then(response => {
                if (response.ok) {
                    // Закрываем модал
                    acceptModal.style.display = 'none';

                    // Удаляем карточку
                    const card = document.querySelector(`[data-id="${currentRequestId}"]`);
                    if (card) {
                        card.style.animation = 'slideOutUp 0.3s ease forwards';
                        setTimeout(() => {
                            card.remove();
                            updateCounts();
                        }, 300);
                    }

                    // Показываем уведомление
                    showToast('✓ Заявка принята! Клиент получит уведомление.');

                    currentRequestId = null;
                } else {
                    showToast('✗ Ошибка при принятии заявки');
                }
            })
            .catch(err => {
                console.error('Ошибка:', err);
                showToast('✗ Ошибка при принятии заявки');
            });
    });
}

// Закрытие по клику на overlay
const acceptOverlay = acceptModal.querySelector('.modal-overlay');
if (acceptOverlay) {
    acceptOverlay.addEventListener('click', (e) => {
        if (e.target === acceptOverlay) {
            acceptModal.style.display = 'none';
            currentRequestId = null;
        }
    });
}

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

if (closeRejectModal) {
    closeRejectModal.addEventListener('click', () => {
        rejectModal.style.display = 'none';
        currentRequestId = null;
    });
}

const rejectOverlay = rejectModal?.querySelector('.modal-overlay');
if (rejectOverlay) {
    rejectOverlay.addEventListener('click', (e) => {
        if (e.target === rejectOverlay) {
            rejectModal.style.display = 'none';
            currentRequestId = null;
        }
    });
}

if (cancelRejectBtn) {
    cancelRejectBtn.addEventListener('click', () => {
        rejectModal.style.display = 'none';
        currentRequestId = null;
    });
}

if (rejectReason) {
    rejectReason.addEventListener('input', (e) => {
        charCount.textContent = e.target.value.length;
    });
}

if (confirmRejectBtn) {
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
                    // Закрываем модал
                    rejectModal.style.display = 'none';

                    // Удаляем карточку
                    const card = document.querySelector(`[data-id="${currentRequestId}"]`);
                    if (card) {
                        card.style.animation = 'slideOutUp 0.3s ease forwards';
                        setTimeout(() => {
                            card.remove();
                            updateCounts();
                        }, 300);
                    }

                    // Показываем уведомление
                    showToast('✗ Заявка отклонена. Клиент получит ваше сообщение.');

                    currentRequestId = null;
                } else {
                    showToast('✗ Ошибка при отклонении заявки');
                }
            })
            .catch(err => {
                console.error('Ошибка:', err);
                showToast('✗ Ошибка при отклонении заявки');
            });
    });
}

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

if (closeDetailsModal) {
    closeDetailsModal.addEventListener('click', () => {
        detailsModal.style.display = 'none';
    });
}

// Закрытие модалов по клику на overlay
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            const modal = overlay.closest('.modal');
            if (modal && !modal.id.includes('accept')) {
                modal.style.display = 'none';
            }
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

    const totalEl = document.getElementById('totalCount');
    const urgentEl = document.getElementById('urgentCount');

    if (totalEl) totalEl.textContent = totalCount;
    if (urgentEl) urgentEl.textContent = urgentCount;

    // Если нет заявок, показываем пустое состояние
    if (totalCount === 0) {
        const grid = document.querySelector('.requests-grid');
        if (grid) {
            grid.style.display = 'none';
        }

        let emptyState = document.querySelector('.empty-state');
        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon">📭</div>
                <h3>Нет новых заявок</h3>
                <p>Все заявки уже распределены между мастерами</p>
            `;
            const container = document.querySelector('.requests-section .container');
            if (container) {
                container.appendChild(emptyState);
            }
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

    .preview-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: var(--border-width) solid var(--border-color);
    }

    .preview-item:last-child {
        border-bottom: none;
    }

    .preview-label {
        font-weight: var(--font-weight-bold);
        color: var(--text-secondary);
        font-size: var(--font-sm);
    }

    .preview-value {
        color: var(--text-primary);
        text-align: right;
    }

    .btn-accept-confirm {
        background: var(--color-blue) !important;
    }

    .btn-accept-confirm:hover {
        box-shadow: 0 6px 15px rgba(13, 39, 196, 0.3) !important;
    }
`;
document.head.appendChild(style);