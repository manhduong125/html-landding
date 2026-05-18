// Main Animation Controller - GSAP ScrollTrigger + Lenis Smooth Scroll

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    function initFadeUpAnimations() {
        const fadeUpElements = document.querySelectorAll('[data-animation="fadeUp"]');

        fadeUpElements.forEach((element) => {
            if (element.querySelector('[data-animation="fadeUp"]')) return;

            const delay = parseFloat(element.dataset.fadeDelay || '0.5');
            const duration = parseFloat(element.dataset.fadeDuration || '1.5');

            gsap.fromTo(element, { autoAlpha: 0, y: 50 }, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                    once: true,
                    invalidateOnRefresh: true,
                },
                autoAlpha: 1,
                y: 0,
                duration,
                delay,
                ease: 'power2.out',
                immediateRender: false,
                onStart: () => element.classList.add('animated'),
            });
        });
    }

    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('[data-animation="reveal"]');

        revealElements.forEach((element) => {
            if (!element.querySelector('.reveal-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'reveal-overlay';
                overlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--bg, #031023);
                    z-index: 1;
                    transform-origin: right;
                `;
                element.style.position = 'relative';
                element.prepend(overlay);
            }

            gsap.to(element.querySelector('.reveal-overlay'), {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 75%',
                    once: true,
                    invalidateOnRefresh: true,
                },
                scaleX: 0,
                duration: 0.8,
                ease: 'power4.inOut',
            });
        });
    }

    function initParallaxAnimations() {
        const parallaxElements = document.querySelectorAll('[data-animation="parallax"]');

        parallaxElements.forEach((element) => {
            const speed = parseFloat(element.dataset.parallaxSpeed || '0.5');

            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    scrub: true,
                    invalidateOnRefresh: true,
                },
                y: (i, target) => ScrollTrigger.getVelocity(target) * -speed * 0.1,
                ease: 'none',
            });
        });
    }

    function initStaggerAnimations() {
        const staggerContainers = document.querySelectorAll('[data-animation="stagger"]');

        staggerContainers.forEach((container) => {
            const items = container.querySelectorAll('[data-stagger-item]');
            if (items.length === 0) return;

            gsap.fromTo(items, { autoAlpha: 0, y: 30 }, {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    once: true,
                    invalidateOnRefresh: true,
                },
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'back.out',
                immediateRender: false,
            });
        });
    }

    function initPinSections() {
        const pinnedSections = document.querySelectorAll('[data-pin="true"]');

        pinnedSections.forEach((section) => {
            const duration = parseFloat(section.dataset.pinDuration || '5');

            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    pin: true,
                    scrub: 1,
                    end: `+=${duration * 100}`,
                    invalidateOnRefresh: true,
                },
            });
        });
    }

    function initTextSplitAnimations() {
        if (typeof SplitType === 'undefined') return;

        const splitElements = document.querySelectorAll('[data-animation="splitText"]');

        splitElements.forEach((element) => {
            const split = new SplitType(element, { types: 'chars, words' });

            gsap.to(split.chars, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    once: true,
                    invalidateOnRefresh: true,
                },
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.6,
                stagger: 0.03,
                ease: 'back.out',
                immediateRender: false,
            });
        });
    }

    function initImageSequenceAnimations() {
        const sequenceElements = document.querySelectorAll('[data-animation="imageSequence"]');

        sequenceElements.forEach((element) => {
            const images = element.querySelectorAll('img');
            if (images.length === 0) return;

            gsap.set(images, { opacity: 0 });
            gsap.set(images[0], { opacity: 1 });

            gsap.to(images, {
                scrollTrigger: {
                    trigger: element,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
                opacity: (i) => (i === 0 ? 0 : 1),
                duration: 0.5,
                stagger: 0.1,
                ease: 'none',
            });
        });
    }

    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('[data-magnetic="true"]');

        magneticButtons.forEach((button) => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const buttonCenterX = rect.left + rect.width / 2;
                const buttonCenterY = rect.top + rect.height / 2;
                const targetX = (e.clientX - buttonCenterX) * 0.2;
                const targetY = (e.clientY - buttonCenterY) * 0.2;

                gsap.to(button, {
                    x: targetX,
                    y: targetY,
                    duration: 0.3,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1.2, 0.5)',
                });
            });
        });
    }

    function initMouseParallax() {
        const parallaxElements = document.querySelectorAll('[data-mouse-parallax="true"]');
        if (parallaxElements.length === 0) return;

        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            parallaxElements.forEach((el) => {
                const strength = parseFloat(el.dataset.parallaxStrength || '30');
                const x = (mouseX - 0.5) * strength;
                const y = (mouseY - 0.5) * strength;

                gsap.to(el, {
                    x,
                    y,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
        });
    }

    function initHorizontalGallery() {
        const galleries = document.querySelectorAll('[data-animation="hGallery"]');

        galleries.forEach((gallery) => {
            const scrollWidth = gallery.scrollWidth;
            const clientWidth = gallery.clientWidth;
            if (scrollWidth <= clientWidth) return;

            gsap.to(gallery, {
                scrollTrigger: {
                    trigger: gallery,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
                x: -(scrollWidth - clientWidth),
                ease: 'none',
            });
        });
    }

    function initPinnedStorySection() {
        const storySection = document.querySelector('[data-animation="pinnedStory"]');
        if (!storySection) return;

        const stories = storySection.querySelectorAll('[data-story-slide]');
        if (stories.length === 0) return;

        gsap.set(stories, { opacity: 0 });
        gsap.set(stories[0], { opacity: 1 });

        gsap.to(stories, {
            scrollTrigger: {
                trigger: storySection,
                start: 'top top',
                end: `+=${stories.length * 200}%`,
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true,
            },
            opacity: (i) => (i === 0 ? 0 : 1),
            duration: 1,
            stagger: { each: 0.5 },
            ease: 'power1.inOut',
        });
    }

    function initScrollToTop() {
        const scrollTopBtn = document.querySelector('[data-scroll-to-top]');
        if (!scrollTopBtn) return;

        gsap.set(scrollTopBtn, { autoAlpha: 0, pointerEvents: 'none' });

        ScrollTrigger.create({
            onUpdate: (self) => {
                if (self.getVelocity() > 0 && self.getDirection() === -1) {
                    gsap.to(scrollTopBtn, { autoAlpha: 1, pointerEvents: 'auto' });
                } else if (window.scrollY < 300) {
                    gsap.to(scrollTopBtn, { autoAlpha: 0, pointerEvents: 'none' });
                }
            },
        });

        scrollTopBtn.addEventListener('click', () => {
            if (typeof window.lenis !== 'undefined' && typeof window.lenis.scrollTo === 'function') {
                window.lenis.scrollTo(0, { duration: 1 });
                return;
            }

            gsap.to(window, {
                scrollTo: 0,
                duration: 1,
                ease: 'power3.inOut',
            });
        });
    }

    function initImageReveal() {
        const imageReveals = document.querySelectorAll('[data-animation="imageReveal"]');

        imageReveals.forEach((element) => {
            const img = element.querySelector('img');
            if (!img) return;

            gsap.from(img, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 70%',
                    once: true,
                    invalidateOnRefresh: true,
                },
                scale: 1.1,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });
        });
    }

    function initializeAllAnimations() {
        initFadeUpAnimations();
        initRevealAnimations();
        initParallaxAnimations();
        initStaggerAnimations();
        initPinSections();
        initTextSplitAnimations();
        initImageSequenceAnimations();
        initMagneticButtons();
        initMouseParallax();
        initHorizontalGallery();
        initPinnedStorySection();
        initScrollToTop();
        initImageReveal();
        ScrollTrigger.refresh();
    }

    function refreshAfterAssets() {
        if (typeof window.lenis !== 'undefined' && typeof window.lenis.resize === 'function') {
            window.lenis.resize();
        }
        ScrollTrigger.refresh(true);
    }

    // Wait until pin/parallax scripts on the same tick have registered their triggers
    requestAnimationFrame(() => {
        requestAnimationFrame(initializeAllAnimations);
    });

    window.addEventListener('load', refreshAfterAssets);

    window.addEventListener('resize', () => {
        refreshAfterAssets();
    });

    console.log('✓ GSAP ScrollTrigger Animations initialized');
});