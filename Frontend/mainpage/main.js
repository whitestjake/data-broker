function showTab(tabName) {
    // Hide all cards
    document.getElementById('registerCard').classList.remove('active');
    document.getElementById('loginCard').classList.remove('active');
    
    // Show selected card
    if (tabName === 'register') {
        document.getElementById('registerCard').classList.add('active');
    } else {
        document.getElementById('loginCard').classList.add('active');
    }
}
