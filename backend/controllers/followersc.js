import { followUser, unfollowUser, getUserFollowers, getUserFollowing } from '../models/follower.js';

// Handler to follow a user
export const followUserHandler = async (req, res) => {
    const userId = req.user.id;
    // const userId = parseInt(req.body.userId, 10);
    const followerId = parseInt(req.params.id, 10);

    if (userId === followerId) {
        return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    try {
        await followUser(userId, followerId);
        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handler to unfollow a user
export const unfollowUserHandler = async (req, res) => {
    const userId = req.user.id;
    // const userId = parseInt(req.body.userId, 10);
    const followerId = parseInt(req.params.id, 10);

    try {
        await unfollowUser(userId, followerId);
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handler to get followers of a user
export const getFollowersHandler = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const followers = await getUserFollowers(userId);
        res.status(200).json(followers);
    } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handler to get users followed by a user
export const getFollowingHandler = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const following = await getUserFollowing(userId);
        res.status(200).json(following);
    } catch (error) {
        console.error('Error fetching following:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};