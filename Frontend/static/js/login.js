
import { loadNavbar } from '/static/js/nav.js';

export function initLoginForm(container) {
    if (!container) return;

    loadNavbar();

    container.addEventListener('click', (e) => {
        if (e.target.id !== 'login-button') return;

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

                // STORE LOGGED-IN USER INFO
                sessionStorage.setItem('loggedInUser', JSON.stringify({
                    username: data.username,
                    firstName: data.firstName
                }));

                window.location.href = "/home.html";
            }
        })
        .catch(err => console.error("Login request failed:", err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('login-container') || document.body;
    if (document.getElementById('login-button')) {
        initLoginForm(container);
    }
});




