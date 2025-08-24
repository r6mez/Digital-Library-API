/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and profile
 *
 * /users/me:
 *   get:
 *     summary: Get the current signed-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *
 * /users/me/subscription:
 *   get:
 *     summary: Get the active subscription for the signed-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active subscription or null
 *       401:
 *         description: Unauthorized
 *
 * /users/me/transactions:
 *   get:
 *     summary: Get transaction history for the signed-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of transactions
 *       401:
 *         description: Unauthorized
 * 
 * /users/me/books:
 *   get:
 *     summary: Get books owned by the signed-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of owned books (with populated book details)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   book:
 *                     $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 * 
 * /users/me/offers:
 *   get:
 *     summary: Get offers assigned to the signed-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of offers with included books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   offer:
 *                     type: object
 *                   books:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 */
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ActiveSubscription = require('../models/activeSubscribtionModel');
const OwnedBooks = require('../models/owendBookModel');
const Offer = require('../models/offerModel');
const OfferedBook = require('../models/offeredBook');

const getSignedUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Returns the active subscription for the signed-in user (or null)
const getUserSubscription = asyncHandler(async (req, res) => {
  const active = await ActiveSubscription.findOne({ user: req.user._id }).populate('subscription');
  if (!active) return res.status(200).json(null);
  res.status(200).json(active);
});

// Returns transaction history for the signed-in user (most recent first)
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(transactions);
});

// removed empty @swagger JSDoc block to avoid YAML parse error

// Returns all the ow owned books for the signed-in user (most recent first)
const getOwnedBooks = asyncHandler(async (req, res) => {
  const books = await OwnedBooks.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("book");
  res.status(200).json(books);
});

// Returns all offers created/assigned to the signed-in user (with included books)
const getUserOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();

  const results = await Promise.all(offers.map(async (offer) => {
    const offeredBooks = await OfferedBook.find({ offer: offer._id }).populate('book');
    return { offer, books: offeredBooks.map(ob => ob.book) };
  }));

  res.status(200).json(results);
});


module.exports = { getSignedUser, getUserSubscription, getUserTransactions, getOwnedBooks, getUserOffers };