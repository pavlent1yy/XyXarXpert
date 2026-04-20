// ===== MY REQUESTS PAGE HANDLER =====

let currentRequestId = null;
let currentRequestData = null;
const requests = [];

// Получаем данные заявок из HTML
document.querySelectorAll('.request-item').forEach(card => {
    const requestId = card.dataset.id;
    const infoItems = card.querySelectorAll('.info-value');

    requests.push({
        id: requestId,
        title: card.querySelector('.item-title-block h3').textContent,
        description: card.querySelector('.item-description p').textContent,
        phoneModel: card.querySelector('.item-phone').textContent,
        issueType: infoItems[0]?.textContent,
        priority: card.querySelector('.priority-badge').dataset.priority || 'MEDIUM',
        client: infoItems[1]?.textContent,
        contact: infoItems[2]?.textContent,
    });
});

// ===== ФИЛЬТРАЦИЯ ПО СТАТУСУ =====
const filterBtns = document.querySelectorAll('.filter-btn');
const requestItems = document.querySelectorAll('.request-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        requestItems.forEach(item => {
            if (filter === 'all') {
                item.style.display = 'grid';
                item.style.animation = 'slideInUp 0.4s ease';
            } else {
                const status = item.dataset.status;
                if (status === filter) {
                    item.style.display = 'grid';
                    item.style.animation = 'slideInUp 0.4s ease';
                } else {
                    item.style.display = 'none';
                }
            }
        });

        updateStats();
    });
});

// ===== МОДАЛ НАЧАЛА РЕМОНТА =====
const startRepairModal = document.getElementById('startRepairModal');
const closeStartRepairModal = document.getElementById('closeStartRepairModal');
const cancelStartRepairBtn = document.getElementById('cancelStartRepairBtn');
const confirmStartRepairBtn = document.getElementById('confirmStartRepairBtn');
const youtubeLink = document.getElementById('youtubeLink');
const linkPreview = document.getElementById('linkPreview');
const linkError = document.getElementById('linkError');

document.querySelectorAll('.btn-start-repair').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentRequestId = e.currentTarget.dataset.id;
        youtubeLink.value = '';
        linkPreview.style.display = 'none';
        linkError.style.display = 'none';
        confirmStartRepairBtn.disabled = true;
        startRepairModal.style.display = 'flex';
    });
});

// Валидация YouTube ссылки
function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
    return youtubeRegex.test(url);
}

youtubeLink.addEventListener('input', (e) => {
    const url = e.target.value.trim();

    if (url === '') {
        linkPreview.style.display = 'none';
        linkError.style.display = 'none';
        confirmStartRepairBtn.disabled = true;
        return;
    }

    if (isValidYouTubeUrl(url)) {
        linkPreview.style.display = 'flex';
        linkError.style.display = 'none';
        confirmStartRepairBtn.disabled = false;
    } else {
        linkPreview.style.display = 'none';
        linkError.style.display = 'flex';
        confirmStartRepairBtn.disabled = true;
    }
});

if (closeStartRepairModal) {
    closeStartRepairModal.addEventListener('click', () => {
        startRepairModal.style.display = 'none';
        currentRequestId = null;
    });
}

if (cancelStartRepairBtn) {
    cancelStartRepairBtn.addEventListener('click', () => {
        startRepairModal.style.display = 'none';
        currentRequestId = null;
    });
}

const startRepairOverlay = startRepairModal.querySelector('.modal-overlay');
if (startRepairOverlay) {
    startRepairOverlay.addEventListener('click', (e) => {
        if (e.target === startRepairOverlay) {
            startRepairModal.style.display = 'none';
            currentRequestId = null;
        }
    });
}

