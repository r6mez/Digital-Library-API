

const express = require('express');
const router = express.Router();

const validate = require('../validators/validate');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { offerSchema } = require('../validators/offerValidator');

const { createOffer, getOfferById, acceptOffer, updateOffer, deleteOffer } = require('../controllers/offerController');



router.post('/create', protect, validate(offerSchema), createOffer);
router.get('/:id', protect, getOfferById);
router.post('/:id/accept', protect, acceptOffer);
router.put('/:id', protect, admin, updateOffer);
router.delete('/:id', protect, admin, deleteOffer);

module.exports = router;