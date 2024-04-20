document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.querySelector('.header .btn');
    const verticalNavbar = document.getElementById('verticalNavbar');

    profileBtn.addEventListener('click', function() {
        verticalNavbar.classList.toggle('show');
    });
});
