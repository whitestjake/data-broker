
import { loadNavbar } from '/static/js/nav.js';

document.addEventListener("DOMContentLoaded", async () => {

    loadNavbar();

    const welcomeDiv = document.getElementById('home-welcome');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (loggedInUser) {
        welcomeDiv.textContent = `Welcome ${capitalize(loggedInUser.firstName)}, this is your data page`;
    } else {
        welcomeDiv.textContent = "Welcome, please log in!";
    }

    const tableBody = document.getElementById('data-table-body');
    let allUsers = [];

    // Fetch users based on filters
    async function fetchFilteredUsers(filters) {
        try {
            const query = new URLSearchParams(filters).toString();
            const res = await fetch(`http://localhost:5050/search?${query}`);
            const data = await res.json();

            if (data.error) {
                console.warn(data.error);
                renderTable([]);
                return;
            }

            allUsers = data.data;
            renderTable(allUsers);
        } catch (err) {
            console.error("Search error:", err);
        }
    }

    // Render table
    function renderTable(users) {
        tableBody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');

            // registration date
            let regDateStr = '';
            if (user.registration_date) {
                const regDate = new Date(user.registration_date);
                if (!isNaN(regDate)) regDateStr = regDate.toLocaleDateString();
            }

            // last login
            let lastLoginStr = 'Never';
            if (user.last_login_date) {
                const loginDate = new Date(user.last_login_date);
                if (!isNaN(loginDate)) lastLoginStr = loginDate.toISOString().split('T')[0];
            }

            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${capitalize(user.username)}</td>
                <td>${capitalize(user.first_name)}</td>
                <td>${capitalize(user.last_name)}</td>
                <td>${user.age}</td>
                <td>${formatCurrency(user.salary)}</td>
                <td>${regDateStr}</td>
                <td>${lastLoginStr}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Capitalize first letter
    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Format salary
    function formatCurrency(num) {
        if (isNaN(num)) return '';
        return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Filter table
    function filterTable() {
        const filters = {
            username: document.getElementById('search-username')?.value || '',
            first_name: document.getElementById('search-first')?.value || '',
            last_name: document.getElementById('search-last')?.value || '',
            age: document.getElementById('search-age')?.value || '',
            salary: document.getElementById('search-salary')?.value || '',
            lastLogin: document.getElementById('search-last-login')?.value || '',
            regFilterType: document.getElementById('reg-date-filter-type')?.value || '',
            regFilterUser: document.getElementById('reg-date-filter-user')?.value || ''
        };

        fetchFilteredUsers(filters);
    }

    // --- Attach Enter key listeners ---
    ['search-username','search-first','search-last','search-age','search-salary','search-last-login']
        .forEach(id => {
            const input = document.getElementById(id);
            if (input) input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') filterTable();
            });
        });

    const regUserInput = document.getElementById('reg-date-filter-user');
    if (regUserInput) {
        regUserInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') filterTable();
        });
    }

    // --- Handle registration filter dropdown ---
    const regFilterSelect = document.getElementById('reg-date-filter-type');
    if (regFilterSelect) {
        regFilterSelect.addEventListener('change', () => {
            const inputBox = document.getElementById('reg-date-filter-user');

            // Show input only for user-based filters
            if (regFilterSelect.value.includes('user')) {
                inputBox.style.display = 'block';
                inputBox.value = ''; // reset previous value
            } else {
                inputBox.style.display = 'none';
                inputBox.value = '';
            }

            // Reset all other search inputs when changing filter
            ['search-username','search-first','search-last','search-age','search-salary','search-last-login']
                .forEach(id => {
                    const input = document.getElementById(id);
                    if (input) input.value = '';
                });

            // Immediately fetch with new filter type
            filterTable();
        });
    }

    // Initial fetch: show all users
    await fetchFilteredUsers({});
});








