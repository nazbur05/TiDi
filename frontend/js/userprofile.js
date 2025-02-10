document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('selectedUserId');
    const token = localStorage.getItem('token');
    const currentUser = await getCurrentUserInfo(token);
    console.log('Retrieved userId from localStorage:', userId);

    if (!userId) {
        alert('No user selected. Redirecting to home page.');
        window.location.href = 'main.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/users/profile/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }

        const { user, posts } = await response.json();
        displayUserProfile(user, posts, currentUser, token);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('Failed to load user profile.');
    }
});

function displayUserProfile(user, posts, currentUser, token) {
    const profileName = document.getElementById('profileName');
    const profileUsername = document.getElementById('profileUsername');
    const userPostsContainer = document.getElementById('userPostsContainer');

    profileName.textContent = user.name;
    profileUsername.textContent = `@${user.usrname}`;

    const followButton = document.createElement('button');
    followButton.id = 'followButton';
    followButton.textContent = user.is_followed ? 'Unfollow' : 'Follow';
    followButton.addEventListener('click', async () => {
        if (user.is_followed) {
            await unfollowUser(user.id, token);
        } else {
            await followUser(user.id, token);
        }
        user.is_followed = !user.is_followed;
        followButton.textContent = user.is_followed ? 'Unfollow' : 'Follow';
    });
    profileUsername.appendChild(followButton);

    if (currentUser.is_admin) {
        const deleteButton = document.createElement('button');
        deleteButton.id = 'deleteButton';
        deleteButton.textContent = 'Delete User';
        deleteButton.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this user?')) {
                await deleteUser(user.id, token);
                window.location.href = 'main.html';
            }
        });
        profileUsername.appendChild(deleteButton);
    }

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
                <button id="likeButton-${post.id}" onclick="toggleLikePost(${post.id}, '${token}')">${post.is_liked ? 'Unlike' : 'Like'}</button>
                <span id="likeCount-${post.id}">${post.like_count}</span>
                <div class="comment-box">
                    <input type="text" id="commentText-${post.id}" placeholder="Write a comment..."/>
                    <button onclick="commentPost(${post.id}, '${token}')">Comment</button>
                </div>
                <div id="comments-${post.id}">
                    ${Array.isArray(post.comments) ? post.comments.map(comment => `
                        <div class="comment" id="comment-${comment.id}" data-user-id="${comment.user_id}">
                            <strong>${comment.usrname}</strong>: ${comment.text}
                        </div>
                    `).join('') : ''}
                </div>
            `;
            userPostsContainer.appendChild(postElement);
        });
    }
}

async function getCurrentUserInfo(token) {
    try {
        const response = await fetch('http://localhost:3000/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return await response.json();
    } catch (error) {
        console.error('Error fetching current user info:', error);
        return null;
    }
}

async function followUser(userId, token) {
    try {
        const response = await fetch(`http://localhost:3000/followers/follow/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to follow user');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error following user:', error);
    }
}

async function unfollowUser(userId, token) {
    try {
        const response = await fetch(`http://localhost:3000/followers/unfollow/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to unfollow user');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error unfollowing user:', error);
    }
}

async function deleteUser(userId, token) {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function toggleLikePost(postId, token) {
    const likeButton = document.getElementById(`likeButton-${postId}`);
    const likeCount = document.getElementById(`likeCount-${postId}`);

    if (likeButton.textContent === 'Like') {
        await likePost(postId, token);
        likeButton.textContent = 'Unlike';
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    } else {
        await unlikePost(postId, token);
        likeButton.textContent = 'Like';
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
    }
}

async function likePost(postId, token) {
    try {
        const response = await fetch(`http://localhost:3000/posts/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId })
        });

        if (!response.ok) {
            throw new Error('Failed to like post');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error liking post:', error);
    }
}

async function unlikePost(postId, token) {
    try {
        const response = await fetch(`http://localhost:3000/posts/likes/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to unlike post');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error unliking post:', error);
    }
}

async function commentPost(postId, token) {
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

        if (!response.ok) {
            throw new Error('Failed to comment on post');
        }

        const result = await response.json();
        if (result.success) {
            const commentsContainer = document.getElementById(`comments-${postId}`);
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.id = `comment-${result.comment.id}`;
            commentElement.setAttribute('data-user-id', result.comment.user_id);
            commentElement.innerHTML = `<strong>${result.usrname}</strong>: ${commentText}`;
            commentsContainer.appendChild(commentElement);
            document.getElementById(`commentText-${postId}`).value = '';
        }
    } catch (error) {
        console.error('Error commenting on post:', error);
    }
}