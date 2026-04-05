const Enrollment = require('../modules/Enrollment');
const User = require('../modules/User');
const Notification = require('../modules/Notification');

const enrollmentController = {
    // Xem danh sách khóa học của 1 student
    getStudentEnrollments: async (req, res) => {
        try {
            const { studentId } = req.params;
            
            // Check if user exists & is a student
            const userResult = await User.findById(studentId);
            if (!userResult) {
                return res.status(404).json({ message: "Student not found" });
            }

            const enrollments = await Enrollment.getByStudentId(studentId);
            res.status(200).json(enrollments);
        } catch (error) {
            console.error("Error fetching student enrollments:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    // Admin chỉ định khóa học cho student
    assignCourses: async (req, res) => {
        try {
            // body request: { studentId: "USER123", courseIds: ["CS101", "CS102"] }
            const { studentId, courseIds } = req.body;

            if (!studentId) {
                return res.status(400).json({ message: "Student ID is required" });
            }

            if (!Array.isArray(courseIds)) {
                return res.status(400).json({ message: "courseIds must be an array" });
            }

            // Check if student exists
            const studentResult = await User.findById(studentId);
            if (!studentResult) {
                return res.status(404).json({ message: "Student not found" });
            }

            await Enrollment.assignCoursesToStudent(studentId, courseIds);

            res.status(200).json({ message: "Courses assigned successfully" });
        } catch (error) {
            console.error("Error assigning courses:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    // GET /api/enrollments/course/:courseId — list students enrolled in a course
    getCourseStudents: async (req, res) => {
        try {
            const { courseId } = req.params;
            const students = await Enrollment.getStudentsByCourseId(courseId);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching course students:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    // POST /api/enrollments/course/:courseId/enroll — add a student to a course
    enrollStudentToCourse: async (req, res) => {
        try {
            const { courseId } = req.params;
            const { studentId } = req.body;

            if (!studentId) {
                return res.status(400).json({ message: "studentId is required" });
            }

            const student = await User.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            if (student.role !== 'student') {
                return res.status(400).json({ message: "Only users with role 'student' can be enrolled" });
            }

            const isInstructor = req.user.role === 'instructor';
            const status = isInstructor ? 'pending' : 'enrolled';

            const enrolled = await Enrollment.enrollStudent(studentId, courseId, status);
            if (!enrolled) {
                return res.status(409).json({ message: "Student is already enrolled in this course" });
            }

            if (isInstructor) {
                // Notify all admins for approval
                const admins = await User.findAll();
                const adminList = admins.filter(u => u.role === 'admin');
                
                for (const admin of adminList) {
                    await Notification.insert(
                        admin.userid, 
                        'enrollment_request', 
                        `Teacher ${req.user.fullname} requested to enroll ${student.fullname} into course ${courseId}.`,
                        { studentId, courseId, type: 'enrollment_request', instructorId: req.user.userid }
                    );
                }
                return res.status(201).json({ message: "Enrollment request sent to Admin for approval", status: 'pending' });
            }

            res.status(201).json({ message: "Student enrolled successfully", status: 'enrolled' });
        } catch (error) {
            console.error("Error enrolling student:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    // POST /api/enrollments/approve — Admin approves or denies a request
    handleEnrollmentApproval: async (req, res) => {
        try {
            const { studentId, courseId, instructorId, action, notificationId } = req.body;

            if (action === 'approve') {
                await Enrollment.updateEnrollmentStatus(studentId, courseId, 'enrolled');
                // Notify instructor
                if (instructorId) {
                    await Notification.insert(
                        instructorId,
                        'enrollment_result',
                        `Admin approved your request to enroll student ${studentId} into course ${courseId}.`,
                        { studentId, courseId, result: 'approved' }
                    );
                }
                res.status(200).json({ message: "Enrollment approved" });
            } else {
                await Enrollment.unenrollStudent(studentId, courseId);
                // Notify instructor
                if (instructorId) {
                    await Notification.insert(
                        instructorId,
                        'enrollment_result',
                        `Admin denied your request to enroll student ${studentId} into course ${courseId}.`,
                        { studentId, courseId, result: 'denied' }
                    );
                }
                res.status(200).json({ message: "Enrollment denied" });
            }

            // Mark notification as read
            if (notificationId) {
                await Notification.markAsRead(notificationId, req.user.userid);
            }
        } catch (error) {
            console.error("Error handling enrollment approval:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    // DELETE /api/enrollments/course/:courseId/student/:studentId — remove student from course
    unenrollStudentFromCourse: async (req, res) => {
        try {
            const { courseId, studentId } = req.params;

            const removed = await Enrollment.unenrollStudent(studentId, courseId);
            if (!removed) {
                return res.status(404).json({ message: "Enrollment not found" });
            }

            res.status(200).json({ message: "Student removed from course successfully" });
        } catch (error) {
            console.error("Error unenrolling student:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

module.exports = enrollmentController;
