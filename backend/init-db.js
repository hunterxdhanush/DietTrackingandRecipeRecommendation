const { createTables } = require('./config/schema');

const initDatabase = async () => {
  try {
    await createTables();
    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();
