import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../models/user.js';

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
        } else {
            res.json({ success: true, user });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const createUserHandler = async (req, res) => {
    const { name, email } = req.body;
    try {
        const id = await createUser(name, email);
        res.json({ success: true, id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateUserHandler = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const affectedRows = await updateUser(id, name, email);
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