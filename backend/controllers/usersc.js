import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserByEmail, getUserByUsername } from '../models/user.js';

export const createUserHandler = async (req, res) => {
    const { name, usrname, email, password } = req.body;

    try {
        // Check if email is already in use
        const existingUserByEmail = await getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Check if username is already in use
        const existingUserByUsername = await getUserByUsername(usrname);
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: 'Username already in use' });
        }

        // Create new user with the hashed password
        const id = await createUser(name, usrname, email, password);
        console.log("User data inserted:", { name, usrname, email, password });
        res.json({ success: true, id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


export const loginUserHandler = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, 'megasupersecretkey123', { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};



export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getUser = async (req, res) => {
    const { id, usrname, email } = req.params;

    try {
        let user;

        if (id) {
            user = await getUserById(id);
        } else if (usrname) {
            user = await getUserByUsername(usrname);
        } else if (email) {
            user = await getUserByEmail(email);
        } else {
            return res.status(400).json({ success: false, message: 'Invalid parameters. Provide id, username, or email.' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


export const updateUserHandler = async (req, res) => {
    const { id } = req.params;
    const { name, usrname, email } = req.body;
    try {
        const affectedRows = await updateUser(id, name, usrname, email);
        if (affectedRows === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
        } else {
            res.json({ success: true });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteUserHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const affectedRows = await deleteUser(id);
        if (affectedRows === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
        } else {
            res.json({ success: true });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};