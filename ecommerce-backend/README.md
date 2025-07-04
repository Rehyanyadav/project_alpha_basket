# E-commerce Backend API

A comprehensive e-commerce backend API built with Node.js, Express.js, and MongoDB. This API provides all the essential features needed for a modern e-commerce platform.

## 🚀 Features

### User Management
- User registration and authentication
- JWT-based authentication with secure cookies
- Password reset functionality
- User profile management
- Multiple address management
- Wishlist functionality

### Product Management
- CRUD operations for products
- Advanced product search and filtering
- Category and subcategory support
- Product images and variants
- Inventory management
- Featured products
- Product reviews and ratings

### Shopping Cart
- Add/remove items from cart
- Update item quantities
- Apply discount coupons
- Persistent cart across sessions

### Order Management
- Order creation and tracking
- Order status updates
- Order history
- Order cancellation
- Admin order management

### Payment Integration
- Stripe payment integration
- Payment intent creation
- Webhook handling for payment events
- Secure payment processing

### Security Features
- Input validation and sanitization
- Rate limiting
- CORS protection
- XSS protection
- NoSQL injection prevention
- Helmet for security headers

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe (for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

5. Create uploads directory:
```bash
mkdir uploads
```

6. Start the development server:
```bash
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

#### Login User
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
- **GET** `/auth/me`
- **Headers:** `Authorization: Bearer <token>`

### Product Endpoints

#### Get All Products
- **GET** `/products`
- **Query Parameters:**
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search term
  - `category`: Category ID
  - `sort`: Sort field (price, createdAt, rating.average)
  - `price[gte]`: Minimum price
  - `price[lte]`: Maximum price

#### Get Single Product
- **GET** `/products/:id`

#### Create Product (Admin)
- **POST** `/products`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "sku": "PROD001",
  "price": 99.99,
  "category": "category_id",
  "inventory": {
    "quantity": 100
  }
}
```

### Cart Endpoints

#### Get User Cart
- **GET** `/cart`
- **Headers:** `Authorization: Bearer <token>`

#### Add to Cart
- **POST** `/cart/add`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

#### Update Cart Item
- **PUT** `/cart/update/:itemId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "quantity": 2
}
```

### Order Endpoints

#### Create Order
- **POST** `/orders`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentInfo": {
    "method": "stripe"
  }
}
```

#### Get User Orders
- **GET** `/orders/my-orders`
- **Headers:** `Authorization: Bearer <token>`

### Category Endpoints

#### Get All Categories
- **GET** `/categories`

#### Get Category Tree
- **GET** `/categories/tree`

#### Create Category (Admin)
- **POST** `/categories`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic products"
}
```

### Review Endpoints

#### Get Product Reviews
- **GET** `/reviews/product/:productId`

#### Create Review
- **POST** `/reviews`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "productId": "product_id",
  "orderId": "order_id",
  "rating": 5,
  "title": "Great product!",
  "comment": "I love this product..."
}
```

### Payment Endpoints

#### Create Payment Intent
- **POST** `/payments/create-intent`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "amount": 99.99,
  "currency": "usd",
  "orderId": "order_id"
}
```

## 🗂 Project Structure

```
ecommerce-backend/
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # Mongoose models
├── routes/            # Express routes
├── utils/             # Utility functions
├── uploads/           # File uploads directory
├── server.js          # Main server file
├── package.json       # Dependencies
└── README.md          # Documentation
```

## 🔒 Security Features

- **Authentication:** JWT tokens with secure HTTP-only cookies
- **Authorization:** Role-based access control (user/admin)
- **Input Validation:** Express-validator for request validation
- **Rate Limiting:** Prevent API abuse
- **CORS:** Cross-origin resource sharing protection
- **XSS Protection:** Clean user input
- **NoSQL Injection:** MongoDB sanitization
- **Security Headers:** Helmet.js for security headers

## 🚦 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]
}
```

### Pagination Response
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 10
  },
  "data": [...]
}
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | JWT expiration time | 7d |
| STRIPE_SECRET_KEY | Stripe secret key | - |
| CLIENT_URL | Frontend URL for CORS | http://localhost:3000 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@example.com or create an issue in the repository.

## 🔄 API Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📈 Performance

- MongoDB indexing for optimal query performance
- Request compression with gzip
- Efficient pagination
- Optimized database queries with population

## 🔐 Authentication Flow

1. User registers/logs in
2. Server generates JWT token
3. Token sent as HTTP-only cookie and in response
4. Client includes token in Authorization header
5. Server validates token on protected routes

## 💳 Payment Flow

1. User creates order
2. Client requests payment intent
3. Server creates Stripe payment intent
4. Client completes payment with Stripe
5. Webhook confirms payment
6. Order status updated

## 📦 Deployment

### Heroku Deployment

1. Create Heroku app
2. Add MongoDB Atlas connection string
3. Set environment variables
4. Deploy with Git

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB URI
   - Ensure MongoDB is running
   - Check network connectivity

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

3. **File Upload Issues**
   - Check uploads directory exists
   - Verify file permissions
   - Check file size limits

4. **Stripe Payment Issues**
   - Verify Stripe keys
   - Check webhook URL
   - Ensure HTTPS in production
