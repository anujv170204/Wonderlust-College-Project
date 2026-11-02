import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  Search, 
  SlidersHorizontal,
  Home,
  Building,
  Hotel,
  Palmtree,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';

const CATEGORIES = [
  { label: 'All', icon: Sparkles },
  { label: 'Hotel', icon: Hotel },
  { label: 'Villa', icon: Home },
  { label: 'Apartment', icon: Building },
  { label: 'Resort', icon: Palmtree },
  { label: 'Cottage', icon: Home },
];

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const selectedCategory = searchParams.get('type') || 'All';
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const fetchProperties = async (signal) => {
    setLoading(true); setError(null);
    try {
      const res = await API.get('/properties', { params: Object.fromEntries(searchParams), signal });
      if (!signal?.aborted) setProperties(res.data.data || []);
    } catch (err) {
      if (!signal?.aborted) setError(err.message || 'Failed to load properties.');
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    const controller = new AbortController();
    fetchProperties(controller.signal);
    return () => controller.abort();
  }, [searchParams]);
  const applyFilters = (category = selectedCategory) => {
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (category !== 'All') params.type = category;
    if (minPrice !== '') params.minPrice = minPrice;
    if (maxPrice !== '') params.maxPrice = maxPrice;
    setSearchParams(params);
  };
  const handleSearchSubmit = e => { e.preventDefault(); applyFilters(); };
  const handleResetFilters = () => {
    setSearchTerm(''); setMinPrice(''); setMaxPrice(''); setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Stays & Properties
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Find a stay that fits your plans.
          </p>
        </div>

        {/* Live Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city, country, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter Bar: Categories + Price Range */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => applyFilters(cat.label)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Price Range Filter Form */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 hidden sm:inline">Price:</span>
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => applyFilters()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Filter
            </button>
            {(minPrice || maxPrice || searchTerm || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
          <p className="text-sm font-bold text-rose-700">{error}</p>
          <button
            onClick={() => fetchProperties()}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      ) : properties.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No matching properties found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any stays matching your filters. Try clearing your search keyword or expanding your price range.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="property-grid grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Image */}
              <div className="property-image relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={property.image}
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                
                {/* Type Badge */}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm">
                  {property.propertyType}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      {property.location}, {property.country || 'India'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      {property.rating ? property.rating.toFixed(1) : '5.0'} ({property.numReviews || property.reviews?.length || 0})
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {property.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Up to {property.guests} guests · {property.bedrooms} bed · {property.bathrooms} bath
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-slate-900">
                      ₹{property.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-normal"> / night</span>
                  </div>

                  <Link
                    to={`/properties/${property._id}`}
                    className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
