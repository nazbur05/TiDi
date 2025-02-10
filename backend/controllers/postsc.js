import { createPost, getPostsByUser, getAllPosts, getPostsByFollowing, updatePost, deletePost } from '../models/post.js';
import { getCommentsByPost, getLikesByPost } from '../models/commentnLike.js';

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
// export const getAllPostsHandler = async (req, res) => {
//     try {
//         const posts = await getAllPosts();
//         console.log('All posts:', posts); // Debugging log
//         const comments = await getCommentsByPost(posts.id);
//         res.json(posts, comments);
//     } catch (error) {
//         console.error('Error fetching all posts:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// (Added comments and likes)
export const getAllPostsHandler = async (req, res) => {
    try {
        const posts = await getAllPosts(); 
        const postsWithDetails = await Promise.all(posts.map(async post => {
            const likes = await getLikesByPost(post.id);
            const comments = await getCommentsByPost(post.id); 
            return { ...post, comments, like_count: likes.length };
        }));
        res.status(200).json(postsWithDetails); 
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
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

    try {
        const success = await deletePost(postId);
        if (success) {
            res.status(200).json({ success: true, message: 'Post, associated comments, and likes deleted successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to delete post' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};