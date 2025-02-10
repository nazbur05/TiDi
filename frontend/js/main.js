document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (!token) {
        console.error('No token found');
        return;
    }

    await loadAllPosts(token);

    setInterval(() => {
        loadAllPosts(token);
    }, 10000);
});

async function loadAllPosts(token) {
    try {
        const response = await fetch('http://localhost:3000/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const posts = await response.json();
        console.log('All Posts:', posts);
        const allContainer = document.getElementById('allContainer');
        displayPosts(posts, allContainer);
    } catch (error) {
        console.error('Error fetching all posts:', error);
    }
}

function displayPosts(posts, container) {
    console.log('Display Posts:', posts); 
    container.innerHTML = '';
    if (Array.isArray(posts)) {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.id = `post-${post.id}`;
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
                        <div class="comment" id="comment-${comment.id}">
                            <strong><a href="#" class="usrname" data-user-id="${comment.user_id}">${comment.usrname}</a></strong>: ${comment.text}
                        </div>
                    `).join('') : ''}
                </div>
            `;
            container.appendChild(postElement);

            postElement.addEventListener('contextmenu', async (event) => {
                event.preventDefault();
                const user = await getUserInfo(token); // Fetch user info to check if admin or post creator
                if (user.is_admin || user.id === post.user_id) { // Check if user is admin or post creator
                    if (confirm('Do you want to delete this post?')) {
                        deletePost(post.id);
                    }
                } else {
                    alert('You do not have permission to delete this post.');
                }
            });

            Array.from(postElement.querySelectorAll('.comment')).forEach(commentElement => {
                commentElement.addEventListener('contextmenu', async (event) => {
                    event.preventDefault();
                    const user = await getUserInfo(token); // Fetch user info to check if admin or comment creator
                    const commentId = commentElement.id.split('-')[1];
                    if (user.is_admin || user.id === commentElement.getAttribute('data-user-id')) { // Check if user is admin or comment creator
                        if (confirm('Do you want to delete this comment?')) {
                            deleteComment(commentId);
                        }
                    } else {
                        alert('You do not have permission to delete this comment.');
                    }
                });
            });
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
            commentElement.id = `comment-${result.comment.id}`;
            commentElement.innerHTML = `<strong><a href="#" class="usrname" data-user-id="${result.user_id}">${result.usrname}</a></strong>: ${commentText}`;
            commentsContainer.appendChild(commentElement);

            document.getElementById(`commentText-${postId}`).value = '';

            addUsernameClickEventListeners();

            commentElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                if (confirm('Do you want to delete this comment?')) {
                    deleteComment(result.comment.id);
                }
            });
        }
    } catch (error) {
        console.error('Error commenting on post:', error);
    }
}

async function deletePost(postId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Post deleted successfully');
            document.getElementById(`post-${postId}`).remove();
        } else {
            throw new Error('Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
    }
}

async function deleteComment(commentId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/posts/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Comment deleted successfully');
            document.getElementById(`comment-${commentId}`).remove();
        } else {
            throw new Error('Failed to delete comment');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
    }
}