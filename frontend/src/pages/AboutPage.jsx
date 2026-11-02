import React from 'react';
import { Compass, GraduationCap, Code2, Database, ShieldCheck, Cpu, User } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>BSc Computer Science Final Year Project</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          About WonderLust
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          An enterprise-ready hotel & property reservation platform designed for modularity, clean architecture, and rigorous viva evaluation.
        </p>
      </div>

      {/* Owner & Customer Support Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Project Leadership</span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <span>Owner & Developer: Anuj Vishwakarma</span>
          </h3>
          <p className="text-xs text-slate-500">
            BSc Computer Science student project focused on modern MERN full-stack development.
          </p>
        </div>

      </div>

      {/* Tech Stack Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">Modern Frontend</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Built with React 18, Vite, and Tailwind CSS. Component-driven design, responsive grid layouts, and unified Axios interceptors.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">RESTful Express API</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Node.js & Express server with structured controllers, route middleware, centralized error handling, and JWT token authentication.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">MongoDB & Mongoose</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Schema-driven database design enforcing date validation, overlap prevention algorithms, cascading references, and review aggregates.
          </p>
        </div>
      </div>

      {/* College Project Architecture Details */}
      <div className="p-8 rounded-2xl bg-slate-900 text-white space-y-4">
        <h2 className="text-xl font-bold">Academic Objectives & Scope</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          The goal of this project is to simulate real-world e-commerce booking flows without relying on proprietary or proprietary-dependent third party services. It covers end-to-end data lifecycle: User Registration, Role-Based Access Control (Guest, Host, Admin), Listing CRUD, Dynamic Search & Filter, Date Overlap Validation, Simulated Checkout, and Verified Stay Reviews.
        </p>
      </div>

    </div>
  );
};
