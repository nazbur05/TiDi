import { createComment, getCommentsByPost, deleteComment, addLike, removeLike, getLikesByPost } from '../models/commentnLike.js';

// Handler to create a new comment
export const createCommentHandler = async (req, res) => {
    const { postId, text } = req.body;
    const userId = req.user.id;

    try {
        const commentId = await createComment(postId, userId, text);
        res.status(201).json({ success: true, commentId });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to get comments for a specific post
export const getCommentsByPostHandler = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await getCommentsByPost(postId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to delete a comment
export const deleteCommentHandler = async (req, res) => {
    const { commentId } = req.params;

    try {
        const affectedRows = await deleteComment(commentId);
        if (affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Comment not found' });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to add a like
export const addLikeHandler = async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    try {
        const likeId = await addLike(postId, userId);
        res.status(201).json({ success: true, likeId });
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to remove a like
export const removeLikeHandler = async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.id;

    try {
        const affectedRows = await removeLike(postId, userId);
        if (affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Like not found' });
        } else {
            res.status(200).json({ success: true });
        }
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to get likes for a specific post
export const getLikesByPostHandler = async (req, res) => {
    const { postId } = req.params;

    try {
        const likes = await getLikesByPost(postId);
        res.status(200).json(likes);
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};