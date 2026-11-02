import mongoose from 'mongoose';

/**
 * Connects to MongoDB using Mongoose.
 * Implements connection event listeners for robustness during viva/demonstration.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[WonderLust DB] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[WonderLust DB] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[WonderLust DB] MongoDB disconnected. Attempting reconnection...');
});

mongoose.connection.on('reconnected', () => {
  console.log('[WonderLust DB] MongoDB reconnected.');
});
