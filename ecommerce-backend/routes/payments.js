const express = require('express');
const {
  createPaymentOrder,
  verifyPayment,
  webhook,
  getPaymentDetails
} = require('../controllers/payments');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Webhook endpoint (must be before other middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

// Protected routes
router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/:paymentId', getPaymentDetails);

module.exports = router;
