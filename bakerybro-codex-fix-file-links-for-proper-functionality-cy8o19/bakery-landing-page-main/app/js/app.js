document.addEventListener('DOMContentLoaded', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.querySelector('header');
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.mobile-overlay');

    if (toggle) {
        toggle.addEventListener('click', () => {
            nav?.classList.toggle('active');
            overlay?.classList.toggle('active');
            header?.classList.toggle('active');
        });
    }

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    });

    if (window.Swiper) {
        const wheelify = (selector, opts = {}) => {
            const el = document.querySelector(selector);
            if (!el) return null;
            const swiper = new Swiper(el, opts);
            el.addEventListener('wheel', e => {
                if (e.deltaY > 0 && !swiper.isEnd) {
                    e.preventDefault();
                    swiper.slideNext();
                } else if (e.deltaY < 0 && !swiper.isBeginning) {
                    e.preventDefault();
                    swiper.slidePrev();
                }
            }, { passive: false });
            return swiper;
        };

        wheelify('.hero-swiper', {
            speed: 800,
            mousewheel: { forceToAxis: true, releaseOnEdges: true },
            watchSlidesProgress: true,
            pagination: { el: '.hero-pagination', clickable: true }
        });
        wheelify('.products-swiper', {
            speed: 700,
            mousewheel: { forceToAxis: true, releaseOnEdges: true },
            pagination: { el: '.products-pagination', clickable: true }
        });
        wheelify('.menu-swiper', {
            speed: 700,
            mousewheel: { forceToAxis: true, releaseOnEdges: true },
            pagination: { el: '.menu-pagination', clickable: true }
        });
    }

    if (!reduce) {
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(ring);

        let ringX = window.innerWidth / 2;
        let ringY = window.innerHeight / 2;
        let mouseX = ringX;
        let mouseY = ringY;
        let targetScale = 1;
        let currentScale = 1;
        let visible = false;

        const render = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            currentScale += (targetScale - currentScale) * 0.2;
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${currentScale})`;
            requestAnimationFrame(render);
        };
        render();

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!visible) {
                ring.style.opacity = '1';
                visible = true;
            }
        });

        document.addEventListener('mousedown', () => { targetScale = 0.85; });
        document.addEventListener('mouseup', () => { targetScale = 1; });

        document.querySelectorAll('a, button, .js-magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => { targetScale = 1.6; });
            el.addEventListener('mouseleave', () => { targetScale = 1; });
        });

        document.querySelectorAll('.js-magnetic').forEach(el => {
            const strength = 4;
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / strength;
                const y = (e.clientY - rect.top - rect.height / 2) / strength;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });

        const revealEls = document.querySelectorAll('[data-reveal]');
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-inview');
            });
        }, { threshold: 0.1 });
        revealEls.forEach(el => io.observe(el));

        const depthEls = document.querySelectorAll('[data-depth]');
        if (depthEls.length) {
            let latestY = window.scrollY;
            let ticking = false;
            const update = () => {
                depthEls.forEach(el => {
                    const d = parseFloat(el.dataset.depth || 0);
                    el.style.transform = `translate3d(0, ${latestY * d}px, 0)`;
                });
                ticking = false;
            };
            const onScroll = () => {
                latestY = window.scrollY;
                if (!ticking) {
                    requestAnimationFrame(update);
                    ticking = true;
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            update();
        }
    }

    // Basic mobile toggles for hero/menu fallbacks (attach regardless of width)
    const bindMobileChips = () => {
        // Hero options
        const heroMobile = document.querySelector('.hero-mobile');
        if (heroMobile) {
            const titleEl = heroMobile.querySelector('.hero-mobile__title');
            const priceEl = heroMobile.querySelector('.hero-mobile__price');
            const imgEl = heroMobile.querySelector('.hero-mobile__img img');
            const applyHero = (btn) => {
                heroMobile.querySelectorAll('[data-hero-option]')
                    .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const t = btn.getAttribute('data-title') || btn.textContent?.trim();
                const p = btn.getAttribute('data-price');
                const img = btn.getAttribute('data-img');
                if (t && titleEl) titleEl.textContent = t;
                if (p && priceEl) priceEl.textContent = p;
                if (img && imgEl) {
                    imgEl.setAttribute('src', img);
                    imgEl.setAttribute('alt', t || '');
                }
            };
            heroMobile.querySelectorAll('[data-hero-option]').forEach(btn => {
                btn.addEventListener('click', () => applyHero(btn));
            });
            // Initialize from the active chip
            const initial = heroMobile.querySelector('[data-hero-option].active') || heroMobile.querySelector('[data-hero-option]');
            if (initial) applyHero(initial);
        }

        // Menu options
        const menuMobile = document.querySelector('.menu-mobile');
        if (menuMobile) {
            const titleEl = menuMobile.querySelector('.menu-mobile__title');
            const imgEl = menuMobile.querySelector('.menu-mobile__img img');
            const applyMenu = (btn) => {
                menuMobile.querySelectorAll('[data-menu-option]')
                    .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const t = btn.getAttribute('data-title') || btn.textContent?.trim();
                const img = btn.getAttribute('data-img');
                if (t && titleEl) titleEl.textContent = t;
                if (img && imgEl) imgEl.setAttribute('src', img);
            };
            menuMobile.querySelectorAll('[data-menu-option]').forEach(btn => {
                btn.addEventListener('click', () => applyMenu(btn));
            });
            const initial = menuMobile.querySelector('[data-menu-option].active') || menuMobile.querySelector('[data-menu-option]');
            if (initial) applyMenu(initial);
        }
    };

    bindMobileChips();
    // Also rebind on viewport changes from DevTools device toggles
    const mql = window.matchMedia('(max-width: 600px)');
    if (mql.addEventListener) mql.addEventListener('change', bindMobileChips);
    else if (mql.addListener) mql.addListener(bindMobileChips);
});
