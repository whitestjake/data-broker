


document.addEventListener("DOMContentLoaded", () => {

    fetch("./login/login.html")
        .then(response => response.text())
        .then(html => {
            // find the target div in index.html
            const container = document.getElementById("login-container");

            // inject the login page HTML
            container.innerHTML = html;

            // dynamically load CSS
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "./login/login.css";
            document.head.appendChild(link);

            // dynamically load the JS for login behavior
            const script = document.createElement("script");
            script.src = "./login/login.js";
            document.body.appendChild(script);
        })
        .catch(err => console.error("Error loading login page:", err));

    fetch("./register/register.html")
        .then(response => response.text())
        .then(html => {
            // find the target div in index.html
            const container = document.getElementById("register-container");

            // inject the login page HTML
            container.innerHTML = html;

            // dynamically load CSS
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "./register/register.css";
            document.head.appendChild(link);

            // dynamically load the JS for login behavior
            const script = document.createElement("script");
            script.src = "./register/register.js";
            document.body.appendChild(script);
        })
        .catch(err => console.error("Error loading login page:", err));
});