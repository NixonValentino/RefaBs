/**
 * MnR Main JavaScript
 * ─────────────────────────────────────────────────────────────────────────────
 * Navigasi responsif, slider koleksi editorial, animasi scroll,
 * dan animasi angka dampak lingkungan (impact counters).
 * ─────────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initEditorialSlider();
    initImpactCounter();
});

/* ══════════════════════════════════════════════════════════
   NAVBAR & MOBILE MENU
   ══════════════════════════════════════════════════════════ */
function initNavbar() {
    const navbar     = document.querySelector('.navbar');
    const hamburger  = document.querySelector('.navbar__hamburger');
    const mobileMenu = document.querySelector('.navbar__mobile');

    if (!navbar) return;

    // Scroll effect
    const onScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Toggle menu mobile
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open', isOpen);
            document.body.classList.toggle('modal-open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('modal-open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.classList.remove('modal-open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    highlightActiveNavLink();
}

function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ══════════════════════════════════════════════════════════
   SMOOTH SCROLL FOR IN-PAGE ANCHORS
   ══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;

            const target = document.getElementById(href.slice(1));
            if (!target) return;

            e.preventDefault();
            const navbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - navbarH - 16;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

/* ══════════════════════════════════════════════════════════
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ══════════════════════════════════════════════════════════ */
function initScrollAnimations() {
    const animClasses = [
        '.anim-fade-up',
        '.anim-fade-in',
        '.anim-scale-in',
        '.anim-slide-left',
        '.anim-slide-right',
        '.editorial-card',
        '.fabric-step',
        '.impact-card'
    ];

    const elements = document.querySelectorAll(animClasses.join(', '));
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   EDITORIAL COLLECTION SLIDER (HOMEPAGE)
   ══════════════════════════════════════════════════════════ */
function initEditorialSlider() {
    const track   = document.querySelector('.slider-track');
    const outer   = document.querySelector('.slider-track-outer');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsWrap= document.getElementById('slider-dots');

    if (!track) return;

    // Jika track kosong atau butuh di-render dari products.js
    if (typeof MNR_PRODUCTS !== 'undefined' && MNR_PRODUCTS.length > 0) {
        track.innerHTML = MNR_PRODUCTS.map((p, i) => `
            <div class="slider-slide" data-index="${i}">
                <article class="slider-card" onclick="location.href='product.html?id=${p.id}'">
                    <div class="slider-card__media">
                        <img src="${p.image}" alt="${p.name} — MnR" loading="lazy">
                        ${p.lifestyleImage ? `
                            <img class="slider-card__media-hover" src="${p.lifestyleImage}" alt="${p.name} Pemakaian" loading="lazy">
                        ` : ''}
                        <span class="slider-card__badge">${p.categoryLabel || p.category}</span>
                    </div>
                    <div class="slider-card__body">
                        <div class="slider-card__top">
                            <span class="slider-card__id">${p.id}</span>
                            <span class="slider-card__stock">${getStockStatus(p.stock).label}</span>
                        </div>
                        <h3 class="slider-card__title">${p.name}</h3>
                        <p class="slider-card__desc">${p.shortDescription}</p>
                        <div class="slider-card__bottom">
                            <span class="slider-card__price">${formatPrice(p.price)}</span>
                            <a href="product.html?id=${p.id}" class="slider-card__link">Lihat Produk →</a>
                        </div>
                    </div>
                </article>
            </div>
        `).join('');
    }

    const slides = track.querySelectorAll('.slider-slide');
    if (!slides.length) return;

    let currentIndex = 0;

    // Bangun dots indikator
    if (dotsWrap) {
        dotsWrap.innerHTML = Array.from(slides).map((_, i) => `
            <button class="slider-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
        `).join('');

        dotsWrap.querySelectorAll('.slider-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.index, 10);
                goToSlide(idx);
            });
        });
    }

    const updateControls = () => {
        if (dotsWrap) {
            dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= slides.length - 1;
    };

    const goToSlide = (idx) => {
        currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 24;
        track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
        updateControls();
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
            if (diff > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
        }
    }, { passive: true });

    updateControls();
}

/* ══════════════════════════════════════════════════════════
   IMPACT COUNTER ANIMATION
   ══════════════════════════════════════════════════════════ */
function initImpactCounter() {
    const counterSection = document.getElementById('impact');
    if (!counterSection) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
                observer.unobserve(counterSection);
            }
        });
    }, { threshold: 0.25 });

    observer.observe(counterSection);
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        if (isNaN(target)) return;

        const duration = 1600;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const stepVal = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
            current += stepVal;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, stepTime);
    });
}
