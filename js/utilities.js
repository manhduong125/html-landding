// Animation Utilities - Global helpers for GSAP and animations

class AnimationUtilities {
    constructor() {
        this.animations = [];
        this.isInitialized = false;
    }

    /**
     * Initialize Lenis smooth scroll
     */
    static initLenis() {
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis library not loaded');
            return null;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.update();
            }
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', () => ScrollTrigger.update());

            const scroller = document.scrollingElement || document.documentElement || document.body;

            // Sync Lenis to the browser's current scroll position on page load
            if (window.pageYOffset && typeof lenis.scrollTo === 'function') {
                lenis.scrollTo(window.pageYOffset, { duration: 0, immediate: true });
            }

            const proxy = {
                scrollTop(value) {
                    if (arguments.length) {
                        lenis.scrollTo(value, { duration: 0, immediate: true });
                        return;
                    }
                    return lenis.scroll;
                },
                scrollLeft(value) {
                    if (arguments.length) {
                        lenis.scrollTo(value, { duration: 0, immediate: true });
                        return;
                    }
                    return 0;
                },
                getBoundingClientRect() {
                    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                },
                pinType: scroller.style.transform ? 'transform' : 'fixed',
            };

            ScrollTrigger.scrollerProxy(scroller, proxy);

            if (document.body !== scroller) {
                ScrollTrigger.scrollerProxy(document.body, proxy);
            }

            ScrollTrigger.defaults({ scroller });

            ScrollTrigger.addEventListener('refreshInit', () => {
                if (typeof lenis.resize === 'function') {
                    lenis.resize();
                }
            });

            ScrollTrigger.addEventListener('refresh', () => {
                if (typeof lenis.resize === 'function') {
                    lenis.resize();
                }
            });

