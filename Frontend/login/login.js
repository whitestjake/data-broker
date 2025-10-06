




// assigns login button to a variable
const loginBtn = document.getElementById('login-button');

// this following code runs after clicking the login button
loginBtn.onclick = function () {

    // extracts the value from inside the username and password input
    const emailInput = document.getElementById("login-username-input");
    const passwordInput = document.getElementById("login-password-input");

    const email = emailInput.value.toLowerCase().trim(); // lowercase for consistency
    const password = passwordInput.value;

    // calls backend for login functionality to access database
    fetch("http://localhost:5050/login", {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Login successful:", data);
            // redirect to homepage after successful login
            setTimeout(() => {
                window.location.href = "/data-broker/frontend/home/home.html";
            }, 1000);
        } else {
            console.error("Login failed:", data.error);
            // show error on page
        }
    });
}