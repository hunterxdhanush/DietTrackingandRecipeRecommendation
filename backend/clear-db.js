const pool = require('./config/database');

const clearDatabase = async () => {
  try {
    console.log('Starting database cleanup...');
    
    // Delete all food logs
    await pool.query('DELETE FROM food_logs');
    console.log('✓ Cleared food_logs table');
    
    // Delete all daily goals
    await pool.query('DELETE FROM daily_goals');
    console.log('✓ Cleared daily_goals table');
    
    // Delete all users
    await pool.query('DELETE FROM users');
    console.log('✓ Cleared users table');
    
    // Reset sequences (auto-increment)
    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE daily_goals_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE food_logs_id_seq RESTART WITH 1');
    console.log('✓ Reset ID sequences');
    
    console.log('\n✅ Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
