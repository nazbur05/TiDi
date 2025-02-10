import db from '../config/database.js';

// Create a new post
export const createPost = async (userId, text, imageUrl) => {
    const query = 'INSERT INTO posts (user_id, text, image_url) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [userId, text, imageUrl]);
    return result.insertId;
};

// Get posts by a user
export const getPostsByUser = async (userId) => {
    const query = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await db.execute(query, [userId]);
    return rows;
};

// Get all posts
export const getAllPosts = async () => {
    const query = `
        SELECT posts.id, posts.text, posts.image_url, posts.created_at, users.usrname
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
};

// Get posts by following
export const getPostsByFollowing = async (userId) => {
    const query = `
        SELECT posts.id, posts.text, posts.image_url, posts.created_at, users.usrname
        FROM posts
        JOIN users ON posts.user_id = users.id
        JOIN followers ON followers.follower_id = ?
        WHERE followers.user_id = posts.user_id
        ORDER BY posts.created_at DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
};

// Update a post
export const updatePost = async (postId, text, imageUrl) => {
    const query = 'UPDATE posts SET text = ?, image_url = ? WHERE id = ?';
    await db.execute(query, [text, imageUrl, postId]);
};

// Delete a post
// export const deletePost = async (postId) => {
//     const query = 'DELETE FROM posts WHERE id = ?';
//     await db.execute(query, [postId]);
// };

export const deletePost = async (postId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('DELETE FROM likes WHERE post_id = ?', [postId]);

        await connection.query('DELETE FROM comments WHERE post_id = ?', [postId]);

        await connection.query('DELETE FROM posts WHERE id = ?', [postId]);

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const deleteUserPosts = async (userId) => {
    await db.query('DELETE FROM posts WHERE user_id = ?', [userId]);
};