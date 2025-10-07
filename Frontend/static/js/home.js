




document.addEventListener('DOMContentLoaded', () => {
    const welcomeContainer = document.getElementById('home-welcome');
    let firstName = sessionStorage.getItem('firstName');

    if (firstName && welcomeContainer) {
        // Capitalize the first letter
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        welcomeContainer.textContent = `Welcome ${firstName}, this is your data home page`;
    } else if (welcomeContainer) {
        welcomeContainer.textContent = "Welcome, guest! Please log in.";
    }
});