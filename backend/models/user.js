import bcrypt from 'bcryptjs';
import db from '../config/database.js';

export const createUser = async (name, usrname, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query('INSERT INTO users (name, usrname, email, password) VALUES (?, ?, ?, ?)', [name, usrname, email, hashedPassword]);

    return result.insertId;
};


// export const updateUser = async (id, name, usrname, email) => {
//     const [result] = await db.query('UPDATE users SET name = ?, usrname = ?, email = ? WHERE id = ?', [name, usrname, email, id]);
//     return result.affectedRows;
// };

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