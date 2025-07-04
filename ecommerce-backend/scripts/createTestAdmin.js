const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

async function createTestAdmin() {
  try {
    console.log('Creating test admin user...');
    
    // Delete existing admin
    await User.deleteOne({ email: 'admin@test.com' });
    
    // Create admin user with simple password
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });
    
    await adminUser.save();
    
    console.log('Test admin user created successfully!');
    console.log(`Email: ${adminUser.email}`);
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test admin user:', error);
    process.exit(1);
  }
}

createTestAdmin();
