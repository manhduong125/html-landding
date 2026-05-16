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