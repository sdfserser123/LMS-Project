const db = require('../libs/db.js');

const ActivityLog = {
    create: async ({ userId, action, ip, details }) => {
        try {
            await db.execute(
                "INSERT INTO activity_logs (user_id, action, ip_address, details) VALUES (?, ?, ?, ?)",
                [userId, action, ip, JSON.stringify(details)]
            );
        } catch (error) {
            console.error("Error creating activity log:", error);
        }
    },

    getLogs: async () => {
        const [rows] = await db.query("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100");
        return rows;
    }
};

module.exports = ActivityLog;
