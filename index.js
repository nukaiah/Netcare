import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import connectDb from './src/Utils/DbConfig.js';

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDb();
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`User Service running on ${PORT} 🚀`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();