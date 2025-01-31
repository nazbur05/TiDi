document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/users/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you're using JWT tokens
        }
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById('name').value = user.name;
        document.getElementById('usrname').value = user.usrname;
        document.getElementById('email').value = user.email;
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });

    document.getElementById('updateUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            usrname: document.getElementById('usrname').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            currentPassword: document.getElementById('currentPassword').value
        };

        fetch(`http://localhost:3000/users/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you're using JWT tokens
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert('User updated successfully!');
            }
        })
        .catch((error) => {
            alert('Error:', error);
        });
    });
});