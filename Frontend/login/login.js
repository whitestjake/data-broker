





const loginBtn = document.getElementById('login-button');
loginBtn.onclick = function () {
    const emailInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");

    const email = emailInput.value.toLowerCase().trim(); // lowercase for consistency
    const password = passwordInput.value;

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
                window.location.replace("http://localhost/data-broker/frontend/home/home.html");
            }, 1500);
        } else {
            console.error("Login failed:", data.error);
            // show error on page
        }
    });
}