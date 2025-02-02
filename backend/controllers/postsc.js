import { createPost, getPostsByUser, getAllPosts, getPostsByFollowing, updatePost, deletePost } from '../models/post.js';

// Handler to create a new post
export const createPostHandler = async (req, res) => {
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const userId = req.user.id;

    try {
        const postId = await createPost(userId, text, imageUrl);
        res.json({ success: true, postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to get posts by a user
export const getPostsByUserHandler = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await getPostsByUser(userId);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts by user:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to get all posts
export const getAllPostsHandler = async (req, res) => {
    try {
        const posts = await getAllPosts();
        console.log('All posts:', posts); // Debugging log
        res.json(posts);
    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handler to get posts by following
export const getPostsByFollowingHandler = async (req, res) => {
    const userId = req.user.id;

    try {
        const posts = await getPostsByFollowing(userId);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts by following:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handler to update a post
export const updatePostHandler = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const userId = req.user.id;

    try {
        await updatePost(postId, text, imageUrl, userId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Handler to delete a post
export const deletePostHandler = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        await deletePost(postId, userId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};