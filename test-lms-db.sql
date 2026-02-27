CREATE DATABASE test_database;
USE test_database;

CREATE TABLE users (
	id INT auto_increment PRIMARY KEY NOT NULL,
    userid VARCHAR(10) NOT NULL UNIQUE,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','instructor','student') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(10) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sessions_user
      FOREIGN KEY (user_id)
      REFERENCES users(userid)
      ON DELETE CASCADE,

    UNIQUE (refresh_token)
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    courseid VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id VARCHAR(10) NOT NULL,
    status ENUM('pending', 'approved') DEFAULT 'pending', -- Logic kiểm duyệt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courses_instructor FOREIGN KEY (instructor_id) REFERENCES users(userid) ON DELETE CASCADE
);

CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id VARCHAR(20) NOT NULL,
    course_id VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT, -- Nội dung chữ
    video_url VARCHAR(500), -- Link phát video trực tiếp
    attachments JSON, -- Lưu danh sách file: [{"name": "lab.pdf", "url": "..."}]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(courseid) ON DELETE CASCADE
);

CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    course_id VARCHAR(20) NOT NULL,
    status ENUM('requested', 'enrolled') DEFAULT 'requested', -- Admin duyệt mới được vào học
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id),
    CONSTRAINT fk_enroll_student FOREIGN KEY (student_id) REFERENCES users(userid) ON DELETE CASCADE,
    CONSTRAINT fk_enroll_course FOREIGN KEY (course_id) REFERENCES courses(courseid) ON DELETE CASCADE
);

SELECT id FROM users WHERE username = 'admin';

SELECT * FROM users;

SELECT * FROM sessions;

SELECT * FROM courses;

SELECT * FROM lessons;

SHOW TABLES;

DESC users;

DROP TABLE users;

DROP TABLE sessions;

DROP TABLE courses;

DROP TABLE lessons;

TRUNCATE TABLE users;

INSERT INTO users (userid, fullname, username, email, password, role) 
VALUES ( 1101101101, 'Administrator', 'admin', 'admin@gamil.com', '$2b$10$6TU7Q3XeimaLuFFohufRN.8kgSeqC.taHEvdf7TI2N9q.QgpHlNtW', 'admin'); 

ALTER TABLE users 
MODIFY userid VARCHAR(10) NOT NULL UNIQUE;

