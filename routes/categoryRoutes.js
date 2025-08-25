const express = require('express');
const router = express.Router();

const validate = require('../validators/validate');
const { nameSchema } = require('../validators/typeCategoryValidator');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, admin, validate(nameSchema), createCategory);
router.put('/:id', protect, admin, validate(nameSchema), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);


module.exports = router;
