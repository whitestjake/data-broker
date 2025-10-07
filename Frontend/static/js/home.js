
import { loadNavbar } from '/static/js/nav.js';


document.addEventListener("DOMContentLoaded", async () => {

    loadNavbar();

    const welcomeDiv = document.getElementById('home-welcome');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        welcomeDiv.textContent = `Welcome ${capitalize(loggedInUser.firstName)}, this is your data home page`;
    } else {
        welcomeDiv.textContent = "Welcome, please log in!";
    }

    const tableBody = document.getElementById('data-table-body');
    let allUsers = [];

    // Fetch all users from backend
    async function fetchUsers() {
        try {
            const res = await fetch('http://localhost:5050/accounts'); // Make sure you have this route
            const data = await res.json();
            allUsers = data.data; 
            console.log(allUsers);
            renderTable(allUsers);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    }

    // Capitalize first letter helper
    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Format salary as currency
    function formatCurrency(num) {
        if (isNaN(num)) return '';
        return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Render the table based on array of users
    function renderTable(users) {
        tableBody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${capitalize(user.username)}</td>
                <td>${capitalize(user.first_name)}</td>
                <td>${capitalize(user.last_name)}</td>
                <td>${user.age}</td>
                <td>${formatCurrency(user.salary)}</td>
                <td>${user.registration_date ? new Date(user.registration_date).toISOString().split('T')[0]: ''}</td>
                <td>${user.last_login_date ? new Date(user.last_login_date).toISOString().split('T')[0] : 'Never'}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Filter function
    function filterTable() {
        const usernameInput = document.getElementById('search-username').value.toLowerCase();
        const firstInput = document.getElementById('search-first').value.toLowerCase();
        const lastInput = document.getElementById('search-last').value.toLowerCase();
        const ageInput = document.getElementById('search-age').value;
        const salaryInput = document.getElementById('search-salary').value;
        const regDateInput = document.getElementById('search-reg-date').value;
        const lastLoginInput = document.getElementById('search-last-login').value.toLowerCase();

        const filtered = allUsers.filter(user => {
            // Username filter
            if (usernameInput && !user.username.toLowerCase().includes(usernameInput)) return false;

            // First name filter
            if (firstInput && !user.first_name.toLowerCase().includes(firstInput)) return false;

            // Last name filter
            if (lastInput && !user.last_name.toLowerCase().includes(lastInput)) return false;

            // Age filter
            if (ageInput) {
                const [min, max] = ageInput.split('-').map(a => parseInt(a.trim(), 10));
                if (!isNaN(min) && user.age < min) return false;
                if (!isNaN(max) && user.age > max) return false;
            }

            // Salary filter
            if (salaryInput) {
                const [min, max] = salaryInput.split('-').map(a => parseFloat(a.trim()));
                if (!isNaN(min) && user.salary < min) return false;
                if (!isNaN(max) && user.salary > max) return false;
            }

            // Registration date filter
            if (regDateInput) {
                const regDate = user.registration_date.split('T')[0];
                if (!regDate.includes(regDateInput)) return false;
            }

            // Last login filter
            if (lastLoginInput) {
                if (lastLoginInput === 'never' && user.last_login !== null) return false;
                if (lastLoginInput !== 'never' && user.last_login) {
                    const lastLoginDate = new Date(user.last_login).toISOString().split('T')[0];
                    if (!lastLoginDate.includes(lastLoginInput)) return false;
                }
            }

            return true;
        });

        renderTable(filtered);
    }

    // Add event listeners for search inputs
    ['search-username','search-first','search-last','search-age','search-salary','search-reg-date','search-last-login']
        .forEach(id => {
            const input = document.getElementById(id);
            if (input) input.addEventListener('input', filterTable);
        });

    await fetchUsers();
});



