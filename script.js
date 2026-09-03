// Toggle Password
document.getElementById('togglePass').addEventListener('click', function() {
    const input = document.getElementById('password');
    const icon = this.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const btn = document.getElementById('loginBtn');
    const error = document.getElementById('errorMsg');

    error.classList.remove('show');

    if (!username || !password) {
        error.classList.add('show');
        return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;

        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('user', username);

        window.location.href = 'dashboard.html';
    }, 1500);
});