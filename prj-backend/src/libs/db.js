const mysql = require('mysql2');
require("dotenv").config()

const dbHost = process.env.DB_HOST || process.env.MYSQLHOST;
const dbUser = process.env.DB_USER || process.env.MYSQLUSER;
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
const dbDatabase = process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE;
const dbPort = process.env.DB_PORT || process.env.MYSQLPORT;

console.log("Database connection details:", {
  host: dbHost,
  user: dbUser,
  database: dbDatabase,
  port: dbPort
});

const db = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbDatabase,
  port: dbPort
}).promise();

db.execute(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE
  )
`).catch(err => console.error("Error creating notifications table:", err));

db.execute(`
  CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    file_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(courseid) ON DELETE CASCADE
  )
`).catch(err => console.error("Error creating assignments table:", err));

db.execute(`
  CREATE TABLE IF NOT EXISTS assignment_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    content TEXT,
    file_url VARCHAR(255),
    status ENUM('submitted', 'graded') DEFAULT 'submitted',
    grade INT DEFAULT NULL,
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    graded_at TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(userid) ON DELETE CASCADE
  )
`).catch(err => console.error("Error creating submissions table:", err));

// --- US-18: Schema Migrations ---

// Add data column to notifications
db.execute(`
  ALTER TABLE notifications 
  ADD COLUMN data TEXT DEFAULT NULL
`).catch(err => {
  if (err.message.includes('Duplicate column name')) {
    // console.log('data column already exists');
  } else {
    console.error("Error updating notifications table:", err.message);
  }
});

// Update enrollments status
db.execute(`
  ALTER TABLE enrollments 
  MODIFY COLUMN status ENUM('pending', 'enrolled') DEFAULT 'enrolled'
`).catch(err => {
  if (err && err.message) {
    console.error("Error updating enrollments status:", err.message);
  }
});

// --- US-19: Announcement System ---
db.execute(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    file_url VARCHAR(255) DEFAULT NULL,
    status ENUM('pending', 'approved') DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(userid) ON DELETE CASCADE
  )
`).catch(err => console.error("Error creating announcements table:", err));

// --- US-20: Assignment & Notification Synchronize ---
db.execute(`
  ALTER TABLE assignments 
  ADD COLUMN file_url VARCHAR(255) DEFAULT NULL
`).catch(err => {
  if (err && err.message && err.message.includes('Duplicate column name')) {
    // Already exists
  } else if (err) {
    console.error("Error updating assignments table:", err.message);
  }
});

db.execute(`
  ALTER TABLE notifications 
  ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL
`).catch(err => {
  if (err && err.message && err.message.includes('Duplicate column name')) {
    // Already exists
  } else if (err) {
    console.error("Error updating notifications deleted_at:", err.message);
  }
});

// --- US-21: Unified Calendar (Categorized Deadlines) ---
db.execute(`
  ALTER TABLE assignments 
  ADD COLUMN type ENUM('homework', 'assignment', 'test') DEFAULT 'assignment'
`).catch(err => {
  if (err && err.message && err.message.includes('Duplicate column name')) {
    // Already exists
  } else if (err) {
    console.error("Error updating assignments type:", err.message);
  }
});

// --- US-22: Announcement File Uploads ---
db.execute(`
  ALTER TABLE announcements 
  ADD COLUMN file_url VARCHAR(255) DEFAULT NULL
`).catch(err => {
  if (err && err.message && err.message.includes('Duplicate column name')) {
    // Already exists
  } else if (err) {
    console.error("Error updating announcements table:", err.message);
  }
});

// --- US-23: Lesson Scheduling ---
db.execute(`
  ALTER TABLE lessons 
  ADD COLUMN scheduled_at DATETIME DEFAULT NULL
`).catch(err => {
  if (err && err.message && err.message.includes('Duplicate column name')) {
    // Already exists
  } else if (err) {
    console.error("Error updating lessons table with scheduled_at:", err.message);
  }
});

// --- US-24: Activity Logging ---
db.execute(`
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE
  )
`).catch(err => console.error("Error creating activity_logs table:", err));

// --- Auto-Seed Admin Account ---
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    const username = process.env.MASTER_USERNAME || 'admin';
    const password = process.env.MASTER_PASSWORD || '123456';
    
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (users.length === 0) {
      console.log(`Admin user "${username}" not found. Seeding admin user...`);
      const hashPassword = await bcrypt.hash(password, 10);
      
      const year = String(new Date().getFullYear()).slice(-2);
      const [rows] = await db.execute(
        'SELECT userid FROM users WHERE role = ? ORDER BY created_at DESC LIMIT 1',
        ['admin']
      );
      
      let nextNumber = 1;
      if (rows.length > 0) {
        const lastId = rows[0].userid;
        if (lastId && lastId.length >= 8) {
          const lastNumberStr = lastId.slice(4);
          nextNumber = parseInt(lastNumberStr, 10) + 1;
          if (isNaN(nextNumber)) nextNumber = 1;
        }
      }
      const userid = 'AD' + year + String(nextNumber).padStart(4, '0');
      
      await db.execute(`
        INSERT INTO users (userid, fullname, username, email, password, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userid, 'System Administrator', username, 'admin@lms.com', hashPassword, 'admin']);
      console.log(`Admin user "${username}" seeded successfully with ID: ${userid}!`);
    } else {
      console.log(`Admin user "${username}" already exists.`);
    }
  } catch (err) {
    if (err.message && err.message.includes("Table 'railway.users' doesn't exist")) {
      console.log("Users table does not exist yet. Skipping admin seeding.");
    } else {
      console.error("Error seeding admin user:", err);
    }
  }
}

// Trigger seeding 3 seconds after startup to ensure tables are ready
setTimeout(seedAdmin, 3000);

module.exports = db;