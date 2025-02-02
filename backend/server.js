import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/users.js';
import followerRoutes from './routes/followers.js';
import postRoutes from './routes/posts.js';

const app = express();
const PORT = 3000;

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/users', userRoutes);
app.use('/followers', followerRoutes);
app.use('/posts', postRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Badabing badaboom');
});

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// Global error-handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});