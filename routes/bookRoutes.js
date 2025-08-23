const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { createBookSchema } = require('../validators/bookValidator');
const validate = require('../middlewares/validate');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getBooks);
router.get('/:id', getBookById);

// Protected admin routes with validation
router.post('/', protect, admin, validate(createBookSchema), createBook);
router.put('/:id', protect, admin, validate(createBookSchema), updateBook);
router.delete('/:id', protect, admin, deleteBook);

module.exports = router;
