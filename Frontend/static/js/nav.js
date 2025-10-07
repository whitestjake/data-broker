



export async function loadNavbar(containerId = 'navbar-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch('/views/nav.html');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const html = await response.text();
        container.innerHTML = html;

        // Add click listener for the logo
        const navLogo = container.querySelector('#nav-logo');
        if (navLogo) {
            navLogo.addEventListener('click', () => {
                window.location.href = '/';
            });
        }

        const navLogin = container.querySelector('#login-route');
        if (navLogin) {
            navLogin.addEventListener('click', () => {
                window.location.href = '/'
            });
        }

        const navRegister = container.querySelector('#register-route');
        if (navRegister) {
            navRegister.addEventListener('click', () => {
                window.location.href = '/register'
            });
        }
    } catch (err) {
        console.error('Error loading navbar:', err);
    }
}