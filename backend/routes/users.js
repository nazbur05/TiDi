const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const router = express.Router();

// Secret key for JWT
const secretKey = '1470269369';

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error });
  }
});

module.exports = router;