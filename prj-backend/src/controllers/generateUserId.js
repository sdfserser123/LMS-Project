const db = require('../libs/db.js')

const generateUserId = async (role) => {
  const year = String(new Date().getFullYear()).slice(-2)

  let prefix = ""
  switch (role) {
    case "student":
      prefix = "ST"
      break
    case "instructor":
      prefix = "IN"
      break
    case "admin":
      prefix = "AD"
      break
    default:
      throw new Error("Invalid role")
  }

  const [rows] = await db.execute(
    'SELECT id FROM users WHERE role = ? ORDER BY created_at DESC LIMIT 1',
    [role]
  )

  let nextNumber = 1
  if (rows.length > 0) {
    nextNumber = rows[0].id + 1
  }

  return prefix + year + String(nextNumber).padStart(4, '0')
}

const generateLessonId = async (course_id) => {
  const [rows] = await db.execute(
    'SELECT * FROM lessons WHERE course_id = ? ORDER BY created_at DESC', [course_id]
  )
  if(rows.length == 0){
    return course_id + "-1";
  }
  else{
    return course_id + "-" + String(rows.length+1);
  }
  
}

module.exports = {generateUserId , generateLessonId}