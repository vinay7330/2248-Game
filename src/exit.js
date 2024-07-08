document.addEventListener('DOMContentLoaded', function() {
    const image = document.querySelector('.shake-img');
    const modal = document.getElementById('myModal');
    const confirmButton = document.getElementById('confirmExit');
    const cancelButton = document.getElementById('cancelExit');

    image.addEventListener('click', () => {
        image.classList.add('shake-animation');
        setTimeout(() => {
            image.classList.remove('shake-animation');
            modal.style.display = 'flex';
        }, 500); // Adjust the time as needed (1000ms = 1s)
    });

    confirmButton.addEventListener('click', () => {
        // Hide the modal
        modal.style.display = 'none';
        // Start the fall-down animation
        image.classList.add('fall-down');

        // After the fall-down animation ends, hide the image
        image.addEventListener('animationend', () => {
            if (image.classList.contains('fall-down')) {
                image.style.display = 'none';
            }
        });

        setTimeout(() => {
                window.location.href = "index.html";
        }, 1000);
    });

    cancelButton.addEventListener('click', () => {
        // Hide the modal
        modal.style.display = 'none';
    });

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});
