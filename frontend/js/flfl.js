document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    console.log('Retrieved token:', token);
    console.log('Retrieved userId:', userId);

    const followersList = document.getElementById('followersList');
    const followingList = document.getElementById('followingList');

    function fetchFollowers() {
        fetch(`http://localhost:3000/followers/${userId}/followers`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Followers data:', data);
            if (Array.isArray(data)) {
                followersList.innerHTML = '';
                data.forEach(follower => {
                    const li = document.createElement('li');
                    li.textContent = `${follower.usrname} (${follower.email})`;
                    li.dataset.userId = follower.id;
                    li.addEventListener('contextmenu', handleRightClick);
                    followersList.appendChild(li);
                });
            } else {
                console.error('Expected an array, but got:', data);
            }
        })
        .catch(error => console.error('Error fetching followers:', error));
    }

    function fetchFollowing() {
        fetch(`http://localhost:3000/followers/${userId}/following`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Following data:', data);
            if (Array.isArray(data)) {
                followingList.innerHTML = '';
                data.forEach(following => {
                    const li = document.createElement('li');
                    li.textContent = `${following.usrname} (${following.email})`;
                    li.dataset.userId = following.id;
                    li.addEventListener('contextmenu', handleRightClick);
                    followingList.appendChild(li);
                });
            } else {
                console.error('Expected an array, but got:', data);
            }
        })
        .catch(error => console.error('Error fetching following:', error));
    }

    function handleRightClick(event) {
        event.preventDefault();
        const userIdToUnfollow = event.target.dataset.userId;
        const action = confirm('Do you want to unfollow this user?');
        if (action) {
            unfollowUser(userIdToUnfollow);
        }
    }

    function unfollowUser(userIdToUnfollow) {
        fetch(`http://localhost:3000/followers/unfollow/${userIdToUnfollow}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert('User unfollowed successfully!');
                fetchFollowing();
            }
        })
        .catch(error => console.error('Error unfollowing user:', error));
    }

    fetchFollowers();
    fetchFollowing();
});