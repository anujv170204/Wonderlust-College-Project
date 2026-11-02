import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image, MapPin, DollarSign, Home, Users, Bed, Bath, Sparkles, AlertCircle } from 'lucide-react';
import API from '../services/api';

const PROPERTY_TYPES = ['Hotel', 'Villa', 'Apartment', 'Resort', 'Cottage', 'House', 'Hostel'];

const AMENITY_OPTIONS = [
  'Wi-Fi',
  'Swimming Pool',
  'Air Conditioning',
  'Kitchen',
  'Parking',
  'TV',
  'Washing Machine',
  'Balcony',
  'Breakfast',
  'Pet Friendly',
];

const PRESET_IMAGES = [
  { label: 'Luxury Villa', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Boutique Hotel', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Apartment', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mountain Cottage', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Beach Resort', url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80' },
];

export const AddPropertyPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('India');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [guests, setGuests] = useState(2);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [amenities, setAmenities] = useState(['Wi-Fi', 'Air Conditioning']);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !image || !price || !location) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post('/properties', {
        title,
        description,
        image,
        price: Number(price),
        location,
        country,
        propertyType,
        guests: Number(guests),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        amenities,
      });

      const newId = res.data.data?._id;
      if (newId) {
        navigate(`/properties/${newId}`);
      } else {
        navigate('/explore');
      }
    } catch (err) {
      setError(err.message || 'Failed to create property listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Host a Stay</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          List Your Property on WonderLust
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Provide your property details and images to start welcoming guests.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Property Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Luxury Cliffside Villa with Ocean View"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              rows="4"
              required
              placeholder="Describe your place, surrounding attractions, view, and unique guest experience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Image URL & Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Image URL *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Quick Pick Image:</span>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(preset.url)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Preview image */}
            {image && (
              <div className="mt-3 relative aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Property Type & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Property Type *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-500"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Price Per Night (₹) *
              </label>
              <input
                type="number"
                required
                min="100"
                placeholder="e.g. 4500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Location & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City / Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mumbai, Goa, Jaipur"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Country *
              </label>
              <input
                type="text"
                required
                placeholder="India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Capacity Specs */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Max Guests *
              </label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Bedrooms *
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Bathrooms *
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-center focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Amenities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AMENITY_OPTIONS.map((amenity) => {
                const isChecked = amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                      isChecked
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Publish Property Listing</span>
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};
