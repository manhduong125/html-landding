document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.section, .say, .slide-amenities, .slide-experience, .album-thumbs, .destination, .city, .say-item');
    const parallaxSections = document.querySelectorAll('.hero, .section');
    const heroText = document.querySelector('.hero-text');
    let ticking = false;

    if (heroText) {
        window.setTimeout(() => heroText.classList.add('visible'), 200);
    }

    const updateParallax = () => {
        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const offset = rect.top / window.innerHeight;
            const position = 50 - offset * 15;
            section.style.backgroundPosition = `center ${Math.max(20, Math.min(80, position))}%`;
        });
        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
});