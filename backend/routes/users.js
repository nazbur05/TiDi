import express from 'express';
import { createUserHandler, loginUserHandler, getUsers, getUser, updateUserHandler, deleteUserHandler } from '../controllers/usersc.js';

const router = express.Router();

router.post('/create', createUserHandler);
router.post('/login', loginUserHandler);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;