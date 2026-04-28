const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

module.exports = router;
