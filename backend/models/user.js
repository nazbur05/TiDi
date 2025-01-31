import bcrypt from 'bcryptjs';
import db from '../config/database.js';

export const createUser = async (name, usrname, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query('INSERT INTO users (name, usrname, email, password) VALUES (?, ?, ?, ?)', [name, usrname, email, hashedPassword]);

    return result.insertId;
};


export const updateUser = async (id, name, usrname, email) => {
    const [result] = await db.query('UPDATE users SET name = ?, usrname = ?, email = ? WHERE id = ?', [name, usrname, email, id]);
    return result.affectedRows;
};

export const deleteUser = async (id) => {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
};

export const getUserByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

export const getUserByUsername = async (usrname) => {
    const [rows] = await db.query('SELECT * FROM users WHERE usrname = ?', [usrname]);
    return rows[0];
};

export const getUserById = async (id) => {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

export const getAllUsers = async () => {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
};