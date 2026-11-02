import mongoose from 'mongoose';
import Property from '../models/Property.js';

/**
 * @route   GET /api/properties
 * @desc    Get all properties with optional search and filters
 * @access  Public
 */
export const getProperties = async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice } = req.query;

    const query = {};

    // Search by city, location, country, or title
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { location: searchRegex },
        { country: searchRegex },
        { title: searchRegex },
      ];
    }

    // Filter by Property Type
    if (type && type !== 'All') {
      query.propertyType = new RegExp(`^${type.trim()}$`, 'i');
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(minPrice)) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(maxPrice)) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve properties: ' + error.message,
    });
  }
};

/**
 * @route   GET /api/properties/:id
 * @desc    Get single property by ID
 * @access  Public
 */
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format.',
      });
    }

    const property = await Property.findById(id).populate('owner', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve property details: ' + error.message,
    });
  }
};

/**
 * @route   POST /api/properties
 * @desc    Create a new property listing
 * @access  Private (Logged-in users)
 */
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      price,
      location,
      country,
      propertyType,
      guests,
      bedrooms,
      bathrooms,
      amenities,
    } = req.body;

    if (
      !title ||
      !description ||
      !image ||
      !price ||
      !location ||
      !propertyType ||
      !guests ||
      !bedrooms ||
      !bathrooms
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required property fields.',
      });
    }

    const property = await Property.create({
      title,
      description,
      image,
      price: Number(price),
      location,
      country: country || 'India',
      propertyType,
      guests: Number(guests),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      amenities: Array.isArray(amenities)
        ? amenities
        : typeof amenities === 'string'
        ? amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
      owner: req.user._id,
      rating: 5.0,
      numReviews: 0,
      reviews: [],
    });

    res.status(201).json({
      success: true,
      message: 'Property listed successfully!',
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create property: ' + error.message,
    });
  }
};

/**
 * @route   PUT /api/properties/:id
 * @desc    Update a property listing (Owner only)
 * @access  Private
 */
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format.',
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit properties you created.',
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      Object.fromEntries(['title','description','image','price','location','country','propertyType','guests','bedrooms','bathrooms','amenities'].filter(key => req.body[key] !== undefined).map(key => [key, req.body[key]])),
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Property updated successfully.',
      data: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update property: ' + error.message,
    });
  }
};

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete a property listing (Owner only)
 * @access  Private
 */
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format.',
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Verify ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete properties you created.',
      });
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Property deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete property: ' + error.message,
    });
  }
};

/**
 * @route   POST /api/properties/:id/reviews
 * @desc    Add a review & rating to a property
 * @access  Private
 */
export const createPropertyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format.',
      });
    }

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a rating (1-5) and a review comment.',
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = property.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this property.',
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
    };

    property.reviews.push(review);
    property.numReviews = property.reviews.length;
    property.rating =
      property.reviews.reduce((acc, item) => item.rating + acc, 0) /
      property.reviews.length;

    await property.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully!',
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit review: ' + error.message,
    });
  }
};

/**
 * @route   GET /api/properties/user/my-properties
 * @desc    Get all properties created by the logged-in user
 * @access  Private
 */
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your properties: ' + error.message,
    });
  }
};
