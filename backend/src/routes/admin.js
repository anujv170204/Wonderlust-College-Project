import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(protect, authorize('admin'));
router.get('/dashboard', async (req,res,next) => {
 try {
  const [users,properties,bookings] = await Promise.all([
   User.find().select('-password').sort({createdAt:-1}),
   Property.find().populate('owner','name email role').sort({createdAt:-1}),
   Booking.find().populate('user','name email').populate('property','title location owner').sort({createdAt:-1})
  ]);
  res.json({success:true,data:{users,properties,bookings}});
 } catch(e) {next(e);}
});
router.put('/users/:id', async (req,res,next) => {
 try {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({message:'Invalid user ID.'});
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({message:'User not found.'});
  const {name,email,role} = req.body;
  if (role && !['user','host','admin'].includes(role)) return res.status(400).json({message:'Invalid role.'});
  if (role && role !== user.role) {
   if (user._id.equals(req.user._id)) return res.status(400).json({message:'You cannot change your own admin role.'});
   if (role === 'user' && await Property.exists({owner:user._id})) return res.status(400).json({message:'Remove this account’s listings before changing it to user.'});
  }
  if (name !== undefined) user.name = name;
  if (email !== undefined) { const next=String(email).trim().toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) return res.status(400).json({message:'Invalid email.'}); if (await User.exists({email:next,_id:{$ne:user._id}})) return res.status(409).json({message:'Email taken.'}); user.email=next; }
  if (role) user.role = role;
  await user.save();
  res.json({success:true,data:{_id:user._id,name:user.name,email:user.email,role:user.role}});
 } catch(e) {next(e);}
});
router.delete('/users/:id', async (req,res,next) => {
 try {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({message:'Invalid user ID.'});
  if (req.user._id.equals(req.params.id)) return res.status(400).json({message:'You cannot delete your own admin account.'});
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({message:'User not found.'});
  if (await Property.exists({owner:user._id}) || await Booking.exists({user:user._id})) return res.status(400).json({message:'This account has listings or booking history. Its records must be retained.'});
  await user.deleteOne(); res.json({success:true});
 } catch(e) {next(e);}
});
export default router;
