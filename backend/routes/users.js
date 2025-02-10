import express from 'express';
import { createUserHandler, loginUserHandler, getUsers, getUser, updateUserHandler, deleteUserHandler, getCurrentUserHandler, getUserProfileHandler } from '../controllers/usersc.js';
import { deletePostHandler } from '../controllers/postsc.js';
import { authorizeAdmin } from '../auth.js';
import authenticate from '../auth.js';

const router = express.Router();

//Register account
router.post('/create', createUserHandler);

//Log in to account
router.post('/login', loginUserHandler);

//Show all users
router.get('/', getUsers);

//Show a user
router.get('/profile/:userId', authenticate, getUserProfileHandler);

//Authorise user
router.get('/me', authenticate, getCurrentUserHandler);

//Update profile
router.put('/me', authenticate, updateUserHandler);

//Delete account
// router.delete('/:id', deleteUserHandler);

// Route to delete a user and their associated posts and comments
router.delete('/:userId', authenticate, authorizeAdmin, deleteUserHandler);

// Route to delete a post
router.delete('/:postId', authenticate, authorizeAdmin, deletePostHandler);

export default router;