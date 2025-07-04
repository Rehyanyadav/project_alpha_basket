const express = require('express');
const { body } = require('express-validator');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful
} = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(protect);

router.post('/', [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().notEmpty().withMessage('Review title is required'),
  body('comment').trim().notEmpty().withMessage('Review comment is required'),
], createReview);

router.put('/:id', [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
], updateReview);

router.delete('/:id', deleteReview);

router.post('/:id/helpful', [
  body('isHelpful').isBoolean().withMessage('isHelpful must be a boolean'),
], markReviewHelpful);

module.exports = router;
