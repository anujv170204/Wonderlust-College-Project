import React from 'react';
import { PlusCircle, ShieldCheck, DollarSign, Users, Sparkles, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BecomeHostPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Host Community</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Turn Your Property into an Income Stream
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          List your home, hotel, villa, or resort on WonderLust. Manage bookings, set seasonal prices, and welcome verified travelers.
        </p>
      </div>

      {/* Host Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">List Any Type of Property</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hotels, apartments, beach resorts, cottages, or penthouses. Upload images, specify amenities, and define house rules.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">Keep Your Earnings</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Set your nightly rate and manage availability calendars without hidden deductions. Track payout analytics on your host dashboard.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900">Verified Guest Reviews</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Only guests who complete verified reservations can review your property, ensuring transparent and constructive feedback.
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold">Ready to publish your first listing?</h2>
          <p className="text-xs text-indigo-100 mt-1">
            Create and manage your hotel, villa, or apartment listings today.
          </p>
        </div>
        <Link
          to="/host/add-property"
          className="px-5 py-2.5 rounded-full bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-indigo-50 transition-colors whitespace-nowrap"
        >
          Add Your Property Now
        </Link>
      </div>

    </div>
  );
};
