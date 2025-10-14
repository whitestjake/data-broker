
import { loadNavbar } from '/static/js/nav.js';

export function initRegisterForm(container) {
    if (!container) return;

    loadNavbar();

    // Salary input auto-formatting (currency)
    container.addEventListener('input', (e) => {
        if (e.target.id !== 'register-salary-input') return;

        let value = e.target.value;
        value = value.replace(/[^0-9.]/g, '');
        const parts = value.split('.');
        let integerPart = parts[0];
        let decimalPart = parts.length > 1 ? '.' + parts[1].substring(0, 2) : '';
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        e.target.value = '$' + integerPart + decimalPart;
    });

    container.addEventListener('blur', (e) => {
        if (e.target.id === 'register-salary-input' && (e.target.value === '$' || e.target.value === '')) {
            e.target.value = '';
        }
    }, true); // useCapture=true for blur

    // Event delegation for register button
    container.addEventListener('click', (e) => {
        if (e.target.id !== 'register-button') return;

        // Use the main container or document to find inputs
        const formContainer = container;

        const firstNameInput = document.querySelector("#register-first-name-input");
        const lastNameInput = document.querySelector("#register-last-name-input");
        const ageInput = document.querySelector("#register-age-input");
        const salaryInput = document.querySelector("#register-salary-input");
        const userInput = document.querySelector("#register-user-input");
        const passwordInput = document.querySelector("#register-password-input");
        const confirmInput = document.querySelector("#register-confirm-password-input");

        if (!firstNameInput || !lastNameInput || !ageInput || !salaryInput || !userInput || !passwordInput || !confirmInput) {
            console.warn("Register inputs not found");
            return;
        }

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const age = parseInt(ageInput.value, 10);
        const salary = parseFloat(salaryInput.value.replace(/[$,]/g, ''));
        const user = userInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        // Validation

        if (password !== confirm) {
            document.querySelector('#password-error')?.removeAttribute('hidden');
            return;
        }

        if (isNaN(age) || age < 0) return;
        if (isNaN(salary) || salary < 0) return;

        // Clear inputs
        firstNameInput.value = '';
        lastNameInput.value = '';
        ageInput.value = '';
        salaryInput.value = '';
        userInput.value = '';
        passwordInput.value = '';
        confirmInput.value = '';

        // Send registration request
        fetch("http://localhost:5050/register", {
            headers: { 'Content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ firstName, lastName, age, salary, user, password, confirm })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.querySelector("#user-use-error")?.removeAttribute('hidden');
                console.log('Error: ' + data.error);
            } else {
                document.querySelector('#register-success')?.removeAttribute('hidden');
                console.log("Registration Successful");

                // store logged in user 
                sessionStorage.setItem('loggedInUser', JSON.stringify({
                    username: data.data.username,
                    firstName: data.data.firstName
                }));

                setTimeout(() => { window.location.href = "/home"; }, 500);
            }
        })
        .catch(err => console.error("Registration request failed:", err));
    });
}

// Auto-init if register.html is loaded directly
document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('register-button');
    if (registerButton) {
        const container = document.getElementById('register-container') || document.body;
        initRegisterForm(container);
    }
});





