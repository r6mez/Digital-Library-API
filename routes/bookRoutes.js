const express = require('express');
const router = express.Router();


const { getBooks, getBookById, createBook, updateBook, deleteBook, buyBook, borrowBook, uploadBookPDF, getBookPDF } = require('../controllers/bookController');
const validate = require('../validators/validate');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/cloudinaryUpload');
const { bookSchema } = require('../validators/bookValidator');


router.get('/', getBooks);
router.get('/:id', getBookById);

router.post('/:id/buy', protect, buyBook);
// borrow book
router.post('/:id/borrow', protect, borrowBook);

router.post('/', protect, admin, validate(bookSchema), createBook);
router.put('/:id', protect, admin, validate(bookSchema), updateBook);
router.delete('/:id', protect, admin, deleteBook);

router.post('/:id/pdf', protect, admin, upload.single('pdf'), uploadBookPDF);
router.get('/:id/pdf', protect, getBookPDF);



// router.post('/test-upload', upload.single('pdf'), (req, res) => {
    
//     console.log("Cloudinary ENV:", {
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
//     });
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
//     res.json({ file: req.file });
// });

module.exports = router;
