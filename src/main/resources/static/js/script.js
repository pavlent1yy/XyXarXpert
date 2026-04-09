// Функции для мобильного меню
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link, .menu-service');
const menuClose = document.querySelector('.menu-close');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

// Открытие меню
hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
    hamburger.classList.add('active');
    navMenu.classList.add('hidden');
    
    // Добавляем эффект клика
    hamburger.classList.add('clicked');
    setTimeout(() => hamburger.classList.remove('clicked'), 600);
    
    document.body.style.overflow = 'hidden';
});

// Закрытие меню
function closeMenu() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    navMenu.classList.remove('hidden');
    document.body.style.overflow = 'auto';
}

menuClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// Закрытие при клике на ссылку
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(closeMenu, 300);
    });
});

// Прозрачность навбара при скролле
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Анимация при загрузке элементов
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .contact-item, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Эффект для всех клик-элементов
const clickableElements = document.querySelectorAll('.btn, .service-large, .service-card, .about-card, .feature-item, .step, .contact-item');

clickableElements.forEach(element => {
    element.addEventListener('click', function(e) {
        // Добавляем класс clicked для анимации
        this.classList.add('clicked');
        
        // Создаём ripple эффект
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(247, 154, 36, 0.3)';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        ripple.style.pointerEvents = 'none';
        
        // Проверяем, есть ли уже position: relative у элемента
        if (getComputedStyle(this).position === 'static') {
            this.style.position = 'relative';
        }
        
        this.appendChild(ripple);
        
        ripple.animate([
            { width: '0', height: '0', opacity: 1 },
            { width: '400px', height: '400px', opacity: 0 }
        ], { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
        
        setTimeout(() => {
            ripple.remove();
            this.classList.remove('clicked');
        }, 600);
    });
});

// Предотвращение скролла при открытом меню
menuOverlay.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });