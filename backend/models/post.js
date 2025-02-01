import db from '../config/database.js';

export const createPost = async (userId, text, imageUrl) => {
    const query = 'INSERT INTO posts (user_id, text, image_url) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [userId, text, imageUrl]);
    return result.insertId;
};

export const getPostsByUser = async (userId) => {
    const query = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await db.execute(query, [userId]);
    return rows;
};

export const updatePost = async (postId, text, imageUrl) => {
    const query = 'UPDATE posts SET text = ?, image_url = ? WHERE id = ?';
    await db.execute(query, [text, imageUrl, postId]);
};

export const deletePost = async (postId) => {
    const query = 'DELETE FROM posts WHERE id = ?';
    await db.execute(query, [postId]);
};