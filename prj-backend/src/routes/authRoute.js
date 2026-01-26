const express = require('express');
const { logIn, logOut } = require('../controllers/authController');

const router = express.Router();

router.post('/login', logIn);

router.post('/logout', logOut);

module.exports = router;