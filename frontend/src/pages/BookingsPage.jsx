import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import API from '../services/api';

export const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/bookings/my-bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading your reservations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            User Dashboard — My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your upcoming stays, past trips, and reservation details.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <span>Find Another Stay</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">{[['Total Bookings',bookings.length],['Confirmed',bookings.filter(b=>b.status==='Confirmed').length],['Cancelled',bookings.filter(b=>b.status==='Cancelled').length]].map(([label,count])=><div key={label} className="bg-white border rounded-xl p-4"><p className="text-xs text-slate-500">{label}</p><p className="text-2xl font-bold mt-2">{count}</p></div>)}</div>
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Reservations Yet</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            You haven't booked any stays yet. Explore our handpicked properties and book your first trip!
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Explore Properties Now</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
            >
              {/* Property Image & Details */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={booking.property?.image}
                    alt={booking.property?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {booking.property?.propertyType || 'Stay'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-500" />
                      {booking.property?.location}
                    </span>
                  </div>

                  <Link
                    to={`/properties/${booking.property?._id}`}
                    className="font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors block"
                  >
                    {booking.property?.title || 'Property Reservation'}
                  </Link>

                  <p className="text-xs text-slate-500">
                    {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'} · {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>
              </div>

              {/* Dates & Pricing */}
              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
                
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Dates</p>
                  <p className="font-semibold text-slate-800">
                    {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Price</p>
                  <p className="font-bold text-indigo-600">
                    ₹{booking.totalPrice?.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col gap-1.5 items-end">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {booking.status === 'Confirmed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span>{booking.status}</span>
                  </span>

                  {booking.status === 'Confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
