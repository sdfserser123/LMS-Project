const mysql = require('mysql2')
const db = require('../libs/db.js')

const Session = {
  // Tạo session mới
  create: async ({ userId, refreshToken, expiresAt }) => {
    const [result] = await db.execute(
      `INSERT INTO sessions (user_id, refresh_token, expires_at)
       VALUES (?, ?, ?)`,
      [userId, refreshToken, expiresAt]
    )
    return result.insertId
  },

  // Tìm session theo refresh token
  findByToken: async (refreshToken) => {
    const [rows] = await db.execute(
      `SELECT * FROM sessions WHERE refresh_token = ?`,
      [refreshToken]
    )
    return rows[0]
  },

  // Xoá session (logout)
  deleteByToken: async (refreshToken) => {
    await db.execute(
      `DELETE FROM sessions WHERE refresh_token = ?`,
      [refreshToken]
    )
  },

  // Xoá tất cả session của 1 user (logout all)
  deleteByUserId: async (userId) => {
    await db.execute(
      `DELETE FROM sessions WHERE user_id = ?`,
      [userId]
    )
  }
}

module.exports = Session
