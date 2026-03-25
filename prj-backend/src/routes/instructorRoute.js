const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const authorize = require('../middlewares/authorization');

// All instructor routes
router.get('/students', authorize(['instructor', 'admin']), instructorController.getInstructorStudents);

module.exports = router;
