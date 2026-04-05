const db = require('../src/libs/db.js');

async function migrate() {
  try {
    console.log('Starting migration...');

    // 1. Alter enrollments table
    try {
      await db.execute(`
        ALTER TABLE enrollments 
        MODIFY COLUMN status ENUM('pending', 'enrolled') DEFAULT 'enrolled'
      `);
      console.log('Enrollments table status modified.');
    } catch (err) {
      console.error('Error modifying enrollments status:', err.message);
    }

    // 2. Alter notifications table
    try {
      await db.execute(`
        ALTER TABLE notifications 
        ADD COLUMN data TEXT DEFAULT NULL
      `);
      console.log('Notifications table data column added.');
    } catch (err) {
      if (err.message.includes('Duplicate column name')) {
        console.log('Notifications data column already exists.');
      } else {
        console.error('Error adding notifications data column:', err.message);
      }
    }

    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}

migrate();
