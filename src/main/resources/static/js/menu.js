// ===== BURGER MENU HANDLER =====

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link, .menu-service');
const menuClose = document.querySelector('.menu-close');
const navMenu = document.querySelector('.nav-menu');

// Открытие меню
if (hamburger) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        hamburger.classList.add('active');
        if (navMenu) {
            navMenu.classList.add('hidden');
        }
        document.body.style.overflow = 'hidden';
    });
}

// Закрытие меню
function closeMenu() {
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
    if (menuOverlay) {
        menuOverlay.classList.remove('active');
    }
    if (hamburger) {
        hamburger.classList.remove('active');
    }
    if (navMenu) {
        navMenu.classList.remove('hidden');
    }
    document.body.style.overflow = 'auto';
}

// Кнопка закрытия меню
if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
}

// Клик на overlay
if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
}

// Клик на ссылки в меню
if (menuLinks) {
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeMenu, 300);
        });
    });
}

// Прозрачность навбара при скролле
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}