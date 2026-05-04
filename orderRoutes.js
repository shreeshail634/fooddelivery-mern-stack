import express from 'express';
import { createOrder, getOrderById, updateOrderStatus, getMyOrders } from '../controllers/orderController.js';
import { protect, restaurantOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, restaurantOwner, updateOrderStatus);

export default router;
