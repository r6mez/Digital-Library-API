const express = require('express');
const router = express.Router();


const { getBooks,
     getBookById,
      createBook,
       updateBook,
        deleteBook,
         buyBook,
          borrowBook,
          uploadBookPDF,
          getBookPDF,
          previewPDF } = require('../controllers/bookController');
const validate = require('../validators/validate');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');
const { bookSchema, borrowBookSchema } = require('../validators/bookValidator');


router.get('/', getBooks);
router.get('/:id', getBookById);

router.post('/:id/buy', protect, buyBook);
router.post('/:id/borrow', protect, validate(borrowBookSchema), borrowBook);

router.post('/', protect, admin, validate(bookSchema), createBook);
router.put('/:id', protect, admin, validate(bookSchema), updateBook);
router.delete('/:id', protect, admin, deleteBook);

router.post('/:id/pdf', protect, admin, upload.single('pdf'), uploadBookPDF);
router.get('/:id/pdf', protect, getBookPDF);
router.get('/:id/preview', protect, previewPDF);




module.exports = router;
