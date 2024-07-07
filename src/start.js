document.getElementById('start-button').addEventListener('click', function() {
    setTimeout(function() {
        window.location.href = "Game.html";
    }, 300);
});

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.querySelector('.start-btn');

    // Add click event listener
    startBtn.addEventListener('click', function() {
        // Add a class to apply the shrink effect
        this.classList.add('clicked');

        // Remove the class after a short delay to return to normal size
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 200); // Adjust the delay to match the transition duration
    });
});
