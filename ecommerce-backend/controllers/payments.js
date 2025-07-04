const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paisa
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        orderId: orderId || '',
        userId: req.user.id
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID // Send public key for frontend
      }
    });
  } catch (error) {
    console.error('Razorpay error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing error'
    });
  }
};

// @desc    Verify payment signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is valid
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.user.toString() === req.user.id) {
          order.paymentInfo.status = 'completed';
          order.paymentInfo.transactionId = razorpay_payment_id;
          order.paymentInfo.razorpayOrderId = razorpay_order_id;
          order.paymentInfo.paidAt = new Date();
          
          // Update order status to confirmed
          if (order.orderStatus === 'pending') {
            order.orderStatus = 'confirmed';
            order.statusHistory.push({
              status: 'confirmed',
              note: 'Payment confirmed'
            });
          }
          
          await order.save();
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          razorpay_order_id,
          razorpay_payment_id
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification error'
    });
  }
};

// @desc    Handle Razorpay webhook
// @route   POST /api/payments/webhook
// @access  Public
const webhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookSignature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature if secret is provided
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (webhookSignature !== expectedSignature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }
    }

    const event = req.body.event;
    const payment = req.body.payload.payment.entity;

    switch (event) {
      case 'payment.captured':
        console.log('Payment captured:', payment.id);
        
        // Update order status if order details are available
        if (payment.notes && payment.notes.orderId) {
          try {
            const order = await Order.findById(payment.notes.orderId);
            if (order) {
              order.paymentInfo.status = 'completed';
              order.paymentInfo.transactionId = payment.id;
              order.paymentInfo.paidAt = new Date();
              
              if (order.orderStatus === 'pending') {
                order.orderStatus = 'confirmed';
                order.statusHistory.push({
                  status: 'confirmed',
                  note: 'Payment captured via webhook'
                });
              }
              
              await order.save();
            }
          } catch (error) {
            console.error('Error updating order:', error);
          }
        }
        break;

      case 'payment.failed':
        console.log('Payment failed:', payment.id);
        
        // Update order status if order details are available
        if (payment.notes && payment.notes.orderId) {
          try {
            const order = await Order.findById(payment.notes.orderId);
            if (order) {
              order.paymentInfo.status = 'failed';
              await order.save();
            }
          } catch (error) {
            console.error('Error updating order:', error);
          }
        }
        break;

      default:
        console.log(`Unhandled event type ${event}`);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error'
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
const getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  webhook,
  getPaymentDetails
};
