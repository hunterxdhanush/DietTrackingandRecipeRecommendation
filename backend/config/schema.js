const pool = require('../config/database');

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Daily goals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        carbs INTEGER NOT NULL,
        fat INTEGER NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);

    // Food logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        food_name VARCHAR(255) NOT NULL,
        calories INTEGER NOT NULL,
        protein INTEGER NOT NULL,
        carbs INTEGER NOT NULL,
        fat INTEGER NOT NULL,
        meal_type VARCHAR(50),
        log_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_food_logs_user_date 
      ON food_logs(user_id, log_date)
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

module.exports = { createTables };