if (confirmStartRepairBtn) {
    confirmStartRepairBtn.addEventListener('click', () => {
        if (!currentRequestId || !youtubeLink.value.trim()) return;

        fetch(`/api/repair-request/${currentRequestId}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || ''
            },
            body: JSON.stringify({
                liveStreamUrl: youtubeLink.value.trim()
            })
        })
            .then(response => {
                if (response.ok) {
                    startRepairModal.style.display = 'none';

                    const item = document.querySelector(`[data-id="${currentRequestId}"]`);
                    if (item) {
                        item.dataset.status = 'IN_PROGRESS';
                        item.classList.remove('status-taken');
                        item.classList.add('status-in_progress');

                        const statusBadge = item.querySelector('.status-badge');
                        if (statusBadge) {
                            statusBadge.classList.remove('status-taken');
                            statusBadge.classList.add('status-in_progress');
                            statusBadge.textContent = 'В работе';
                        }

                        const startBtn = item.querySelector('.btn-start-repair');
                        const completeBtn = item.querySelector('.btn-complete');
                        if (startBtn) startBtn.remove();
                        if (!completeBtn) {
                            const completeNewBtn = document.createElement('button');
                            completeNewBtn.className = 'btn-action btn-complete';
                            completeNewBtn.dataset.id = currentRequestId;
                            completeNewBtn.innerHTML = '<span>✓</span>Завершить';
                            completeNewBtn.addEventListener('click', handleCompleteClick);
                            item.querySelector('.item-actions').appendChild(completeNewBtn);
                        }
                    }

                    showToast('✓ Ремонт начат! Трансляция активна.');
                    updateStats();
                    currentRequestId = null;
                } else {
                    showToast('✗ Ошибка при начале ремонта');
                }
            })
            .catch(err => {
                console.error('Ошибка:', err);
                showToast('✗ Ошибка при начале ремонта');
            });
    });
}

// ===== МОДАЛ ЗАВЕРШЕНИЯ РЕМОНТА =====
const completeModal = document.getElementById('completeModal');
const closeCompleteModal = document.getElementById('closeCompleteModal');
const cancelCompleteBtn = document.getElementById('cancelCompleteBtn');
const confirmCompleteBtn = document.getElementById('confirmCompleteBtn');

function handleCompleteClick(e) {
    currentRequestId = e.currentTarget.dataset.id;
    const requestData = requests.find(r => r.id === currentRequestId);

    if (requestData) {
        const preview = document.getElementById('completeRequestPreview');
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
        `;
        completeModal.style.display = 'flex';
    }
}

document.querySelectorAll('.btn-complete').forEach(btn => {
    btn.addEventListener('click', handleCompleteClick);
});

if (closeCompleteModal) {
    closeCompleteModal.addEventListener('click', () => {
        completeModal.style.display = 'none';
        currentRequestId = null;
    });
}

if (cancelCompleteBtn) {
    cancelCompleteBtn.addEventListener('click', () => {
        completeModal.style.display = 'none';
        currentRequestId = null;
    });
}

const completeOverlay = completeModal.querySelector('.modal-overlay');
if (completeOverlay) {
    completeOverlay.addEventListener('click', (e) => {
        if (e.target === completeOverlay) {
            completeModal.style.display = 'none';
            currentRequestId = null;
        }
    });
}

if (confirmCompleteBtn) {
    confirmCompleteBtn.addEventListener('click', () => {
        if (!currentRequestId) return;

        fetch(`/api/repair-request/${currentRequestId}/complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || ''
            }
        })
            .then(response => {
                if (response.ok) {
                    completeModal.style.display = 'none';

                    const item = document.querySelector(`[data-id="${currentRequestId}"]`);
                    if (item) {
                        item.dataset.status = 'COMPLETED';
                        item.classList.remove('status-in_progress');
                        item.classList.add('status-completed');

                        const statusBadge = item.querySelector('.status-badge');
                        if (statusBadge) {
                            statusBadge.classList.remove('status-in_progress');
                            statusBadge.classList.add('status-completed');
                            statusBadge.textContent = 'Завершено';
                        }

                        const completeBtn = item.querySelector('.btn-complete');
                        if (completeBtn) completeBtn.remove();
                    }

                    showToast('✓ Ремонт завершен! Клиент получит уведомление.');
                    updateStats();
                    currentRequestId = null;
                } else {
                    showToast('✗ Ошибка при завершении ремонта');
                }
            })
            .catch(err => {
                console.error('Ошибка:', err);
                showToast('✗ Ошибка при завершении ремонта');
            });
    });
}

// ===== МОДАЛ ДЕТАЛЕЙ =====
const detailsModal = document.getElementById('detailsModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');

document.querySelectorAll('.btn-details').forEach(btn => {
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

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            const modal = overlay.closest('.modal');
            if (modal) {
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

// ===== ОБНОВЛЕНИЕ СТАТИСТИКИ =====
function updateStats() {
    const totalCount = document.querySelectorAll('.request-item').length;
    const takenCount = document.querySelectorAll('.request-item[data-status="TAKEN"]').length;
    const inProgressCount = document.querySelectorAll('.request-item[data-status="IN_PROGRESS"]').length;
    const completedCount = document.querySelectorAll('.request-item[data-status="COMPLETED"]').length;

    const totalEl = document.getElementById('totalCount');
    const takenEl = document.getElementById('takenCount');
    const inProgressEl = document.getElementById('inProgressCount');
    const completedEl = document.getElementById('completedCount');

    if (totalEl) totalEl.textContent = totalCount;
    if (takenEl) takenEl.textContent = takenCount;
    if (inProgressEl) inProgressEl.textContent = inProgressCount;
    if (completedEl) completedEl.textContent = completedCount;
}

// Инициализация
updateStats();

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
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