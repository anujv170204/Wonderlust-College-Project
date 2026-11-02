import test from 'node:test';
import assert from 'node:assert/strict';
import {authorize} from '../src/middleware/authMiddleware.js';
import {registerUser,loginUser} from '../src/controllers/authController.js';
import {cancelBooking} from '../src/controllers/bookingController.js';
import User from '../src/models/User.js';
import Property from '../src/models/Property.js';
import Booking from '../src/models/Booking.js';
const response=()=>({code:200,body:null,status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
test('Listing and dashboard role gates reject users and hosts from admin routes',()=>{
 for(const role of ['user','host','admin']){let allowed=false;const res=response();authorize('host','admin')({user:{role}},res,()=>allowed=true);assert.equal(allowed,role!=='user');allowed=false;authorize('admin')({user:{role}},res,()=>allowed=true);assert.equal(allowed,role==='admin');}
});
test('Public signup cannot create admin; login selection must match stored role',async()=>{
 const find=User.findOne,create=User.create,exists=User.exists;
 try{
 User.findOne=async()=>null;User.exists=async()=>false;User.create=async data=>{assert.equal(data.role,'user');return {...data,_id:'123'};};
 const res=response();await registerUser({body:{name:'Test',email:'test@example.com',password:'password',role:'admin',phone:'8850422889'}},res);assert.equal(res.code,201);assert.equal(res.body.data.role,'user');
 User.findOne=async()=>({_id:'123',role:'host',matchPassword:async()=>true});const denied=response();await loginUser({body:{email:'test@example.com',password:'password',role:'admin'}},denied);assert.equal(denied.code,401);
 }finally{User.findOne=find;User.create=create;User.exists=exists;}
});
test('Host may cancel own property reservation but not another host reservation',async()=>{
 const bf=Booking.findById,pf=Property.findById;let saved=false;
 try{
 Booking.findById=async()=>({user:'guest',property:'property',save:async()=>{saved=true;}});
 Property.findById=async()=>({owner:'host-a'});
 const denied=response();await cancelBooking({params:{id:'507f1f77bcf86cd799439011'},user:{_id:'host-b',role:'host'}},denied);assert.equal(denied.code,403);assert.equal(saved,false);
 const allowed=response();await cancelBooking({params:{id:'507f1f77bcf86cd799439011'},user:{_id:'host-a',role:'host'}},allowed);assert.equal(allowed.code,200);assert.equal(saved,true);
 }finally{Booking.findById=bf;Property.findById=pf;}
});
