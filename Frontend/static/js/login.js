



export function initLoginForm(container) {
    if (!container) return;

    // Event delegation: listen for clicks anywhere inside the container
    container.addEventListener('click', (e) => {
        // Only handle clicks on the login button
        if (e.target.id !== 'login-button') return;

        // Scope search to the closest parent div (or container itself)
        const formContainer = e.target.closest('div') || container;

        const userInput = formContainer.querySelector("#login-username-input");
        const passwordInput = formContainer.querySelector("#login-password-input");

        if (!userInput || !passwordInput) {
            console.warn("Login inputs not found!");
            return;
        }

        const user = userInput.value.trim();
        const password = passwordInput.value;

        if (!password) {
            formContainer.querySelector('#login-password-error')?.removeAttribute('hidden');
            return;
        }

        // Send login request
        fetch("http://localhost:5050/login", {
            headers: { 'Content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ user, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                formContainer.querySelector('#login-error')?.removeAttribute('hidden');
                console.log('Login Error:', data.error);
            } else {
                console.log("Login Successful");
                sessionStorage.setItem("username", data.user);
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



