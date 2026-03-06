const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const connectToDatabase = require('../models/db');

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
        res.status(201).json({ message: 'User registered successfully.', user: userWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
