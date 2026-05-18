// Parallax scroll effect for section-top clouds with GSAP ScrollTrigger

document.addEventListener('DOMContentLoaded', function() {
    const sectionTop = document.querySelector('.section-top');
    const cloud1 = document.querySelector('.cloud-1');
    const cloud2 = document.querySelector('.cloud-2');

    if (!sectionTop || !cloud1 || !cloud2) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        initVanillaParallax(sectionTop, cloud1, cloud2);
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.set([cloud1, cloud2], { autoAlpha: 0 });

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

    cloudTimeline.to([cloud1, cloud2], {
        autoAlpha: 0.7,
        ease: 'power2.out',
    }, 0);

    cloudTimeline.to(cloud1, {
        x: -180,
        y: 60,
        ease: 'none',
    }, 0.12);

    cloudTimeline.to(cloud2, {
        x: 180,
        y: -60,
        ease: 'none',
    }, 0.12);

    ScrollTrigger.refresh();
});

function initVanillaParallax(sectionTop, cloud1, cloud2) {
    cloud1.style.opacity = '0';
    cloud2.style.opacity = '0';
    cloud1.style.visibility = 'hidden';
    cloud2.style.visibility = 'hidden';

    function updateParallax() {
        const sectionTopPosition = sectionTop.offsetTop;
        const sectionHeight = sectionTop.offsetHeight;
        const scrollY = window.scrollY;
        const scrollInSection = scrollY - sectionTopPosition;
        const progress = Math.min(Math.max(scrollInSection / (sectionHeight * 0.5), 0), 1);

        if (scrollY < sectionTopPosition) {
            cloud1.style.opacity = '0';
            cloud2.style.opacity = '0';
            cloud1.style.visibility = 'hidden';
            cloud2.style.visibility = 'hidden';
            cloud1.style.transform = 'translate(0px, 0px)';
            cloud2.style.transform = 'translate(0px, 0px)';
            return;
        }

        cloud1.style.visibility = 'visible';
        cloud2.style.visibility = 'visible';
        cloud1.style.opacity = String(0.7 * progress);
        cloud2.style.opacity = String(0.7 * progress);

        const parallaxStrength = 0.5;
        const offset1 = scrollInSection * parallaxStrength * 0.5;
        const offset2 = scrollInSection * parallaxStrength * -0.5;

        cloud1.style.transform = `translate(${-offset1 * 0.6}px, ${offset1}px)`;
        cloud2.style.transform = `translate(${offset2 * 0.6}px, ${offset2}px)`;
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
}
