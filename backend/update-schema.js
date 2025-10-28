const pool = require('./config/database');

const updateSchema = async () => {
  try {
    console.log('Updating database schema...');
    
    // Add new columns to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS country VARCHAR(100),
      ADD COLUMN IF NOT EXISTS age INTEGER,
      ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
      ADD COLUMN IF NOT EXISTS height DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS bmi DECIMAL(5,2)
    `);
    console.log('✓ Added new columns to users table');
    
    console.log('\n✅ Database schema updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
};

updateSchema();
