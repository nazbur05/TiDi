document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = data.redirectUrl;
        } else {
            alert(`Error`);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});