const express = require('express');
const bcrypt = require('bcrypt');       // For password hashing
const router = express.Router();        // For routes*
const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const Op = require('sequelize');
const authenticateToken = require('../middlewares/auth');


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


router.get('/getprofile', authenticateToken, async (req, res) => {
    const userID = req.user.userID;

    if (!userID) {
        return res.status(401).json({ message: 'Token not available.' });
    }

    try {
        const userData = await Users.findOne({
            where: { userID },
            attributes: { exclude: ['password'] } // Exclude the password field
        });

        if (!userData) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
    }
});


// Update Profile
router.post('/updateprofile', authenticateToken, async (req, res) => {
    const userID = req.user.userID;
    const {email, userType, phone, address, firstName, lastName } = req.body;

    if (!userID) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const user = await Users.findOne({ where: { userID } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update only fields that are provided in the request
        const updatedFields = {};

        if (phone !== undefined) updatedFields.phone = phone;
        if (address !== undefined) updatedFields.address = address;
        if (firstName !== undefined) updatedFields.firstName = firstName;
        if (lastName !== undefined) updatedFields.lastName = lastName;

        await user.update(updatedFields);

        res.json({
            message: 'Profile updated successfully.',
            user
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile.', error: error.message });
    }
});


module.exports = router;