const express = require('express');
const router = express.Router();


const { getBooks, getBookById, createBook, updateBook, deleteBook, buyBook ,borrowBook } = require('../controllers/bookController');
const validate = require('../validators/validate');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { bookSchema } = require('../validators/bookValidator');

router.get('/', getBooks);
router.get('/:id', getBookById);

router.post('/:id/buy', protect, buyBook);
// borrow book
router.post('/:id/borrow', protect, borrowBook);

router.post('/', protect, admin, validate(bookSchema), createBook);
router.put('/:id', protect, admin, validate(bookSchema), updateBook);
router.delete('/:id', protect, admin, deleteBook);

module.exports = router;
