const express = require('express');
const { body } = require('express-validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
} = require('../controllers/cart');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);

router.post('/add', [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
], addToCart);

router.put('/update/:itemId', [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
], updateCartItem);

router.delete('/remove/:itemId', removeFromCart);

router.delete('/clear', clearCart);

router.post('/coupon/apply', [
  body('couponCode').trim().notEmpty().withMessage('Coupon code is required'),
], applyCoupon);

router.delete('/coupon/remove', removeCoupon);

module.exports = router;
