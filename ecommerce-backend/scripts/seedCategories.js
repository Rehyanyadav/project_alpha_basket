const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Category = require('../models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => console.error('MongoDB connection error:', err));

const categories = [
  {
    name: 'Websites',
    slug: 'websites',
    description: 'Complete website templates and designs',
    sortOrder: 1
  },
  {
    name: 'Apps',
    slug: 'apps',
    description: 'Mobile and web application templates',
    sortOrder: 2
  },
  {
    name: 'Graphics',
    slug: 'graphics',
    description: 'Logos, illustrations, and graphic designs',
    sortOrder: 3
  },
  {
    name: 'UI/UX',
    slug: 'ui-ux',
    description: 'User interface and user experience design templates',
    sortOrder: 4
  },
  {
    name: 'Templates',
    slug: 'templates',
    description: 'Various design templates for different purposes',
    sortOrder: 5
  },
  {
    name: 'Scripts',
    slug: 'scripts',
    description: 'Code scripts and programming solutions',
    sortOrder: 6
  },
  {
    name: 'Plugins',
    slug: 'plugins',
    description: 'Website plugins and extensions',
    sortOrder: 7
  },
  {
    name: 'Themes',
    slug: 'themes',
    description: 'CMS themes and custom designs',
    sortOrder: 8
  },
  {
    name: 'Digital Art',
    slug: 'digital-art',
    description: 'Digital artwork and creative designs',
    sortOrder: 9
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    description: 'Marketing materials and promotional designs',
    sortOrder: 10
  }
];

async function seedCategories() {
  try {
    console.log('Starting category seeding...');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');
    
    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Successfully created ${createdCategories.length} categories:`);
    
    createdCategories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });
    
    console.log('Category seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
