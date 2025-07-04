const express = require('express');
const { body } = require('express-validator');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getUserOrders
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrder);

router.post('/', [
  body('shippingAddress.firstName').trim().notEmpty().withMessage('First name is required'),
  body('shippingAddress.lastName').trim().notEmpty().withMessage('Last name is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('paymentInfo.method').isIn(['card', 'upi', 'netbanking', 'wallet', 'razorpay', 'cash_on_delivery']).withMessage('Invalid payment method'),
], createOrder);

router.put('/:id/cancel', cancelOrder);

// Admin routes
router.use(authorize('admin'));

router.get('/', getOrders);

router.put('/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid order status'),
], updateOrderStatus);

module.exports = router;
