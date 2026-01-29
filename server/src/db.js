import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DB_NAME || !DB_USER || !DB_HOST || !DB_PORT) {
  console.error("Missing required database environment variables");
  process.exit(1);
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD || null, {
  host: DB_HOST || '127.0.0.1',
  port: DB_PORT,
  dialect: 'mysql',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

export { sequelize };

connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
