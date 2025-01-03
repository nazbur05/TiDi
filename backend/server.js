import express from 'express';
import userRoutes from './routes/users.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Badabing badaboom');
});

// Use the user routes for any requests starting with /users
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});