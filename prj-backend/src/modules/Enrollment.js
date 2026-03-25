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
    }
};

module.exports = Enrollment;
