import db from '../config/database.js';

export const getAllUsers = async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
};

export const getUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

export const createUser = async (name, email) => {
    const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    return result.insertId;
};

export const updateUser = async (id, name, email) => {
    const [result] = await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    return result.affectedRows;
};

export const deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
};