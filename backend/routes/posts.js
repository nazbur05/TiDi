import express from 'express';
import multer from 'multer';
import { createPostHandler, getPostsByUserHandler, updatePostHandler, deletePostHandler } from '../controllers/postsc.js';
import authenticate from '../auth.js';

const router = express.Router();
const upload = multer({ dest: '../uploads/' }); 

// Create a post
router.post('/', upload.single('image'), authenticate, createPostHandler);

// Get posts by user
router.get('/:userId', getPostsByUserHandler);

// Edit a post
router.put('/:postId', upload.single('image'), authenticate, updatePostHandler);

// Delete a post
router.delete('/:postId', authenticate, deletePostHandler);

export default router;