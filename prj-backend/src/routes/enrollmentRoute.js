const express = require('express');
const router = express.Router();
const enrollmentCtrl = require('../controllers/enrollmentController');
const authorize = require('../middlewares/authorization');

// --- QUẢN LÝ GHI DANH KHÓA HỌC (ENROLLMENTS) ---

// Xem danh sách khóa học đã Enroll của học sinh (Admin hoặc chính học sinh đó có thể xem)
router.get('/student/:studentId', authorize(['admin', 'instructor', 'student']), enrollmentCtrl.getStudentEnrollments);

// Admin gán danh sách khóa học cho học sinh
router.post('/assign', authorize(['admin']), enrollmentCtrl.assignCourses);

// --- US-18: Course-centric student management ---

// Lấy danh sách học sinh trong 1 khóa học
router.get('/course/:courseId/students', authorize(['admin', 'instructor']), enrollmentCtrl.getCourseStudents);

// Thêm 1 học sinh vào khóa học
router.post('/course/:courseId/enroll', authorize(['admin', 'instructor']), enrollmentCtrl.enrollStudentToCourse);

// Xóa 1 học sinh khỏi khóa học
router.delete('/course/:courseId/student/:studentId', authorize(['admin', 'instructor']), enrollmentCtrl.unenrollStudentFromCourse);

// Phê duyệt yêu cầu ghi danh của GV
router.post('/approve', authorize(['admin']), enrollmentCtrl.handleEnrollmentApproval);

module.exports = router;
