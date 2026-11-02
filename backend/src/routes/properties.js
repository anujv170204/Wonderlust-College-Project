import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  createPropertyReview,
  getMyProperties,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('host', 'admin'), createProperty);

router.get('/user/my-properties', protect, authorize('host', 'admin'), getMyProperties);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, authorize('host', 'admin'), updateProperty)
  .delete(protect, authorize('host', 'admin'), deleteProperty);

router.post('/:id/reviews', protect, createPropertyReview);

export default router;
