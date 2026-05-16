document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.section, .say, .slide-amenities, .slide-experience, .album-thumbs, .destination, .city, .say-item');
    const heroText = document.querySelector('.hero-text');

    if (heroText) {
        window.setTimeout(() => heroText.classList.add('visible'), 200);
    }

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