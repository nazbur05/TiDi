import bcrypt from 'bcryptjs';
import db from '../config/database.js';

// Create a new user
export const createUser = async (name, usrname, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
        'INSERT INTO users (name, usrname, email, password) VALUES (?, ?, ?, ?)',
        [name, usrname, email, hashedPassword]
    );

    return result.insertId;
};

// Update an existing user
export const updateUser = async (id, { name, usrname, email, password }) => {
    let hashedPassword;
    if (password) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    let query = 'UPDATE users SET ';
    const fields = [];
    const values = [];

    if (name) {
        fields.push('name = ?');
        values.push(name);
    }
    if (usrname) {
        fields.push('usrname = ?');
        values.push(usrname);
    }
    if (email) {
        fields.push('email = ?');
        values.push(email);
    }
    if (hashedPassword) {
        fields.push('password = ?');
        values.push(hashedPassword);
    }

    query += fields.join(', ');
    query += ' WHERE id = ?';
    values.push(id);

    const [result] = await db.query(query, values);
    return result.affectedRows;
};

// Delete a user by ID
export const deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
};

// Get a user by email
export const getUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

// Get a user by username
export const getUserByUsername = async (usrname) => {
    const [rows] = await db.query('SELECT * FROM users WHERE usrname = ?', [usrname]);
    return rows[0];
};

// Get a user by ID
// export const getUserById = async (userId) => {
//     const query = 'SELECT id, usrname, name FROM users WHERE id = ?';
//     const [rows] = await db.query(query, [userId]);
//     return rows[0];
// };
export const getUserById = async (userId) => {
    const query = 'SELECT id, usrname, name, is_admin FROM users WHERE id = ?';
    const [rows] = await db.query(query, [userId]);
    return rows[0];
};

// Get all users
export const getAllUsers = async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
};

// Get posts by a user
export const getUserPosts = async (userId) => {
    const query = `
        SELECT id, text, image_url, created_at
        FROM posts
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query, [userId]);
    return rows;
};