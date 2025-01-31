import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'megasupersecretkey123'); 
        req.user = decoded; 
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

export default authenticate;