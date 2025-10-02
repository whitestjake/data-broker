


// this code is for auto-formatting the input for salary for a cleaner look
document.addEventListener('DOMContentLoaded', function() {
    const currencyInput = document.getElementById('salary-input');

    currencyInput.addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except decimal
        const parts = value.split('.');
        let integerPart = parts[0];
        let decimalPart = parts.length > 1 ? '.' + parts[1].substring(0, 2) : ''; // Limit to 2 decimal places

        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add comma separators

        e.target.value = '$' + integerPart + decimalPart;
    });

    currencyInput.addEventListener('blur', function(e) {
        // Optional: Further validation or final formatting on blur
        // For example, if the input is empty or invalid, reset it
        if (e.target.value === '$' || e.target.value === '') {
            e.target.value = '';
        }
    });
});

const registerBtn = document.getElementById('register-button');
registerBtn.onclick = function() {
    const firstNameInput = document.getElementById("first-name-input")
    const lastNameInput = document.getElementById("last-name-input")
    const ageInput = document.getElementById("age-input")
    const salaryInput = document.getElementById("salary-input")
    const emailInput = document.getElementById("email-input")
    const passwordInput = document.getElementById("password-input")
    const confirmInput = document.getElementById("confirm-password-input")

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const age = ageInput.value;
    const salary = salaryInput.value;
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

    if (age < 0) {
        console.log('age input is invalid');
        // document.getElementById('age-error').removeAttribute('hidden');
        return;
    }

    if (salary < 0) {
        console.log('salary input is invalid');
        // document.getElementById('salary-error').removeAttribute('hidden');
        return;
    }

    firstNameInput.value = '';
    lastNameInput.value = '';
    ageInput.value = '';
    salaryInput.value = '';
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
            age: age,
            salary: salary,
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
            setTimeout(() => {
                window.location.replace("http://localhost/data-broker/frontend/home/home.html");
            }, 1500);
        }
      });
}


