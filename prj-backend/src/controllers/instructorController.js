const Enrollment = require('../modules/Enrollment');

const instructorController = {
    // Get all students enrolled in any course taught by the logged-in instructor
    getInstructorStudents: async (req, res) => {
        try {
            const instructorId = req.user.userid;
            const students = await Enrollment.getStudentsByInstructor(instructorId);
            res.status(200).json(students);
        } catch (error) {
            console.error("Get Instructor Students Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = instructorController;
