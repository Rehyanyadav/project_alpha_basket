const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  getFeaturedCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  uploadCategoryImage
} = require('../controllers/categories');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/featured', getFeaturedCategories);
router.get('/:id', getCategory);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', [
  body('name').trim().notEmpty().withMessage('Category name is required'),
], createCategory);

router.put('/:id', [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
], updateCategory);

router.delete('/:id', deleteCategory);

router.post('/:id/image', upload.single('image'), uploadCategoryImage);

module.exports = router;
