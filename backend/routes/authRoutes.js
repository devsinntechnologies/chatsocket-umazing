const express = require('express');
const { signUpHandler, loginHandler, getAllUsers, getUserProfile } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signUpHandler);
router.post('/login', loginHandler);
router.get('/getAllUsers', getAllUsers);
router.get('/getUserProfile', authenticateToken, getUserProfile);

module.exports = router;
