import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    price: {
      type: Number,
      required: [true, 'Please add price per night'],
      min: 0,
    },
    location: {
      type: String,
      required: [true, 'Please add city/location'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
      trim: true,
      default: 'India',
    },
    propertyType: {
      type: String,
      required: [true, 'Please select a property type'],
      enum: ['Hotel', 'Villa', 'Apartment', 'Resort', 'House', 'Hostel', 'Cottage'],
    },
    guests: {
      type: Number,
      required: [true, 'Please add max guests capacity'],
      min: 1,
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please add number of bedrooms'],
      min: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please add number of bathrooms'],
      min: 1,
    },
    amenities: {
      type: [String],
      default: ['Wi-Fi', 'Air Conditioning'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;
