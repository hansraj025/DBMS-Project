const express = require('express');
const bcrypt = require('bcrypt');       // For password hashing
const router = express.Router();        // For routes*
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const Op = require('sequelize');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access restricted to admins' });
    }
};

// Fetch all users (admin only)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        const user = await Users.findOne({
            where: {
                email
            }
        });

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate token with admin claim if applicable
        const token = jwt.sign(
            {
                userID: user.userID,
                email: user.email,
                isAdmin: user.userType === 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            message: 'Login successful',
            token,
            user: {
                userID: user.userID,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login'
        });
    }
});

module.exports = router;