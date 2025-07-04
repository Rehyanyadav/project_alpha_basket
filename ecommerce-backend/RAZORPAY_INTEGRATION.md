# Razorpay Integration Guide

## Overview
The ecommerce backend now uses Razorpay instead of Stripe for payment processing. Razorpay is a popular payment gateway in India that supports various payment methods including UPI, Net Banking, Cards, and Wallets.

## Environment Variables Required
```bash
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret (optional)
```

## API Endpoints

### 1. Create Payment Order
**POST** `/api/payments/create-order`

Creates a Razorpay order for payment processing.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "amount": 500.00,
  "currency": "INR",
  "orderId": "order_id_from_your_database"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_MQrCfJIkUmKzA1",
    "amount": 50000,
    "currency": "INR",
    "key": "rzp_test_xxxxx"
  }
}
```

### 2. Verify Payment
**POST** `/api/payments/verify`

Verifies the payment signature after successful payment.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "razorpay_order_id": "order_MQrCfJIkUmKzA1",
  "razorpay_payment_id": "pay_MQrCgVhGOFIcsZ",
  "razorpay_signature": "signature_hash",
  "orderId": "your_order_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "razorpay_order_id": "order_MQrCfJIkUmKzA1",
    "razorpay_payment_id": "pay_MQrCgVhGOFIcsZ"
  }
}
```

### 3. Get Payment Details
**GET** `/api/payments/:paymentId`

Retrieves payment details from Razorpay.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pay_MQrCgVhGOFIcsZ",
    "amount": 50000,
    "currency": "INR",
    "status": "captured",
    "method": "card"
  }
}
```

### 4. Webhook Endpoint
**POST** `/api/payments/webhook`

Handles Razorpay webhooks for payment events.

**Note:** This endpoint does not require authentication and should be configured in your Razorpay dashboard.

## Payment Flow

1. **Frontend creates order** in your system
2. **Call create-order endpoint** to get Razorpay order details
3. **Frontend integrates Razorpay checkout** using the order details
4. **User completes payment** through Razorpay
5. **Frontend calls verify endpoint** with payment response
6. **Backend verifies signature** and updates order status
7. **Webhook handles** additional payment events (optional)

## Payment Methods Supported

- `card` - Credit/Debit Cards
- `upi` - UPI payments
- `netbanking` - Net Banking
- `wallet` - Digital Wallets (Paytm, PhonePe, etc.)
- `razorpay` - General Razorpay payment
- `cash_on_delivery` - Cash on Delivery

## Frontend Integration Example

```javascript
// 1. Create order
const orderResponse = await fetch('/api/payments/create-order', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 500.00,
    currency: 'INR',
    orderId: 'your_order_id'
  })
});

const orderData = await orderResponse.json();

// 2. Initialize Razorpay checkout
const options = {
  key: orderData.data.key,
  amount: orderData.data.amount,
  currency: orderData.data.currency,
  order_id: orderData.data.id,
  handler: async function(response) {
    // 3. Verify payment
    await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderId: 'your_order_id'
      })
    });
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

## Security Notes

- Always verify payment signatures on the backend
- Use HTTPS for all payment-related endpoints
- Store sensitive credentials in environment variables
- Implement proper error handling for failed payments
- Use webhooks for reliable payment status updates
