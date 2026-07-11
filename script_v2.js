document.addEventListener('DOMContentLoaded', function() {
    const pictures = document.querySelectorAll('.picture');
    const overlay = document.getElementById('overlay');
    const overlayImg = document.getElementById('overlayImg');

    pictures.forEach(picture => {
        picture.addEventListener('click', function() {
            overlayImg.src = this.src;
            overlay.style.display = 'flex';
        });
    });

    overlay.addEventListener('click', function() {
        overlay.style.display = 'none';
    });
});

function toggleMobileMenu() {
    var menuList = document.querySelector('.mobile-menu-list');
    menuList.classList.toggle('active');
}

function hideMobileMenu() {
    var menuList = document.querySelector('.mobile-menu-list');
    menuList.classList.remove('active');
}
