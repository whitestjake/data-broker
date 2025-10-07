


import { initLoginForm } from '/static/js/login.js';
import { initRegisterForm } from '/static/js/register.js';
import { loadNavbar } from '/static/js/nav.js';

document.addEventListener("DOMContentLoaded", async () => {

    // load navbar
    loadNavbar();

    // Generic function to load a view into a container
    async function loadView(viewName, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found`);
            return;
        }

        try {
            // Fetch the HTML for the view
            const response = await fetch(`/views/${viewName}.html`);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const html = await response.text();

            // Inject the HTML into the container
            container.innerHTML = html;

            // Initialize the form AFTER HTML injection
            switch (viewName) {
                case "login":
                    initLoginForm(container);
                    break;
                case "register":
                    initRegisterForm(container);
                    break;
                default:
                    console.warn(`No initializer for view: ${viewName}`);
            }

        } catch (err) {
            console.error(`Error loading ${viewName}:`, err);
        }
    }

    // Load login and register views
    loadView("login", "login-container");
    // loadView("register", "register-container");
});



