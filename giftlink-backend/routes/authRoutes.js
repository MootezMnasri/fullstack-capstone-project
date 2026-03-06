const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const connectToDatabase = require('../models/db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'setasecret';

// POST /register - Register a new user
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists.' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: uuidv4(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };
        await usersCollection.insertOne(newUser);
        // Never return password
        const { password: _, ...userWithoutPassword } = newUser;
        // Generate JWT token
        const authtoken = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.firstName }, JWT_SECRET, { expiresIn: '2h' });
        res.status(201).json({ message: 'User registered successfully.', user: userWithoutPassword, authtoken });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// POST /login - Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        // Generate JWT token
        const authtoken = jwt.sign({ id: user.id, email: user.email, name: user.firstName }, JWT_SECRET, { expiresIn: '2h' });
        // Never return password
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({ message: 'Login successful.', user: userWithoutPassword, authtoken });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
