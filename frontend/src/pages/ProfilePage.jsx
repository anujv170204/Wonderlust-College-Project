import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, PlusCircle, CalendarCheck, Edit3, Trash2, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyProperties = async () => {
    setLoading(true); setError('');
    try {
      const res = await API.get('/properties/user/my-properties');
      setMyProperties(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role !== 'user') fetchMyProperties();
  }, []);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    try {
      await API.delete(`/properties/${id}`);
      if (user.role !== 'user') fetchMyProperties();
    } catch (err) {
      alert(err.message || 'Failed to delete property.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (user.role === 'user') return <div className="max-w-3xl mx-auto p-8"><h1 className="text-2xl font-bold">{user.name}</h1><p className="my-3">{user.email}</p><Link to="/bookings" className="text-indigo-600">My booking dashboard →</Link></div>;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-indigo-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-1 min-w-0 break-words">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {user?.role || 'Guest'}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 break-all">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
            <span>My Bookings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <Link to="/host/bookings" className="block bg-indigo-600 text-white rounded-2xl p-5 font-semibold">Host Bookings → <span className="block font-normal text-sm mt-1">See who booked your properties and reservation status.</span></Link>
      {/* Owned Properties Section */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Host Dashboard — Your Properties</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and edit your published stays.</p>
          </div>
          <Link
            to="/host/add-property"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Property</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-xs font-semibold text-slate-400">Loading your listings...</div>
        ) : error ? (<div role="alert" className="text-rose-700 bg-rose-50 rounded-xl p-5">{error}<button onClick={fetchMyProperties} className="block underline mt-2">Try again</button></div>) : myProperties.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <Home className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">You haven't listed any properties yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Want to become a host? Add your apartment, villa, or hotel to welcome travelers.
            </p>
            <Link
              to="/host/add-property"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-semibold text-xs hover:bg-indigo-100"
            >
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="property-grid grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {myProperties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="property-image relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/95 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-800">
                    {property.propertyType}
                  </span>
                </div>

                <div className="p-3 sm:p-4 space-y-2 flex-grow">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{property.title}</h3>
                  <p className="text-xs text-slate-500">{property.location}, {property.country}</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    ₹{property.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ night</span>
                  </p>
                </div>

                <div className="p-2 sm:p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between text-xs font-semibold">
                  <Link
                    to={`/properties/${property._id}`}
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    View
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Link
                      to={`/properties/${property._id}/edit`}
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProperty(property._id)}
                      className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
