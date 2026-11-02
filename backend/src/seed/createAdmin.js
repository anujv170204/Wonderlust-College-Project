import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import User from '../models/User.js';
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });
try {
 const {MONGO_URI,ADMIN_EMAIL,ADMIN_PASSWORD}=process.env;
 const email=String(ADMIN_EMAIL||'').trim().toLowerCase();
 if (!MONGO_URI || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ADMIN_PASSWORD || ADMIN_PASSWORD.length<6)
  throw new Error('Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD (minimum 6 characters).');
 await mongoose.connect(MONGO_URI);
 if (await User.exists({email})) throw new Error('Email already exists.');
 await User.create({name:process.env.ADMIN_NAME||'Website Admin',email,password:ADMIN_PASSWORD,role:'admin'});
 console.log('Admin created. Sign in with email.');
} catch(e) {console.error(e.message);process.exitCode=1;} finally {await mongoose.disconnect();}
