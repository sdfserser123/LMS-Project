const express = require('express');
const { authMe, addUser, test } = require('../controllers/userController');
const authorize = require('../middlewares/authorization.js')

const router = express.Router();

router.get('/me', authMe);

// Chỉ ADMIN
router.post('/adduser', authorize(['admin']), addUser);

// ADMIN + TEACHER
router.get('/test', authorize(['admin', 'instructor']), test);

module.exports = router;