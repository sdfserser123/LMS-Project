const db = require('../libs/db.js');

const Enrollment = {
    // Lấy tất cả khóa học của một học viên
    getByStudentId: async (studentId) => {
        const [rows] = await db.execute(
            `SELECT e.*, c.title, c.description, c.instructor_id, c.status as course_status 
             FROM enrollments e 
             JOIN courses c ON e.course_id = c.courseid 
             WHERE e.student_id = ?`,
            [studentId]
        );
        return rows;
    },

    // Gán danh sách khóa học cho học viên
    assignCoursesToStudent: async (studentId, courseIds) => {
        try {
            await db.beginTransaction();

            // 1. Xóa các khóa học cũ
            await db.execute("DELETE FROM enrollments WHERE student_id = ?", [studentId]);

            // 2. Thêm mới danh sách khóa học (nếu có)
            if (courseIds && courseIds.length > 0) {
                // Prepare values for bulk insert
                const placeholders = courseIds.map(() => '(?, ?, ?)').join(', ');
                const values = courseIds.flatMap(courseId => [studentId, courseId, 'enrolled']);

                await db.execute(
                    `INSERT INTO enrollments (student_id, course_id, status) VALUES ${placeholders}`,
                    values
                );
            }

            await db.commit();
            return true;
        } catch (error) {
            await db.rollback();
            console.error("Error in assignCoursesToStudent:", error);
            throw error;
        }
    },

    // 3. Lấy danh sách học viên của một giảng viên (các học viên đăng ký vào khóa học của giảng viên đó)
    getStudentsByInstructor: async (instructorId) => {
        const query = `
            SELECT DISTINCT u.userid, u.fullname, u.email, u.username,
                   (SELECT COUNT(*) FROM enrollments e2 
                    JOIN courses c2 ON e2.course_id = c2.courseid 
                    WHERE e2.student_id = u.userid AND c2.instructor_id = ?) as course_count
            FROM users u
            JOIN enrollments e ON u.userid = e.student_id
            JOIN courses c ON e.course_id = c.courseid
            WHERE c.instructor_id = ?
        `;
        const [rows] = await db.execute(query, [instructorId, instructorId]);
        return rows;
    },
    // Get all students enrolled in a specific course
    getStudentsByCourseId: async (courseId) => {
        const [rows] = await db.execute(
            `SELECT u.userid, u.fullname, u.username, u.email, e.enrolled_at, e.status
             FROM enrollments e
             JOIN users u ON e.student_id = u.userid
             WHERE e.course_id = ?`,
            [courseId]
        );
        return rows;
    },

    // Enroll a single student into a course
    enrollStudent: async (studentId, courseId, status = 'enrolled') => {
        const [result] = await db.execute(
            `INSERT IGNORE INTO enrollments (student_id, course_id, status) VALUES (?, ?, ?)`,
            [studentId, courseId, status]
        );
        return result.affectedRows > 0;
    },

    // Remove a single student from a course
    unenrollStudent: async (studentId, courseId) => {
        const [result] = await db.execute(
            `DELETE FROM enrollments WHERE student_id = ? AND course_id = ?`,
            [studentId, courseId]
        );
        return result.affectedRows > 0;
    },

    // --- US-18: Admin Approval Logic ---
    updateEnrollmentStatus: async (studentId, courseId, status) => {
        await db.execute(
            "UPDATE enrollments SET status = ? WHERE student_id = ? AND course_id = ?",
            [status, studentId, courseId]
        );
        return true;
    },

    // Check if a student is enrolled in a course
    isEnrolled: async (studentId, courseId) => {
        const [rows] = await db.execute(
            "SELECT 1 FROM enrollments WHERE student_id = ? AND course_id = ? AND status = 'enrolled'",
            [studentId, courseId]
        );
        return rows.length > 0;
    }
};

module.exports = Enrollment;
