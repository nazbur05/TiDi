import { createPost, getPostsByUser, updatePost, deletePost } from '../models/post.js';

export const createPostHandler = async (req, res) => {
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const userId = req.user.id;


    try {
        const postId = await createPost(userId, text, imageUrl);
        res.json({ success: true, postId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getPostsByUserHandler = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await getPostsByUser(userId);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updatePostHandler = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const userId = req.user.id;


    try {
        await updatePost(postId, text, imageUrl, userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePostHandler = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        await deletePost(postId, userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};