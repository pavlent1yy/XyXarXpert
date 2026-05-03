// ===== PROFILE USER PAGE HANDLER =====

const csrfToken = document.querySelector('meta[name="_csrf"]').content;
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

let currentRequestId = null;
const requests = [];

// Получаем данные заявок из HTML
document.querySelectorAll('.repair-item').forEach(card => {
    const requestId = card.dataset.id;
    const metaItems = card.querySelectorAll('.meta-value');

    requests.push({
        id: requestId,
        title: card.querySelector('.repair-title-block h3').textContent,
        description: card.querySelector('.repair-description p').textContent,
        phoneModel: card.querySelector('.repair-model').textContent,
        issueType: metaItems[0]?.textContent,
        priority: card.querySelector('.meta-item:nth-child(2) .meta-value').textContent,
        contact: metaItems[3]?.textContent,
        createdAt: metaItems[2]?.textContent,
        status: card.dataset.status,
    });
});

// ===== ФИЛЬТРАЦИЯ ПО СТАТУСУ =====
const filterBtns = document.querySelectorAll('.filter-btn');
const repairItems = document.querySelectorAll('.repair-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        repairItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'block';
                item.style.animation = 'slideInUp 0.3s ease';
            } else {
                const status = item.dataset.status;
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

// ===== МОДАЛ ДЕТАЛЕЙ =====
const repairDetailsModal = document.getElementById('repairDetailsModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');

document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const requestId = e.currentTarget.dataset.id;
        const requestData = requests.find(r => r.id === requestId);

        if (requestData) {
            document.getElementById('modalTitle').textContent = requestData.title;
            document.getElementById('modalDescription').textContent = requestData.description;
            document.getElementById('modalPhone').textContent = requestData.phoneModel;
            document.getElementById('modalIssue').textContent = requestData.issueType;
            document.getElementById('modalPriority').textContent = requestData.priority;
            document.getElementById('modalStatus').textContent = getStatusText(requestData.status);
            document.getElementById('modalContact').textContent = requestData.contact;
            document.getElementById('modalCreatedAt').textContent = requestData.createdAt;

            repairDetailsModal.style.display = 'flex';
        }
    });
});

if (closeDetailsModal) {
    closeDetailsModal.addEventListener('click', () => {
        repairDetailsModal.style.display = 'none';
    });
}

const detailsOverlay = repairDetailsModal?.querySelector('.modal-overlay');
if (detailsOverlay) {
    detailsOverlay.addEventListener('click', (e) => {
        if (e.target === detailsOverlay) {
            repairDetailsModal.style.display = 'none';
        }
    });
}

// ===== МОДАЛ ОТМЕНЫ =====
const cancelRequestModal = document.getElementById('cancelRequestModal');
const closeCancelModal = document.getElementById('closeCancelModal');
const cancelCancelBtn = document.getElementById('cancelCancelBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');

document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentRequestId = e.currentTarget.dataset.id;
        const requestData = requests.find(r => r.id === currentRequestId);

        if (requestData) {
            const preview = document.getElementById('cancelRequestPreview');
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
                    <span class="preview-label">Статус:</span>
                    <span class="preview-value">${getStatusText(requestData.status)}</span>
                </div>
            `;
            cancelRequestModal.style.display = 'flex';
        }
    });
});

if (closeCancelModal) {
    closeCancelModal.addEventListener('click', () => {
        cancelRequestModal.style.display = 'none';
        currentRequestId = null;
    });
}

if (cancelCancelBtn) {
    cancelCancelBtn.addEventListener('click', () => {
        cancelRequestModal.style.display = 'none';
        currentRequestId = null;
    });
}

const cancelOverlay = cancelRequestModal?.querySelector('.modal-overlay');
if (cancelOverlay) {
    cancelOverlay.addEventListener('click', (e) => {
        if (e.target === cancelOverlay) {
            cancelRequestModal.style.display = 'none';
            currentRequestId = null;
        }
    });
}

if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', () => {
        if (!currentRequestId) return;
        console.log(document.querySelector('meta[name="_csrf"]'));
        fetch(`/api/repair-request/${currentRequestId}/cancel`, {
            method: "POST",
            headers: {
                [csrfHeader]: csrfToken
            }
        })
            .then(async response => {
                console.log('status:', response.status);

                if (!response.ok) {
                    const text = await response.text();
                    console.error('Server error:', text);

                    showToast('✗ Ошибка при отмене заявки');
                    return;
                }

                cancelRequestModal.style.display = 'none';

                const item = document.querySelector(`[data-id="${currentRequestId}"]`);

                if (item) {
                    item.style.animation = 'slideOutUp 0.3s ease forwards';

                    setTimeout(() => {
                        item.remove();
                    }, 300);
                }

                showToast('✓ Заявка отменена');
                currentRequestId = null;
            })
            .catch(err => {
                console.error('FETCH ERROR:', err);
                showToast('✗ Ошибка при отмене заявки');
            });
    });
}

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

// ===== ПРЕОБРАЗОВАНИЕ СТАТУСА =====
function getStatusText(status) {
    const statusMap = {
        'CREATED': 'Новая',
        'IN_PROGRESS': 'В работе',
        'TAKEN': 'Взято',
        'REJECTED': 'Отклонено',
        'DONE': 'Готова',
        'CANCELLED': 'Отменена'
    };
    return statusMap[status] || status;
}

// Добавляем стили для анимаций
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

    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
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
`;
document.head.appendChild(style);