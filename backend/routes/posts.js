import express from 'express';
import multer from 'multer';
import { createPostHandler, getPostsByUserHandler, getAllPostsHandler, getPostsByFollowingHandler, updatePostHandler, deletePostHandler } from '../controllers/postsc.js';
import { createCommentHandler, getCommentsByPostHandler, deleteCommentHandler, addLikeHandler, removeLikeHandler, getLikesByPostHandler } from '../controllers/commentsnLikesc.js';
import authenticate from '../auth.js';
import { authorizeAdmin } from '../auth.js';

const router = express.Router();
const upload = multer({ dest: '../uploads/' }); 

// Create a post
router.post('/', upload.single('image'), authenticate, createPostHandler);

// Get posts by user
router.get('/:userId', getPostsByUserHandler);

// Get all posts
router.get('/', getAllPostsHandler);

// Get posts of following users
router.get('/followed', authenticate, getPostsByFollowingHandler);

// Edit a post
router.put('/:postId', upload.single('image'), authenticate, updatePostHandler);

// Delete a post
// router.delete('/:postId', authenticate, deletePostHandler);

// Route to delete a post
router.delete('/:postId', authenticate, authorizeAdmin, deletePostHandler);

// Comment routes
router.post('/comments', authenticate, createCommentHandler);
router.get('/comments/post/:postId', getCommentsByPostHandler);
router.delete('/comments/:commentId', authenticate, deleteCommentHandler);

// Like routes
router.post('/likes', authenticate, addLikeHandler);
router.delete('/likes', authenticate, removeLikeHandler);
router.get('/likes/post/:postId', getLikesByPostHandler);

export default router;