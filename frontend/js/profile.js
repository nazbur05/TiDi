document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    await loadProfile(token, userId);
    await loadUserPosts(token, userId);
});

async function loadProfile(token, userId) {
    try {
        const response = await fetch(`http://localhost:3000/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const profile = await response.json();
        console.log('Profile:', profile);
        const profileContainer = document.getElementById('profileContainer');
        profileContainer.innerHTML = `
            <p><strong>Username:</strong> ${profile.usrname}</p>
        `;
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

async function loadUserPosts(token, userId) {
    try {
        const response = await fetch(`http://localhost:3000/posts/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const posts = await response.json();
        console.log('User Posts:', posts);
        const postsContainer = document.getElementById('postsContainer');
        displayPosts(posts, postsContainer);
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
}

function displayPosts(posts, container) {
    console.log('Display Posts:', posts); 
    container.innerHTML = '';
    if (Array.isArray(posts)) {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>Posted by: <a href="#" class="usrname" data-user-id="${post.user_id}">${post.usrname}</a></h3>
                <p>${post.text}</p>
                ${post.image_url ? `<img src="${post.image_url}" alt="Post Image" />` : ''}
                <button onclick="likePost(${post.id})">Like</button>
                <span id="likeCount-${post.id}">${post.like_count}</span>
                <div class="comment-box">
                    <input type="text" id="commentText-${post.id}" placeholder="Write a comment..."/>
                    <button onclick="commentPost(${post.id})">Comment</button>
                </div>
                <div id="comments-${post.id}">
                    ${Array.isArray(post.comments) ? post.comments.map(comment => `
                        <div class="comment">
                            <strong><a href="#" class="usrname" data-user-id="${comment.user_id}">${comment.usrname}</a></strong>: ${comment.text}
                        </div>
                    `).join('') : '<p>No comments available</p>'}
                </div>
            `;
            container.appendChild(postElement);
        });

        addUsernameClickEventListeners();
    } else {
        console.error('Posts is not an array:', posts);
    }
}

function addUsernameClickEventListeners() {
    const usernames = document.querySelectorAll('.usrname');
    usernames.forEach(usrname => {
        usrname.addEventListener('click', (event) => {
            event.preventDefault();
            const userId = event.target.getAttribute('data-user-id');
            console.log(`Navigating to user profile with userId: ${userId}`);
            localStorage.setItem('selectedUserId', userId);
            window.location.href = `userprofile.html`;
        });
    });
}

async function likePost(postId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/posts/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId })
        });

        const result = await response.json();
        if (result.success) {
            const likeCount = document.getElementById(`likeCount-${postId}`);
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        }
    } catch (error) {
        console.error('Error liking post:', error);
    }
}

async function commentPost(postId) {
    const token = localStorage.getItem('token');

    const commentText = document.getElementById(`commentText-${postId}`).value;
    if (!commentText) {
        alert('Comment cannot be empty.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/posts/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId, text: commentText })
        });

        const result = await response.json();
        if (result.success) {
            const commentsContainer = document.getElementById(`comments-${postId}`);
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `<strong><a href="#" class="usrname" data-user-id="${result.user_id}">${result.usrname}</a></strong>: ${commentText}`;
            commentsContainer.appendChild(commentElement);

            document.getElementById(`commentText-${postId}`).value = '';

            addUsernameClickEventListeners();
        }
    } catch (error) {
        console.error('Error commenting on post:', error);
    }
}