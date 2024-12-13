const express = require('express');
const bcrypt = require('bcrypt');       // For password hashing
const router = express.Router();        // For routes*
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const Op = require('sequelize');


// for localhost:3001/users
router.get('/', async (req, res) => {
    const listOfAllUsers = await Users.findAll();
    res.json(listOfAllUsers);
});


/* USER SIGNUP */
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if a user with the same email already exists
        const existingUser = await Users.findOne({ where: { email } });

        // If a user exists raise an error
        if (existingUser) {
            return res.status(400).json({
                error: "An account with the given email already exists."
            });
        }

        // If no existing user, create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            email: email,
            password: hashedPassword
        });

        // Generate token for automatic login
        const token = jwt.sign(
            {
                userID: newUser.userID,
                email: newUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "Signup and login successful",
            token,
            user: {
                userID: newUser.userID,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error while creating user: ", error);
        res.status(500).json({
            error: "An error occurred while creating the user."
        });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 0. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            })
        }

        const user = await Users.findOne({
            where: {
                email
            }
        });

        // 1. Check if user exists
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // 2. check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }


        // 3. Generate token
        const token = jwt.sign(
            {
                userID: user.userID,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        // 4. Send response
        res.json({
            message: 'Login successful',
            token,
            user: {
                userID: user.userID,
                email: user.email,
                userType: user.userType
        }})

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login'
        })
    }
})


module.exports = router;