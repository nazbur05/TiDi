document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debugging log

    if (!token) {
        console.error('No token found');
        return;
    }

    await loadFeedPosts(token);
    await loadAllPosts(token);

    setInterval(() => {
        loadFeedPosts(token);
        loadAllPosts(token);
    }, 10000); // 10000 milliseconds = 10 seconds
});

async function loadFeedPosts(token) {
    try {
        const response = await fetch('http://localhost:3000/posts/followed', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const posts = await response.json();
        console.log('Feed posts:', posts); 
        if (!Array.isArray(posts)) {
            throw new Error('Expected an array of posts');
        }
        const feedContainer = document.getElementById('feedContainer');
        displayPosts(posts, feedContainer);
    } catch (error) {
        console.error('Error fetching feed posts:', error);
    }
}

async function loadAllPosts(token) {
    try {
        const response = await fetch('http://localhost:3000/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const posts = await response.json();
        console.log('All posts:', posts);
        if (!Array.isArray(posts)) {
            throw new Error('Expected an array of posts');
        }
        const allContainer = document.getElementById('allContainer');
        displayPosts(posts, allContainer);
    } catch (error) {
        console.error('Error fetching all posts:', error);
    }
}

function displayPosts(posts, container) {
    container.innerHTML = '';
    if (posts.length === 0) {
        container.innerHTML = '<p>No posts available</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>
                Posted by: 
                <a href="#" class="usrname" data-user-id="${post.user_id}">${post.usrname}</a>
            </h3>
            <p>${post.text}</p>
            ${post.image_url ? `<img src="${post.image_url}" alt="Post Image" />` : ''}
        `;
        container.appendChild(postElement);
    });

    // Not working for some reason
    container.addEventListener('click', function (event) {
        if (event.target.classList.contains('usrname')) {
            event.preventDefault();
            const userId = event.target.getAttribute('data-user-id');
            console.log(`Navigating to user profile with userId: ${userId}`);
            localStorage.setItem('selectedUserId', userId);
            setTimeout(() => {
                window.location.href = 'userprofile.html';
            }, 100);
        }
    });
}


function showSection(section) {
    document.querySelectorAll('.section').forEach(function(sec) {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}Section`).classList.add('active');
}