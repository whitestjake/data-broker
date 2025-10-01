

const registerBtn = document.getElementById('register-button');
registerBtn.onclick = function() {
    const firstNameInput = document.getElementById("first-name-input")
    const lastNameInput = document.getElementById("last-name-input")
    const emailInput = document.getElementById("email-input")
    const passwordInput = document.getElementById("password-input")
    const confirmInput = document.getElementById("confirm-password-input")

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        console.log("Invalid email format");
        document.getElementById('email-valid-error').removeAttribute('hidden');
        return;
    }

    if (password !== confirm) {
        console.log("Passwords do not match");
        document.getElementById('password-error').removeAttribute('hidden');
        return;
    }

    firstNameInput.value = '';
    lastNameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    confirmInput.value = '';

    fetch("http://localhost:5050/register", {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirm: confirm
        })
    }).then(response => response.json())
      .then(data => {
        if (data.error) {
            console.log('Error: ' + data.error);
            document.getElementById("email-use-error").removeAttribute('hidden');
        } else {
            console.log("Registration Successful");
            document.getElementById('register-success').removeAttribute('hidden');
        }
      });
}


