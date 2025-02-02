import express from 'express';
import { createUserHandler, loginUserHandler, getUsers, getUser, updateUserHandler, deleteUserHandler, getCurrentUserHandler, getUserProfileHandler } from '../controllers/usersc.js';
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
router.delete('/:id', deleteUserHandler);

export default router;