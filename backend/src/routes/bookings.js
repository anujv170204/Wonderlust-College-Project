import express from 'express';
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.route('/')
  .post(authorize('user', 'host', 'admin'), createBooking);

router.get('/my-bookings', getMyBookings);
router.get('/host-bookings', authorize('host', 'admin'), getHostBookings);
router.put('/:id/cancel', cancelBooking);

export default router;
