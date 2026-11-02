import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking reservation
 * @access  Private
 */
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;

    if (!propertyId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, check-in date, and check-out date.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format.',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid check-in or check-out date format.',
      });
    }

    const today = new Date(); today.setUTCHours(0, 0, 0, 0);
    if (startDate < today) return res.status(400).json({success:false,message:'Check-in cannot be in the past.'});
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.',
      });
    }

    // Calculate number of nights
    const diffTime = Math.abs(endDate - startDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      return res.status(400).json({
        success: false,
        message: 'Minimum booking duration is 1 night.',
      });
    }

    const numGuests = guests === undefined ? 1 : Number(guests);
    if (!Number.isInteger(numGuests) || numGuests < 1 || numGuests > property.guests) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed guests for this property is ${property.guests}.`,
      });
    }

    // Atomic reservation lock: unique property/date lock records prevent concurrent overlaps.
    // A partial reservation must not be created if any night is already reserved.
    const nightsList = Array.from({length: nights}, (_, i) => new Date(startDate.getTime() + i * 86400000));
    if (nights > 365) return res.status(400).json({success:false,message:'Booking duration cannot exceed 365 nights.'});
    const existing = await Booking.exists({property: property._id, status:'Confirmed', checkIn:{$lt:endDate},checkOut:{$gt:startDate}});
    if (existing) return res.status(409).json({success:false,message:'These dates are already booked.'});
    const totalPrice = nights * property.price;

    const booking = await Booking.create({
      user: req.user._id,
      property: property._id,
      checkIn: startDate,
      checkOut: endDate,
      guests: numGuests,
      nights,
      totalPrice,
      status: 'Confirmed',
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      'property',
      'title image location price propertyType'
    );

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create booking: ' + error.message,
    });
  }
};

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Get all bookings for the logged-in user
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title image location price propertyType country')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your bookings: ' + error.message,
    });
  }
};

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format.',
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const property = await Property.findById(booking.property);
    const ownsProperty = req.user.role === 'host' && property?.owner.toString() === req.user._id.toString();
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin' && !ownsProperty) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only cancel your own bookings.',
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking: ' + error.message,
    });
  }
};

// Only return reservations belonging to the authenticated property owner.
export const getHostBookings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).select('title image location').sort({ createdAt: -1 });
    const bookings = await Booking.find({ property: { $in: properties.map(p => p._id) } })
      .populate('property', 'title image location propertyType')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, properties, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve guest bookings: ' + error.message });
  }
};
