const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ 
      product: productId, 
      isApproved: true 
    })
      .populate('user', 'firstName lastName avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ 
      product: productId, 
      isApproved: true 
    });

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { product: productId, isApproved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      ratingStats,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, orderId, rating, title, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      orderStatus: 'delivered'
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Order not found or not delivered yet'
      });
    }

    // Check if user purchased this product in the order
    const orderedProduct = order.items.find(item => 
      item.product.toString() === productId
    );

    if (!orderedProduct) {
      return res.status(400).json({
        success: false,
        message: 'You can only review products you have purchased'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      product: productId,
      order: orderId,
      rating,
      title,
      comment,
      isVerifiedPurchase: true
    });

    // Update product rating
    const reviews = await Review.find({ product: productId, isApproved: true });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    product.rating.average = avgRating;
    product.rating.count = reviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Update product rating if rating changed
    if (req.body.rating) {
      const product = await Product.findById(review.product);
      const reviews = await Review.find({ product: review.product, isApproved: true });
      const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

      product.rating.average = avgRating;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product, isApproved: true });
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      product.rating.average = avgRating;
      product.rating.count = reviews.length;
    } else {
      product.rating.average = 0;
      product.rating.count = 0;
    }
    
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markReviewHelpful = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { isHelpful } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already voted
    const existingVote = review.votedBy.find(vote => 
      vote.user.toString() === req.user.id
    );

    if (existingVote) {
      // Update existing vote
      existingVote.isHelpful = isHelpful;
    } else {
      // Add new vote
      review.votedBy.push({
        user: req.user.id,
        isHelpful
      });
    }

    // Recalculate helpful votes
    review.helpfulVotes = review.votedBy.filter(vote => vote.isHelpful).length;

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Vote recorded successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful
};
