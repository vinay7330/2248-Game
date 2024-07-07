document.getElementById('start-button').addEventListener('click', function() {
    setTimeout(function() {
        window.location.href = "Game.html";
    }, 300);
});

    document.addEventListener('DOMContentLoaded', function () {
    const image = document.querySelector('.shake-img');

    image.addEventListener('click', function () {
        image.classList.add('clicked');
        
        image.addEventListener('animationend', function () {
            image.classList.remove('clicked');
        }, { once: true });
    });
});