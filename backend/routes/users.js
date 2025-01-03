import express from 'express';
import { getUsers, getUser, createUserHandler, updateUserHandler, deleteUserHandler } from '../controllers/usersc.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUserHandler);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;