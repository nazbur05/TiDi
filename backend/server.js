import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/users.js';

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend')));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Badabing badaboom');
});

// Use the user routes for any requests starting with /users
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});