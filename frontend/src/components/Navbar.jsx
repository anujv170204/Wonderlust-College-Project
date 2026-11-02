import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Menu, X, Compass} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
export const Navbar = () => {
 const {user,logout}=useAuth(); const [open,setOpen]=useState(false);const navigate=useNavigate();
 const links=[['Home','/'],['Explore','/explore'],['About','/about']];
 if(user?.role==='admin') links.push(['Admin Dashboard','/admin'],['Add Property','/host/add-property']);
 else if(user?.role==='host') links.push(['Host Dashboard','/host/dashboard'],['Guest Bookings','/host/bookings'],['Add Property','/host/add-property']);
 else if(user) links.push(['My Dashboard','/bookings']);
 else links.push(['Login','/login'],['Register','/register']);
 const items=links.map(([label,path])=><Link key={path} to={path} onClick={()=>setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600">{label}</Link>);
 const exit=<button onClick={()=>{logout();setOpen(false);navigate('/');}} className="px-3 py-2 text-sm text-rose-600">Sign Out</button>;
 return <header className="sticky top-0 z-50 bg-white border-b"><div className="max-w-7xl mx-auto px-4 flex items-center justify-between min-h-16"><Link to="/" className="text-xl font-extrabold text-indigo-600 flex items-center gap-2"><Compass/>WonderLust</Link><nav className="hidden xl:flex items-center gap-1">{items}{user&&<><span className="text-xs px-2">{user.name} · {user.role}</span>{exit}</>}</nav><button className="xl:hidden p-2" aria-label="Toggle navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>{open&&<nav className="xl:hidden flex flex-col p-4 border-t">{items}{user&&exit}</nav>}</header>;
};
