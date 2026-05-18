// Parallax scroll effect for section-top clouds with GSAP ScrollTrigger

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Fallback to vanilla JS parallax
        initVanillaParallax();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const sectionTop = document.querySelector('.section-top');
    const cloud1 = document.querySelector('.cloud-1');
    const cloud2 = document.querySelector('.cloud-2');

    if (!sectionTop || !cloud1 || !cloud2) return;

    // GSAP horizontal motion with section pin for clouds
    const cloudTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: sectionTop,
            start: 'top top',
            end: '+=120%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            markers: false,
        },
    });

    cloudTimeline.to(cloud1, {
        x: -180,
        y: 60,
        ease: 'none',
    }, 0);

    cloudTimeline.to(cloud2, {
        x: 180,
        y: -60,
        ease: 'none',
    }, 0);
});

// Fallback vanilla JS parallax for browsers without GSAP
function initVanillaParallax() {
    const sectionTop = document.querySelector('.section-top');
    const cloud1 = document.querySelector('.cloud-1');
    const cloud2 = document.querySelector('.cloud-2');

    if (!sectionTop || !cloud1 || !cloud2) return;

    function updateParallax() {
        const sectionTop_position = sectionTop.offsetTop;
        const sectionHeight = sectionTop.offsetHeight;
        const scrollY = window.scrollY;

        if (scrollY < sectionTop_position) {
            cloud1.style.transform = 'translateY(0px)';
            cloud2.style.transform = 'translateY(0px)';
        } else if (scrollY > sectionTop_position + sectionHeight) {
            const maxOffset = sectionHeight * 0.3;
            cloud1.style.transform = `translateY(${maxOffset * 0.5}px)`;
            cloud2.style.transform = `translateY(${-maxOffset * 0.5}px)`;
        } else {
            const scrollInSection = scrollY - sectionTop_position;
            const parallaxStrength = 0.5;

            const offset1 = scrollInSection * parallaxStrength * 0.5;
            const offset2 = scrollInSection * parallaxStrength * -0.5;

            cloud1.style.transform = `translateY(${offset1}px)`;
            cloud2.style.transform = `translateY(${offset2}px)`;
        }
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
}