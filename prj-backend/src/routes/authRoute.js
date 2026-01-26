const express = require('express');
const { logIn, logOut, refreshToken } = require('../controllers/authController');

const router = express.Router();

router.post('/login', logIn);

router.post('/logout', logOut);

router.post('/refresh', refreshToken)

module.exports = router;