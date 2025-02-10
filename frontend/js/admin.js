document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No token found. Redirecting to login page.');
        window.location.href = 'login.html';
        return;
    }

    await loadUsers(token);
    await loadPosts(token);
});

async function loadUsers(token) {
    try {
        const response = await fetch('http://localhost:3000/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const users = await response.json();
        const usersContainer = document.getElementById('usersContainer');
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user';
            userElement.innerHTML = `
                <p><strong>Username:</strong> ${user.usrname}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <button onclick="deleteUser(${user.id})">Delete User</button>
            `;
            usersContainer.appendChild(userElement);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function loadPosts(token) {
    try {
        const response = await fetch('http://localhost:3000/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const posts = await response.json();
        const postsContainer = document.getElementById('postsContainer');
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <p>${post.text}</p>
                ${post.image_url ? `<img src="${post.image_url}" alt="Post Image" />` : ''}
                <button onclick="deletePost(${post.id})">Delete Post</button>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function deleteUser(userId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('User deleted successfully');
            location.reload();
        } else {
            alert('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function deletePost(postId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Post deleted successfully');
            location.reload();
        } else {
            alert('Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}