            const syncScrollTrigger = () => {
                if (typeof lenis.scrollTo === 'function') {
                    lenis.scrollTo(window.pageYOffset || window.scrollY, { duration: 0, immediate: true });
                }
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.update();
                    ScrollTrigger.refresh();
                }
            };

            ScrollTrigger.refresh();

            window.addEventListener('hashchange', () => requestAnimationFrame(syncScrollTrigger));
            window.addEventListener('popstate', () => requestAnimationFrame(syncScrollTrigger));
            window.addEventListener('load', () => requestAnimationFrame(syncScrollTrigger));
        }

        return lenis;
    }

    /**
     * Fade up animation with ScrollTrigger
     */
    static fadeUpAnimation(selector = '.fade-up', duration = 0.6, stagger = 0.1) {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(selector, {
            scrollTrigger: {
                trigger: selector,
                start: 'top 80%',
                end: 'top 20%',
                markers: false,
                once: false,
            },
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            ease: 'power3.out',
        });
    }

    /**
     * Reveal mask animation
     */
    static revealAnimation(selector = '.reveal', duration = 0.8) {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(`${selector}::before`, {
            scrollTrigger: {
                trigger: selector,
                start: 'top 75%',
                once: true,
            },
            scaleX: 0,
            duration: duration,
            ease: 'power4.inOut',
        });
    }

    /**
     * Parallax effect on scroll
     */
    static parallaxAnimation(selector = '.parallax', speed = -0.5) {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(selector, {
            scrollTrigger: {
                trigger: selector,
                scrub: true,
                markers: false,
            },
            y: (i, target) => {
                return ScrollTrigger.getVelocity(target) * speed;
            },
            ease: 'none',
        });
    }

    /**
     * Stagger content animation
     */
    static staggerAnimation(selector = '.stagger-item', duration = 0.6, delay = 0.15) {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(selector, {
            scrollTrigger: {
                trigger: selector,
                start: 'top 80%',
                once: false,
            },
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: delay,
            ease: 'back.out',
        });
    }

    /**
     * Pin section animation
     */
    static pinSection(selector = '.pinned-section', duration = 5) {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(`${selector} .pin-content`, {
            scrollTrigger: {
                trigger: selector,
                pin: true,
                scrub: 1,
                end: `+=${duration * 100}`,
                markers: false,
            },
            duration: duration,
        });
    }

    /**
     * Text split animation
     */
    static textSplitAnimation(selector = '.text-split', duration = 0.8, stagger = 0.03) {
        if (typeof gsap === 'undefined' || typeof SplitType === 'undefined') return;

        // Split text into characters
        const text = new SplitType(selector, { types: 'chars' });

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(`${selector} .char`, {
            scrollTrigger: {
                trigger: selector,
                start: 'top 80%',
                once: true,
            },
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: duration,
            stagger: stagger,
            ease: 'back.out',
        });
    }

    /**
     * Image reveal animation
     */
    static imageRevealAnimation(selector = '.image-reveal', duration = 0.8) {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.to(`${selector}::before`, {
            scrollTrigger: {
                trigger: selector,
                start: 'top 70%',
                once: true,
            },
            scaleX: 0,
            duration: duration,
            ease: 'power4.inOut',
        });
    }

    /**
     * Smooth horizontal scroll gallery
     */
    static horizontalGallery(selector = '.h-scroll-gallery', speed = 1) {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const gallery = document.querySelector(selector);
        if (!gallery) return;

        gsap.to(selector, {
            scrollTrigger: {
                trigger: selector,
                scrub: speed,
                markers: false,
            },
            x: () => -(gallery.scrollWidth - window.innerWidth),
            ease: 'none',
        });
    }

    /**
     * Pinned storytelling section
     */
    static pinnedStorySection(selector = '.story-pin-section', storyDuration = 4) {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const stories = gsap.utils.toArray(`${selector} .story-bg`);

        gsap.to(stories, {
            scrollTrigger: {
                trigger: selector,
                start: 'top top',
                end: `+=${stories.length * 100}%`,
                scrub: 1,
                pin: true,
                markers: false,
            },
            opacity: (i) => (i === 0 ? 1 : 0),
            duration: storyDuration,
            stagger: {
                each: storyDuration / stories.length,
            },
        });
    }

    /**
     * Magnetic button effect
     */
    static magneticButton(selector = '.magnetic-btn') {
        const buttons = document.querySelectorAll(selector);

        buttons.forEach((button) => {
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = Math.max(rect.width, rect.height);

                if (distance < maxDistance) {
                    const forceX = (x / maxDistance) * 15;
                    const forceY = (y / maxDistance) * 15;

                    gsap.to(this, {
                        x: forceX,
                        y: forceY,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                }
            });

            button.addEventListener('mouseleave', function() {
                gsap.to(this, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'elastic.out(1, 0.5)',
                });
            });
        });
    }

    /**
     * Mouse parallax effect
     */
    static mouseParallax(selector = '.parallax-element', strength = 20) {
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) return;

        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

                if (isInViewport) {
                    const x = (mouseX - 0.5) * strength;
                    const y = (mouseY - 0.5) * strength;

                    gsap.to(el, {
                        x: x,
                        y: y,
                        duration: 0.5,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                }
            });
        });
    }

    /**
     * Mouse follow cursor
     */
    static mouseFollowCursor(cursorClass = '.mouse-follow-cursor') {
        const cursor = document.querySelector(cursorClass);
        if (!cursor) return;

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            gsap.to(cursor, {
                left: mouseX - 15,
                top: mouseY - 15,
                duration: 0.5,
                ease: 'power3.out',
            });
        });

        // Show cursor on interactive elements
        const interactive = document.querySelectorAll('a, button, [role="button"]');
        interactive.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }

    /**
     * Scroll to element smoothly
     */
    static smoothScrollTo(target, duration = 1) {
        if (typeof gsap === 'undefined') return;

        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        gsap.to(window, {
            duration: duration,
            scrollTo: element,
            ease: 'power3.inOut',
        });
    }

    /**
     * Animation on scroll trigger with custom callback
     */
    static onScrollTrigger(selector, callback, options = {}) {
        if (typeof gsap === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const defaults = {
            trigger: selector,
            start: 'top 75%',
            once: false,
            ...options,
        };

        ScrollTrigger.create({
            ...defaults,
            onEnter: () => callback('enter'),
            onLeave: () => callback('leave'),
            onEnterBack: () => callback('enterBack'),
            onLeaveBack: () => callback('leaveBack'),
        });
    }

    /**
     * Initialize all common animations
     */
    static initAll() {
        this.initLenis();
        this.fadeUpAnimation();
        this.revealAnimation();
        this.parallaxAnimation();
        this.staggerAnimation();
        this.textSplitAnimation();
        this.imageRevealAnimation();
        this.magneticButton();
        this.mouseParallax();
        this.mouseFollowCursor();
    }
}

// Auto-initialize on DOM ready if GSAP and Lenis are available
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    if (typeof Lenis !== 'undefined') {
        const lenis = AnimationUtilities.initLenis();
        window.lenis = lenis;

        if (typeof ScrollTrigger !== 'undefined' && lenis) {
            lenis.on('scroll', () => ScrollTrigger.update());
            ScrollTrigger.addEventListener('refresh', () => {
                if (typeof lenis.resize === 'function') {
                    lenis.resize();
                }
            });
        }
    }
});