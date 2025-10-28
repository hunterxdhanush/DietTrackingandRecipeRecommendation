const pool = require('./config/database');

const addBmiHistoryTable = async () => {
  try {
    console.log('Adding BMI history table...');
    
    // Create BMI history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bmi_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        height DECIMAL(5,2) NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        bmi DECIMAL(5,2) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_bmi_history_user_date 
      ON bmi_history(user_id, recorded_at DESC)
    `);
    
    console.log('✅ BMI history table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addBmiHistoryTable();
