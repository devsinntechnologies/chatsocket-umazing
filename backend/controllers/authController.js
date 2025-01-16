const { User, Room } = require('../db/index'); // Importing models
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Sign Up Handler
const signUpHandler = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4().replace(/-/g, '');

        // Create the new user
        const newUser = await User.create({
            id: userId,
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign({ id: newUser.id, email }, "umazing-key_jwt_secret_key" );

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error('Sign Up Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Login Handler
const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email }, "umazing-key_jwt_secret_key" );

        res.status(200).json({success: true, message: 'Login successful', token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get All Users (For Testing / Debugging)
const getAllUsers = async (req, res) => {
    try {
        // Get all users with their associated rooms
        const users = await User.findAll({
            attributes: ['id', 'name', 'email'],
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get user' });
    }
};
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({
            where: { id: userId }, // Find user by their ID
            attributes: ['id', 'name', 'email'], // Select only necessary fields
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get user' });
    }
};


module.exports = { signUpHandler, loginHandler, getAllUsers, getUserProfile };
