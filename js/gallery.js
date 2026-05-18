const mainImg = document.getElementById('main-img');
const mainVideo = document.getElementById('main-video');
const thumbItems = document.querySelectorAll('.thumb-item');

// Hàm xử lý đổi file hiển thị ở khung lớn (Ảnh hoặc Video)
function updateMainDisplay(type, src) {
    if (type === 'video') {
        mainImg.classList.remove('active');
        mainVideo.src = src;
        mainVideo.classList.add('active');
        mainVideo.play(); // Tự động phát video khi click chọn
    } else {
        mainVideo.classList.remove('active');
        mainVideo.pause();
        mainImg.src = src;
        mainImg.classList.add('active');
    }
}

// 1. Lắng nghe sự kiện Click vào các Thumb lớn ở dưới
thumbItems.forEach(item => {
    item.addEventListener('click', function(e) {
        // Nếu người dùng click trúng vào ảnh con bên trong popup thì bỏ qua, để hàm dưới xử lý
        if (e.target.classList.contains('sub-thumb')) return;

        thumbItems.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const type = this.getAttribute('data-type');
        const src = this.getAttribute('data-src');
        updateMainDisplay(type, src);
    });
});

// 2. Lắng nghe sự kiện Click vào các ảnh con (Sub-thumbs) xuất hiện khi hover
const subThumbs = document.querySelectorAll('.sub-thumb');
subThumbs.forEach(sub => {
    sub.addEventListener('click', function(e) {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra thumb cha lớn

        // Cập nhật viền active cho thumb cha chứa nó
        const parentThumb = this.closest('.thumb-item');
        thumbItems.forEach(t => t.classList.remove('active'));
        parentThumb.classList.add('active');

        const type = this.getAttribute('data-type');
        const src = this.getAttribute('data-src');
        updateMainDisplay(type, src);
    });
});

const slides = Array.from(document.querySelectorAll(".slide-item"));
const pagination = document.querySelector(".pagination");

let active = 0;

/* CREATE DOTS */

slides.forEach((_, i) => {

    const dot = document.createElement("div");

    dot.className = "dot";

    dot.addEventListener("click", () => {

        active = i;

        updateSlider();
    });

    pagination.appendChild(dot);
});

/* UPDATE */

function updateSlider() {

    const dots = document.querySelectorAll(".dot");

    slides.forEach(slide => {

        slide.className = "slide-item";
    });

    slides.forEach((slide, index) => {

        let offset = index - active;

        /* LOOP */

        if (offset < -slides.length / 2) {
            offset += slides.length;
        }

        if (offset > slides.length / 2) {
            offset -= slides.length;
        }

        /* ONLY SHOW 5 */

        if (offset < -2 || offset > 2) {

            slide.classList.add("hidden");
            return;
        }

        slide.classList.add(`pos-${offset}`);

        if (offset === 0) {

            slide.classList.add("active");
        }
    });

    dots.forEach(dot => dot.classList.remove("active"));

    dots[active].classList.add("active");
}

/* NEXT */

function nextSlide() {

    active++;

    if (active >= slides.length) {
        active = 0;
    }

    updateSlider();
}

/* PREV */

function prevSlide() {

    active--;

    if (active < 0) {
        active = slides.length - 1;
    }

    updateSlider();
}

/* CLICK ACTIVE */

slides.forEach((slide, index) => {

    slide.addEventListener("click", () => {

        active = index;

        updateSlider();
    });
});

/* AUTOPLAY */

setInterval(nextSlide, 4000);

/* INIT */

updateSlider();


const swiper = new Swiper(".luxurySwiper", {
    slidesPerView: 2.5,
    spaceBetween: 24,
    speed: 1200,
    loop: true,

    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },

    pagination: false,

    breakpoints: {
        0: {
            slidesPerView: 1.5
        },
        768: {
            slidesPerView: 1.5
        },
        1200: {
            slidesPerView: 2.5
        }
    }
});