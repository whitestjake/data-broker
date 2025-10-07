


// home.js
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch current user info to display welcome
    const username = sessionStorage.getItem('username') || 'User';
    const firstName = sessionStorage.getItem('firstName') || username;
    document.getElementById('home-welcome').textContent = `Welcome ${capitalize(firstName)}, this is your data home page`;

    // Fetch all account data
    let users = await fetch("http://localhost:5050/accounts") // Replace with backend fetch
        .then(res => fetch("http://localhost:5050/accounts")  // Example endpoint
            .then(r => r.json()))
        .then(data => data.data || [])
        .catch(err => { console.error(err); return []; });

    // Format the data
    users.forEach(u => {
        u.username = capitalize(u.username);
        u.first_name = capitalize(u.first_name);
        u.last_name = capitalize(u.last_name);
        if (u.salary !== undefined && u.salary !== null) {
            u.salary = formatCurrency(u.salary);
        }
        if (u.date_created) u.date_created = new Date(u.date_created);
        if (u.last_login) u.last_login = new Date(u.last_login);
    });

    const tbody = document.getElementById('data-table-body');

    // Utility functions
    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Render table
    function renderTable(filteredUsers) {
        tbody.innerHTML = '';
        filteredUsers.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.first_name}</td>
                <td>${u.last_name}</td>
                <td>${u.age}</td>
                <td>${u.salary}</td>
                <td>${u.date_created ? u.date_created.toLocaleDateString() : ''}</td>
                <td>${u.last_login ? u.last_login.toLocaleDateString() : 'Never'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderTable(users);

    // Show/hide input for "after-user" and "same-day-user"
    const regFilterDropdown = document.getElementById('reg-date-filter-type');
    const regFilterUserInput = document.getElementById('reg-date-filter-user');
    regFilterDropdown.addEventListener('change', () => {
        if (regFilterDropdown.value === 'after-user' || regFilterDropdown.value === 'same-day-user') {
            regFilterUserInput.style.display = 'inline-block';
        } else {
            regFilterUserInput.style.display = 'none';
            regFilterUserInput.value = '';
        }
        applyFilters();
    });

    // Individual search inputs
    const filters = [
        { id: 'search-username', key: 'username' },
        { id: 'search-first', key: 'first_name' },
        { id: 'search-last', key: 'last_name' },
        { id: 'search-age', key: 'age' },
        { id: 'search-salary', key: 'salary' },
        { id: 'search-last-login', key: 'last_login' }
    ];

    filters.forEach(f => {
        const el = document.getElementById(f.id);
        el.addEventListener('input', applyFilters);
    });

    regFilterUserInput.addEventListener('input', applyFilters);

    function applyFilters() {
        let filtered = [...users];

        // Text and range filters
        filters.forEach(f => {
            const val = document.getElementById(f.id).value.trim();
            if (!val) return;
            if (f.key === 'age' || f.key === 'salary') {
                const parts = val.split('-').map(v => parseFloat(v.trim()));
                if (parts.length === 2) {
                    filtered = filtered.filter(u => {
                        const num = f.key === 'age' ? u.age : parseFloat(u.salary.replace(/[$,]/g, ''));
                        return num >= parts[0] && num <= parts[1];
                    });
                }
            } else if (f.key === 'last_login') {
                if (val.toLowerCase() === 'never') {
                    filtered = filtered.filter(u => !u.last_login);
                } else {
                    const date = new Date(val);
                    filtered = filtered.filter(u => u.last_login && u.last_login.toDateString() === date.toDateString());
                }
            } else {
                filtered = filtered.filter(u => u[f.key].toLowerCase().includes(val.toLowerCase()));
            }
        });

        // Registration date filter
        const regFilterType = regFilterDropdown.value;
        const regFilterUser = regFilterUserInput.value.trim().toLowerCase();

        if ((regFilterType === 'after-user' || regFilterType === 'same-day-user') && regFilterUser) {
            const targetUser = users.find(u => u.username.toLowerCase() === regFilterUser);
            if (targetUser && targetUser.date_created) {
                if (regFilterType === 'after-user') {
                    filtered = filtered.filter(u => u.date_created > targetUser.date_created);
                } else if (regFilterType === 'same-day-user') {
                    filtered = filtered.filter(u => u.date_created.toDateString() === targetUser.date_created.toDateString());
                }
            }
        } else if (regFilterType === 'today') {
            const today = new Date();
            filtered = filtered.filter(u => u.date_created && u.date_created.toDateString() === today.toDateString());
        }

        renderTable(filtered);
    }
});


