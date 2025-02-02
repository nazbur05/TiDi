import db from '../config/database.js';

// Comment model functions
export const createComment = async (postId, userId, text) => {
    const query = 'INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [postId, userId, text]);
    return result.insertId;
};

export const getCommentsByPost = async (postId) => {
    const query = 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC';
    const [rows] = await db.query(query, [postId]);
    return rows;
};

export const deleteComment = async (commentId) => {
    const query = 'DELETE FROM comments WHERE id = ?';
    const [result] = await db.query(query, [commentId]);
    return result.affectedRows;
};

// Like model functions
export const addLike = async (postId, userId) => {
    const query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
    const [result] = await db.query(query, [postId, userId]);
    return result.insertId;
};

export const removeLike = async (postId, userId) => {
    const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
    const [result] = await db.query(query, [postId, userId]);
    return result.affectedRows;
};

export const getLikesByPost = async (postId) => {
    const query = 'SELECT * FROM likes WHERE post_id = ?';
    const [rows] = await db.query(query, [postId]);
    return rows;
};