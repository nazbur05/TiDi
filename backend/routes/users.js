import express from 'express';
import { createUserHandler, loginUserHandler, getUsers, getUser, updateUserHandler, deleteUserHandler, getCurrentUserHandler } from '../controllers/usersc.js';
import authenticate from '../auth.js';

const router = express.Router();

router.post('/create', createUserHandler);
router.post('/login', loginUserHandler);

router.get('/', getUsers);
router.get('/:id', getUser);

router.get('/me', authenticate, getCurrentUserHandler);
router.put('/me', authenticate, updateUserHandler);

router.delete('/:id', deleteUserHandler);

export default router;