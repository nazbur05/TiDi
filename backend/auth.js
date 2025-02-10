import jwt from 'jsonwebtoken';
import { getUserById } from './models/user.js';

// const authenticate = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) { 
//         return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, 'megasupersecretkey123'); 
//         req.user = decoded; 
//         next();
//     } catch (ex) {
//         res.status(400).json({ error: 'Invalid token.' });
//     }
// };

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'megasupersecretkey123');
        req.user = decoded;

        // Fetch the user from the database to get the `is_admin` field
        const user = await getUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        req.user.is_admin = user.is_admin; // Add the `is_admin` property to `req.user`
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (!req.user.is_admin) {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};

export default authenticate;
export { authorizeAdmin };