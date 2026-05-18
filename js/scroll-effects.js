// Enhanced smooth scroll effects — Lenis + GSAP ScrollTrigger

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollToPlugin);
    }

    const HEADER_OFFSET = 90;

    function getScrollY() {
        if (typeof window.lenis !== 'undefined') {
            return window.lenis.scroll;
        }
        return window.scrollY;
    }

    function initSmoothAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            link.addEventListener('click', (e) => {
                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                if (typeof window.lenis !== 'undefined' && typeof window.lenis.scrollTo === 'function') {
                    window.lenis.scrollTo(target, {
                        offset: -HEADER_OFFSET,
                        duration: 1.8,
                        easing: (t) => 1 - Math.pow(1 - t, 4),
                    });
                    return;
                }

                gsap.to(window, {
                    duration: 1.4,
                    scrollTo: { y: target, offsetY: HEADER_OFFSET },
                    ease: 'power3.inOut',
                });
            });
        });
    }

    function initScrollProgress() {
        const bar = document.createElement('di' + 'v');
        bar.className = 'scroll-progress';
        bar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(bar);

        gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });

        ScrollTrigger.create({
            start: 0,
            end: 'max',
            scrub: 0.35,
            onUpdate: (self) => {
                gsap.set(bar, { scaleX: self.progress });
            },
        });
    }

    function initHeaderOnScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: () => {
                header.classList.toggle('header--scrolled', getScrollY() > 60);
            },
        });
    }

    function initSectionBgParallax() {
        const sections = document.querySelectorAll('.section[data-scroll-parallax]');

        sections.forEach((section) => {
            const speed = parseFloat(section.dataset.parallaxSpeed || '0.15');
            const amount = 80 * speed;

            gsap.fromTo(
                section,
                { backgroundPositionY: `${50 - amount * 0.5}%` },
                {
                    backgroundPositionY: `${50 + amount * 0.5}%`,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.2,
                        invalidateOnRefresh: true,
                    },
                }
            );
        });
    }

    function initContentFloatParallax() {
        const floats = document.querySelectorAll('[data-scroll-float]');

        floats.forEach((el) => {
            const speed = parseFloat(el.dataset.floatSpeed || '40');

            gsap.fromTo(
                el,
                { y: speed * 0.35 },
                {
                    y: -speed * 0.35,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5,
                        invalidateOnRefresh: true,
                    },
                }
            );
        });
    }

    function initSectionDepth() {
        const depthSections = document.querySelectorAll('.section.section-2, .section.section-3, .section.section-4');

        depthSections.forEach((section) => {
            const inner = section.querySelector('.container')
                || section.querySelector('.section-2-content, .destination, .section-4-content');
            if (!inner) return;

            gsap.fromTo(
                inner,
                { y: 30, scale: 0.98 },
                {
                    y: -20,
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'bottom 15%',
                        scrub: 1.8,
                        invalidateOnRefresh: true,
                    },
                }
            );
        });
    }

    function initImageMapParallax() {
        const map = document.querySelector('.image-map');
        if (!map) return;

        gsap.fromTo(
            map,
            { y: 60, autoAlpha: 0.85 },
            {
                y: -40,
                autoAlpha: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: map,
                    start: 'top 95%',
                    end: 'bottom 20%',
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                },
            }
        );
    }

    function initExtraFadeAnimations() {
        const presets = {
            fadeDown: { y: -50 },
            fadeLeft: { x: -50 },
            fadeRight: { x: 50 },
            zoomIn: { scale: 0.92, y: 20 },
            rotateIn: { rotation: -8, scale: 0.95, y: 30 },
        };

        Object.entries(presets).forEach(([name, fromVars]) => {
            document.querySelectorAll(`[data-animation="${name}"]`).forEach((element) => {
                const duration = parseFloat(element.dataset.fadeDuration || '1.2');
                const delay = parseFloat(element.dataset.fadeDelay || '0.2');

                gsap.fromTo(
                    element,
                    { autoAlpha: 0, ...fromVars },
                    {
                        autoAlpha: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotation: 0,
                        duration,
                        delay,
                        ease: 'power3.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 88%',
                            toggleActions: 'play none none none',
                            once: true,
                            invalidateOnRefresh: true,
                        },
                        onStart: () => element.classList.add('animated'),
                    }
                );
            });
        });
    }

    requestAnimationFrame(() => {
        initSmoothAnchorLinks();
        initScrollProgress();
        initHeaderOnScroll();
        initSectionBgParallax();
        initContentFloatParallax();
        initSectionDepth();
        initImageMapParallax();
        initExtraFadeAnimations();
        ScrollTrigger.refresh();
    });
});
