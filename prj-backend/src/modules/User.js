const db = require('../libs/db.js')

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
    addUser: async ({ userid, fullname, username, email, password, role}) => {
       const [result] = await db.execute(`INSERT INTO users (userid, fullname, username, email, password, role)
       VALUES (?, ?, ?, ?, ?, ?)`, [userid, fullname, username, email, password, role]);
       return result.insertId
    }

};

module.exports = User;