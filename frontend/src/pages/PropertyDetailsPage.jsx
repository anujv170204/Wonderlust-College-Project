import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  ArrowLeft, 
  Users, 
  Bed, 
  Bath, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  User, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  AlertCircle,
  Clock
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Form State
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  // Fetch Property Details
  const fetchProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/properties/${id}`);
      setProperty(res.data.data);
    } catch (err) {
      setError(err.message || 'Property not found or invalid ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  // Calculate Nights & Total
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();
  const totalPrice = property ? nights * property.price : 0;

  // Handle Booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setBookingError('Check-out date must be after check-in date.');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await API.post('/bookings', {
        propertyId: id,
        checkIn,
        checkOut,
        guests: Number(guests),
      });
      setBookingSuccess('Reservation confirmed! Check My Bookings for details.');
    } catch (err) {
      setBookingError(err.message || 'Failed to confirm booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/properties/${id}` } } });
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError('Please enter a review comment.');
      return;
    }

    setReviewLoading(true);
    try {
      const res = await API.post(`/properties/${id}/reviews`, {
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
      });
      setProperty(res.data.data);
      setReviewComment('');
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Handle Delete Property (Owner only)
  const handleDeleteProperty = async () => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) {
      return;
    }
    try {
      await API.delete(`/properties/${id}`);
      navigate('/explore');
    } catch (err) {
      alert(err.message || 'Failed to delete property.');
    }
  };

  // Is current logged in user the owner of this property?
  const isOwner = user && property && property.owner && (
    (property.owner._id && property.owner._id === user._id) ||
    property.owner === user._id ||
    user.role === 'admin'
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Property Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The listing you are looking for does not exist or may have been removed.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Properties</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link & Owner Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all stays</span>
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/properties/${id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Edit Listing</span>
            </Link>
            <button
              onClick={handleDeleteProperty}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Image Showcase */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-sm bg-slate-100">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-md">
          {property.propertyType}
        </div>
      </div>

      {/* Details & Booking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{property.location}, {property.country || 'India'}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                {property.rating ? property.rating.toFixed(1) : '5.0'} ({property.numReviews || property.reviews?.length || 0} reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {property.title}
            </h1>

            {/* Quick Specs */}
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>{property.guests} Guests max</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-indigo-500" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-indigo-500" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
            </div>
          </div>

          {/* Host Info */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              {property.owner?.name ? property.owner.name.charAt(0).toUpperCase() : 'H'}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hosted by</p>
              <h3 className="text-sm font-bold text-slate-900">
                {property.owner?.name || 'Verified WonderLust Host'}
              </h3>
              <p className="text-xs text-slate-500">{property.owner?.email || 'Verified host'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">About this place</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <h3 className="text-base font-bold text-slate-900">What this place offers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Standard amenities provided.</p>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 border-t border-slate-200 pt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span>Guest Reviews ({property.reviews?.length || 0})</span>
              </h3>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{property.rating ? property.rating.toFixed(1) : '5.0'} / 5.0</span>
              </div>
            </div>

            {/* Existing Reviews List */}
            {property.reviews && property.reviews.length > 0 ? (
              <div className="space-y-4">
                {property.reviews.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {rev.name ? rev.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to review after booking!</p>
            )}

            {/* Add Review Form */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Leave a Review</h4>
              {reviewError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {reviewError}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-600">Your Rating:</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                    <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3 - Average)</option>
                    <option value="2">⭐⭐ (2 - Poor)</option>
                    <option value="1">⭐ (1 - Terrible)</option>
                  </select>
                </div>

                <textarea
                  rows="3"
                  placeholder="Share your experience staying at this property..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 bg-white"
                ></textarea>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  {reviewLoading ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Right Column: Interactive Booking Card */}
        <div>
          <div className="sticky top-24 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
            
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹{property.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-normal"> / night</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{property.rating ? property.rating.toFixed(1) : '5.0'}</span>
              </div>
            </div>

            {/* Booking Feedback Alerts */}
            {bookingSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bookingSuccess} <Link className="underline" to="/bookings">View bookings</Link></span>
              </div>
            )}

            {bookingError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}


            {/* Booking Form */}
            <form onSubmit={handleBooking} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="p-2.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Check-in
                  </label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none mt-1"
                  />
                </div>

                <div className="p-2.5 border-l border-slate-200">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Check-out
                  </label>
                  <input
                    type="date"
                    required
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:border-indigo-500"
                >
                  {[...Array(property.guests || 1)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>₹{property.price.toLocaleString('en-IN')} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="font-semibold text-slate-800">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Simulated Booking Fee</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading || !!bookingSuccess}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {bookingLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Book Now</span>
                )}
              </button>
            </form>

            <div className="text-center text-[11px] text-slate-400">
              College demo reservation · No real payment charged
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
