import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserByEmail, getUserByUsername, getUserPosts } from '../models/user.js';
import { deleteUserPosts } from '../models/post.js';
import { deleteUserComments } from '../models/commentnLike.js';

// Handler to create a new user
export const createUserHandler = async (req, res) => {
    const { name, usrname, email, password } = req.body;

    try {
        const existingUserByEmail = await getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const existingUserByUsername = await getUserByUsername(usrname);
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: 'Username already in use' });
        }

        // Create new user with the hashed password
        const id = await createUser(name, usrname, email, password);
        console.log("User created:", { name, usrname, email });
        res.json({ success: true, id, redirectUrl: 'main.html' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to log in a user
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
        res.json({ success: true, token, userId: user.id, redirectUrl: 'main.html' });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to get all users
export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json({ success: true, users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to get a user by ID, username, or email
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
        console.error('Error fetching user:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to get the current authenticated user
export const getCurrentUserHandler = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handler to update a user
export const updateUserHandler = async (req, res) => {
    const userId = req.user.id;
    const { name, usrname, email, password, currentPassword } = req.body;

    if (!name && !usrname && !email && !password) {
        return res.status(400).json({ error: 'At least one field is required to update' });
    }

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if ((email || password) && !currentPassword) {
            return res.status(400).json({ error: 'Current password is required to change email or password' });
        }

        if (currentPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }
        }

        const updatedData = { name, usrname, email, password };
        const affectedRows = await updateUser(userId, updatedData);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or no changes made' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handler to delete a user
// export const deleteUserHandler = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const affectedRows = await deleteUser(id);
//         if (affectedRows === 0) {
//             res.status(404).json({ success: false, message: 'User not found' });
//         } else {
//             res.json({ success: true });
//         }
//     } catch (err) {
//         console.error('Error deleting user:', err);
//         res.status(500).json({ success: false, error: 'Internal server error' });
//     }
// };

export const deleteUserHandler = async (req, res) => {
    const { userId } = req.params;

    try {
        await deleteUser(userId);
        await deleteUserPosts(userId);
        await deleteUserComments(userId);
        res.status(200).json({ success: true, message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handler to get a user's profile
export const getUserProfileHandler = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await getUserById(userId);
        const posts = await getUserPosts(userId);
        res.json({ user, posts });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};