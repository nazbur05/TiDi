import express from 'express';
import { followUserHandler, unfollowUserHandler, getFollowersHandler, getFollowingHandler } from '../controllers/followersc.js';
import authenticate from '../auth.js';

const router = express.Router();

// Follow a user
router.post('/follow/:id', authenticate, followUserHandler);

// Unfollow a user
router.delete('/unfollow/:id', authenticate, unfollowUserHandler);

// Get followers of a user
router.get('/:id/followers', getFollowersHandler);

// Get users that a user is following
router.get('/:id/following', getFollowingHandler);

export default router;