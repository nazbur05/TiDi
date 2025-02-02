document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('selectedUserId');
    console.log('Retrieved userId from localStorage:', userId);

    if (!userId) {
        alert('No user selected. Redirecting to home page.');
        window.location.href = 'main.html'; // Redirect if no userId is found
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const { user, posts } = await response.json();
        displayUserProfile(user, posts);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('Failed to load user profile.');
    }
});

function displayUserProfile(user, posts) {
    const profileName = document.getElementById('profileName');
    const profileUsername = document.getElementById('profileUsername');
    const userPostsContainer = document.getElementById('userPostsContainer');

    profileName.textContent = user.name;
    profileUsername.textContent = `@${user.usrname}`;

    userPostsContainer.innerHTML = '';
    if (posts.length === 0) {
        userPostsContainer.innerHTML = '<p>No posts available</p>';
    } else {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <p>${post.text}</p>
                ${post.image_url ? `<img src="${post.image_url}" alt="Post Image" />` : ''}
                <p><small>Posted on ${new Date(post.created_at).toLocaleString()}</small></p>
            `;
            userPostsContainer.appendChild(postElement);
        });
    }
}
