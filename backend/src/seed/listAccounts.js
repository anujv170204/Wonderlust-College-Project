import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Property from '../models/Property.js';
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });
if (!process.env.MONGO_URI || !/localhost|127\.0\.0\.1/.test(process.env.MONGO_URI)) {
  console.error('For safety, only local MongoDB URIs are supported.'); process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGO_URI);
  for (const u of await User.find({role:{$in:['host','admin']}}).select('name email role').lean()) {
    const properties = u.role === 'host' ? await Property.find({owner:u._id}).select('title').lean() : [];
    console.log(JSON.stringify({role:u.role,name:u.name,email:u.email,properties:properties.map(p=>p.title)}));
  }
} finally {await mongoose.disconnect();}
