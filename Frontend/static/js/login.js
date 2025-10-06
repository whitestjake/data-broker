



export function initLoginForm(container) {
    if (!container) return;

    // Event delegation: listen for clicks anywhere inside the container
    container.addEventListener('click', (e) => {
        // Only handle clicks on the login button
        if (e.target.id !== 'login-button') return;

        // Scope search to the closest parent div (or container itself)
        const formContainer = e.target.closest('div') || container;

        const emailInput = formContainer.querySelector("#login-username-input");
        const passwordInput = formContainer.querySelector("#login-password-input");

        if (!emailInput || !passwordInput) {
            console.warn("Login inputs not found!");
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Basic email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            formContainer.querySelector('#login-email-error')?.removeAttribute('hidden');
            return;
        }

        if (!password) {
            formContainer.querySelector('#login-password-error')?.removeAttribute('hidden');
            return;
        }

        // Send login request
        fetch("http://localhost:5050/login", {
            headers: { 'Content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                formContainer.querySelector('#login-error')?.removeAttribute('hidden');
                console.log('Login Error:', data.error);
            } else {
                console.log("Login Successful");
                window.location.href = "/views/home.html";
            }
        })
        .catch(err => console.error("Login request failed:", err));
    });
}

// Auto-initialzie for direct page load
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('login-container') || document.body;
    if (document.getElementById('login-button')) {
        initLoginForm(container);
    }
});



