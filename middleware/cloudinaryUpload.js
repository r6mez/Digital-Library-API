const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'books/pdfs',
        resource_type: 'raw', 
        format: async () => 'pdf',
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

module.exports = multer({ storage });
