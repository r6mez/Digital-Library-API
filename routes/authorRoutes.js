const express = require('express');
const router = express.Router();
const validate = require('../validators/validate');
const { authorSchema, updateAuthorSchema } = require('../validators/authorValidator');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getAuthors, getAuthorById, getBooksByAuthor, createAuthor, updateAuthor, deleteAuthor } = require('../controllers/authorController');

router.get('/', getAuthors);
router.get('/:id', getAuthorById);
router.get('/:id/books', getBooksByAuthor);

router.post('/', protect, admin, validate(authorSchema), createAuthor);
router.put('/:id', protect, admin, validate(updateAuthorSchema), updateAuthor);
router.delete('/:id', protect, admin, deleteAuthor);

module.exports = router;
