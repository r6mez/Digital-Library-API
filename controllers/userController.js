
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