import serverless from 'serverless-http';
import app from '../../src/index.js';
import { connectDB } from '../../src/config/database.js';

let dbConnected = false;

export const handler = async (event, context) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('📦 Database connected in serverless function');
    } catch (error) {
      console.error('Failed to connect to database in serverless function', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database connection failed' })
      };
    }
  }

  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};
