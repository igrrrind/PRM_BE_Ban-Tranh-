const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh); // POST for refresh token
router.post('/logout', authController.logout); // POST for logout
router.get('/me', authController.me);

module.exports = router;
