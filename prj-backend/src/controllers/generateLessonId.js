const db = require('../libs/db.js')

const generateLessonId = async (course_id) => {
  const [rows] = await db.execute(
    'SELECT lesson_id FROM lessons WHERE course_id = ? ORDER BY id DESC LIMIT 1', 
    [course_id]
  );
  
  if (rows.length === 0) {
    return `${course_id}-1`;
  }
  
  // Lấy số sau dấu gạch ngang cuối cùng và cộng 1
  const lastId = rows[0].lesson_id;
  const lastNumber = parseInt(lastId.split('-').pop());
  return `${course_id}-${lastNumber + 1}`;
}

module.exports = { generateLessonId }