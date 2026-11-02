import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import propertiesRouter from './routes/properties.js';
import bookingsRouter from './routes/bookings.js';
import adminRouter from './routes/admin.js';

// Load environment variables from .env
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

// Connect to MongoDB
// Start listening only after the database connection succeeds.

const app = express();

// Middlewares
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.some((allowed) => allowed.replace(/\/$/, '') === cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WonderLust API - Hotel & Property Booking Platform',
    version: '1.0.0',
    documentation: '/api/health for system status',
  });
});

// Mount Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_key_here') {
    console.error('Set MONGO_URI and a secure JWT_SECRET in backend/.env before starting.'); process.exitCode = 1; return;
  }
  await connectDB();
  const server = app.listen(PORT, '0.0.0.0', () => console.log(`[WonderLust API] Ready on port ${PORT}`));
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${PORT} is already occupied. Close the owning process or change PORT.` : error.message); process.exitCode = 1; });
}
start();
