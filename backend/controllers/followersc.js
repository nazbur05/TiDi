import { followUser, unfollowUser, getUserFollowers, getUserFollowing } from '../models/follower.js';

export const followUserHandler = async (req, res) => {
    const userId = req.user.id;
    const followerId = parseInt(req.params.id, 10);

    if (userId === followerId) {
        return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    try {
        await followUser(userId, followerId);
        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const unfollowUserHandler = async (req, res) => {
    const userId = req.user.id;
    const followerId = parseInt(req.params.id, 10);

    try {
        await unfollowUser(userId, followerId);
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFollowersHandler = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const followers = await getUserFollowers(userId);
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFollowingHandler = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    try {
        const following = await getUserFollowing(userId);
        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// import { followUser, unfollowUser, getUserFollowers, getUserFollowing } from '../models/follower.js';

// export const followUserHandler = async (req, res) => {
//     const userId = parseInt(req.body.userId, 10);
//     const followerId = parseInt(req.params.id, 10);

//     // Ensure the user is not trying to follow themselves
//     if (userId === followerId) {
//         return res.status(400).json({ error: 'You cannot follow yourself' });
//     }

//     try {
//         await followUser(userId, followerId);
//         res.status(200).json({ message: 'User followed successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const unfollowUserHandler = async (req, res) => {
//     const userId = parseInt(req.body.userId, 10);
//     const followerId = parseInt(req.params.id, 10);

//     try {
//         await unfollowUser(userId, followerId);
//         res.status(200).json({ message: 'User unfollowed successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const getFollowersHandler = async (req, res) => {
//     const userId = parseInt(req.params.id, 10);

//     try {
//         const followers = await getUserFollowers(userId);
//         res.status(200).json(followers);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const getFollowingHandler = async (req, res) => {
//     const userId = parseInt(req.params.id, 10);

//     try {
//         const following = await getUserFollowing(userId);
//         res.status(200).json(following);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };