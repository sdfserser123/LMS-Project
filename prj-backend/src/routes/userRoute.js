const express = require('express');
const { authMe, addUser, updateUser, deleteUser, getAllUsers, getLogs, test } = require('../controllers/userController');
const authorize = require('../middlewares/authorization.js')

const router = express.Router();

router.get('/me', authMe);


// Chỉ ADMIN
router.post('/adduser', authorize(['admin']), addUser);
router.put('/:id', authorize(['admin']), updateUser);
router.delete('/:id', authorize(['admin']), deleteUser);
router.get('/', authorize(['admin']), getAllUsers);
router.get('/logs', authorize(['admin']), getLogs);

// ADMIN + TEACHER
router.get('/test', authorize(['admin', 'instructor']), test);

module.exports = router;