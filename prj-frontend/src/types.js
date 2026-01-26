// User roles
export const UserRole = Object.freeze({
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  GUEST: 'GUEST' // Not logged in
});

// Course status
export const CourseStatus = Object.freeze({
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',   // Waiting for admin approval
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
});

//user
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role - One of UserRole
 * @property {string=} avatar
 */

//course
/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} instructorId
 * @property {string} instructorName
 * @property {string} thumbnail
 * @property {string} category
 * @property {number} price
 * @property {string} status - One of CourseStatus
 * @property {Lesson[]} lessons
 * @property {string[]} enrolledStudentIds
 * @property {number} createdAt
 */

//lesson
/**
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string=} videoUrl
 * @property {number} duration - in minutes
 */
