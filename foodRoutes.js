import express from 'express';
import { getFoodByRestaurant, createFood } from '../controllers/foodController.js';
import { protect, restaurantOwner } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/restaurant/:restaurantId')
  .get(getFoodByRestaurant);

router.route('/')
  .post(protect, restaurantOwner, upload.single('image'), createFood);

export default router;
