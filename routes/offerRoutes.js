/**
 * @swagger
 * tags:
 *   - name: Offers
 *     description: Offer creation and purchase endpoints
 *
 * /offers/create:
 *   post:
 *     summary: Create a new offer (bundle of books)
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               books:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of book IDs
 *     responses:
 *       200:
 *         description: Created offer and included book records
 *
 * /offers/{id}:
 *   get:
 *     summary: Get an offer by ID (with included books)
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Offer object and array of books
 *
 * /offers/{id}/accept:
 *   post:
 *     summary: Purchase all books in the offer using the discounted price
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchase result, created ownership records and transaction
 */

const express = require('express');
const router = express.Router();

const validate = require('../validators/validate');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { offerSchema } = require('../validators/offerValidator');

const { createOffer, getOfferById, acceptOffer } = require('../controllers/offerController');



router.post('/create', protect, validate(offerSchema), createOffer);
router.get('/:id', protect, getOfferById);
router.post('/:id/accept', protect, acceptOffer);

module.exports = router;