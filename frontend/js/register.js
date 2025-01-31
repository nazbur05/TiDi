document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('name').value,
        usrname: document.getElementById('usrname').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    fetch('http://localhost:3000/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Registration successful!');
    })
    .catch((error) => {
        alert('Error:', error);
    });
});