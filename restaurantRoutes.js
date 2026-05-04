import express from 'express';
import { getRestaurants, getRestaurantById, createRestaurant } from '../controllers/restaurantController.js';
import { protect, restaurantOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, restaurantOwner, createRestaurant);

router.route('/:id').get(getRestaurantById);

export default router;
