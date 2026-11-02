import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const publicUser = user => ({_id:user._id,name:user.name,email:user.email,role:user.role,token:generateToken(user._id)});
export const registerUser = async (req,res) => {
 try {
  const {name,password,role} = req.body;
  const email=String(req.body.email || '').trim().toLowerCase();
  if (!name?.trim() || !validEmail(email) || !password || password.length < 6)
   return res.status(400).json({success:false,message:'Enter name, valid email and password (at least 6 characters).'});
  if (await User.exists({email})) return res.status(409).json({success:false,message:'Email already registered.'});
  const user=await User.create({name:name.trim(),email,password,role:['user','host'].includes(role)?role:'user'});
  res.status(201).json({success:true,data:publicUser(user)});
 } catch(e) {res.status(e.code===11000?409:500).json({success:false,message:e.code===11000?'Email already registered.':'Registration failed.'});}
};
export const loginUser = async (req,res) => {
 try {
  const {password,role}=req.body;
  const email=String(req.body.email || '').trim().toLowerCase();
  if (!validEmail(email) || !password) return res.status(400).json({success:false,message:'Enter email and password.'});
  const user=await User.findOne({email});
  if (!user || !(await user.matchPassword(password)) || (role && user.role!==role))
   return res.status(401).json({success:false,message:'Invalid email or password.'});
  res.json({success:true,data:publicUser(user)});
 } catch(e) {res.status(500).json({success:false,message:'Unable to sign in.'});}
};
export const getUserProfile = async (req,res) => {
 const user=await User.findById(req.user._id).select('name email role createdAt');
 if(!user) return res.status(404).json({success:false,message:'User not found.'});
 res.json({success:true,data:user});
};
