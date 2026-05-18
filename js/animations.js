// Main Animation Controller - GSAP ScrollTrigger + Lenis Smooth Scroll

document.addEventListener('DOMContentLoaded', () => {
    // Only proceed if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    // Register plugins
    gsap.registerPlugin(ScrollTrigger);

    // ============================================================
    // 1. FADE-UP ANIMATIONS
    // ============================================================
    function initFadeUpAnimations() {
        const fadeUpElements = document.querySelectorAll('[data-animation="fadeUp"]');

        fadeUpElements.forEach((element) => {
            gsap.fromTo(element, { autoAlpha: 0, y: 40 }, {
                scrollTrigger: {
                    trigger: element,
                    scroller: document.scrollingElement || document.documentElement,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    markers: false,
                    once: true,
                    onRefresh(self) {
                        if (self.animation) {
                            self.animation.progress(self.progress);
                        }
                    },
                },
                autoAlpha: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                immediateRender: false,
            });
        });
    }

    // ============================================================
    // 2. REVEAL MASK ANIMATIONS
    // ============================================================
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('[data-animation="reveal"]');

        revealElements.forEach((element) => {
            // Create overlay
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
                },
                scaleX: 0,
                duration: 0.8,
                ease: 'power4.inOut',
            });
        });
    }

    // ============================================================
    // 3. PARALLAX ANIMATIONS
    // ============================================================
    function initParallaxAnimations() {
        const parallaxElements = document.querySelectorAll('[data-animation="parallax"]');

        parallaxElements.forEach((element) => {
            const speed = parseFloat(element.dataset.parallaxSpeed || '0.5');

            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    scrub: true,
                },
                y: (i, target) => {
                    return ScrollTrigger.getVelocity(target) * -speed * 0.1;
                },
                ease: 'none',
            });
        });
    }

    // ============================================================
    // 4. STAGGER CONTENT ANIMATIONS
    // ============================================================
    function initStaggerAnimations() {
        const staggerContainers = document.querySelectorAll('[data-animation="stagger"]');

        staggerContainers.forEach((container) => {
            const items = container.querySelectorAll('[data-stagger-item]');
            if (items.length === 0) return;

            gsap.fromTo(items, { autoAlpha: 0, y: 30 }, {
                scrollTrigger: {
                    trigger: container,
                    scroller: document.scrollingElement || document.documentElement,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                    markers: false,
                    once: true,
                    onRefresh(self) {
                        if (self.animation) {
                            self.animation.progress(self.progress);
                        }
                    },
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

    // ============================================================
    // 5. PIN SECTION ANIMATIONS
    // ============================================================
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
                    markers: false,
                },
            });
        });
    }

    // ============================================================
    // 6. TEXT SPLIT ANIMATIONS
    // ============================================================
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

    // ============================================================
    // 7. IMAGE SEQUENCE ANIMATIONS
    // ============================================================
    function initImageSequenceAnimations() {
        const sequenceElements = document.querySelectorAll('[data-animation="imageSequence"]');

        sequenceElements.forEach((element) => {
            const images = element.querySelectorAll('img');
            if (images.length === 0) return;

            // Hide all images except first
            gsap.set(images, { opacity: 0 });
            gsap.set(images[0], { opacity: 1 });

            gsap.to(images, {
                scrollTrigger: {
                    trigger: element,
                    scrub: 1,
                    markers: false,
                },
                opacity: (i) => (i === 0 ? 0 : 1),
                duration: 0.5,
                stagger: 0.1,
                ease: 'none',
            });
        });
    }

    // ============================================================
    // 8. MAGNETIC BUTTON EFFECTS
    // ============================================================
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('[data-magnetic="true"]');

        magneticButtons.forEach((button) => {
            let x = 0;
            let y = 0;
            let targetX = 0;
            let targetY = 0;

            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const buttonCenterX = rect.left + rect.width / 2;
                const buttonCenterY = rect.top + rect.height / 2;

                targetX = (e.clientX - buttonCenterX) * 0.2;
                targetY = (e.clientY - buttonCenterY) * 0.2;

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

    // ============================================================
    // 9. MOUSE PARALLAX EFFECT
    // ============================================================
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
                    x: x,
                    y: y,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            });
        });
    }

    // ============================================================
    // 10. SMOOTH HORIZONTAL GALLERY
    // ============================================================
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
                    markers: false,
                },
                x: -(scrollWidth - clientWidth),
                ease: 'none',
            });
        });
    }

    // ============================================================
    // 11. PINNED STORYTELLING SECTION
    // ============================================================
    function initPinnedStorySection() {
        const storySection = document.querySelector('[data-animation="pinnedStory"]');
        if (!storySection) return;

        const stories = storySection.querySelectorAll('[data-story-slide]');
        if (stories.length === 0) return;

        // Hide all stories except first
        gsap.set(stories, { opacity: 0 });
        gsap.set(stories[0], { opacity: 1 });

        gsap.to(stories, {
            scrollTrigger: {
                trigger: storySection,
                start: 'top top',
                end: `+=${stories.length * 200}%`,
                scrub: 1,
                pin: true,
                markers: false,
            },
            opacity: (i) => (i === 0 ? 0 : 1),
            duration: 1,
            stagger: {
                each: 0.5,
            },
            ease: 'power1.inOut',
        });
    }

    // ============================================================
    // 12. SCROLL-TO-TOP BUTTON
    // ============================================================
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
            gsap.to(window, {
                scrollTo: 0,
                duration: 1,
                ease: 'power3.inOut',
            });
        });
    }

    // ============================================================
    // 13. IMAGE REVEAL WITH PARALLAX
    // ============================================================
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
                },
                scale: 1.1,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });
        });
    }

    // ============================================================
    // Initialize All Animations
    // ============================================================
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

        // Refresh ScrollTrigger after all animations are initialized
        ScrollTrigger.refresh();
    }

    // Start initialization
    initializeAllAnimations();

    // Make sure ScrollTrigger measures correctly after full page load/hash positioning
    window.addEventListener('load', () => {
        if (typeof window.lenis !== 'undefined' && typeof window.lenis.scrollTo === 'function') {
            window.lenis.scrollTo(window.pageYOffset || window.scrollY, { duration: 0, immediate: true });
        }
        ScrollTrigger.refresh();
    });

    // Refresh on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    console.log('✓ GSAP ScrollTrigger Animations initialized');
});