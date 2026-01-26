const db = require('../libs/db.js')
const bcrypt = require('bcrypt')
const generateUserId = require('../controllers/generateUserId.js')

const User = {
    findByUsername: async (username) => {
        console.log(username)
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        console.log(rows)
        return rows[0];
    },
    findById: async (userid) => {
        console.log(userid)
        const [rows] = await db.execute("SELECT * FROM users WHERE userid = ?", [userid]);
        console.log(rows)
        return rows[0];
    },
    addUser: async ({ fullname, username, email, password, role}) => {
       const hashPassword = await bcrypt.hash(password, 10);
       const userid = await generateUserId(role)
       const [result] = await db.execute(`INSERT INTO users (userid, fullname, username, email, password, role)
       VALUES (?, ?, ?, ?, ?, ?)`, [userid, fullname, username, email, hashPassword, role]);
       return result.insertId
    }

};

module.exports = User;