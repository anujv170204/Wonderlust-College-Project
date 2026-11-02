import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import User from '../models/User.js';
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });
try {
 if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in .env first.');
 await mongoose.connect(process.env.MONGO_URI);
 const users=await User.find({$or:[{email:{$exists:false}},{email:null},{email:''}]}).sort({_id:1});
 for(const user of users) {
   const candidate = String(user.username||'').toLowerCase();
   const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : `legacy-${user._id}@example.invalid`;
   user.email=email; await user.save();
   console.log('Migrated account:',String(user._id),email.endsWith('.invalid')?'(placeholder email; update before login)':'');
 }
 const indexes=await User.collection.indexes();
 const usernameIndex=indexes.find(i=>i.name==='username_1');
 if(usernameIndex) {await User.collection.dropIndex('username_1');console.log('Removed obsolete username index.');}
 console.log('Migration complete. Update placeholder emails in database before logging into legacy accounts.');
} catch(e){console.error(e.message);process.exitCode=1;}finally{await mongoose.disconnect();}
