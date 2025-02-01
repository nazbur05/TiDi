import db from '../config/database.js';

export const followUser = async (userId, followerId) => {
    const query = 'INSERT INTO followers (user_id, follower_id) VALUES (?, ?)';
    await db.query(query, [userId, followerId]);
};

export const unfollowUser = async (userId, followerId) => {
    const query = 'DELETE FROM followers WHERE user_id = ? AND follower_id = ?';
    await db.query(query, [userId, followerId]);
};

export const getUserFollowers = async (userId) => {
    const query = 'SELECT * FROM users WHERE id IN (SELECT follower_id FROM followers WHERE user_id = ?)';
    const [rows] = await db.query(query, [userId]);
    return rows;
};

export const getUserFollowing = async (userId) => {
    const query = 'SELECT * FROM users WHERE id IN (SELECT user_id FROM followers WHERE follower_id = ?)';
    const [rows] = await db.query(query, [userId]);
    return rows;
};