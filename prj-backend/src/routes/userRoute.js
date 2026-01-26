const express = require('express');
const { authMe, addUser, test } = require('../controllers/userController');

const router = express.Router();

router.get('/me', authMe);
router.get('/test', test);
router.post('/adduser', addUser);

module.exports = router;