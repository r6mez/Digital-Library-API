
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const { updateProfileSchema } = require('../validators/authValidator');
const ActiveSubscription = require('../models/activeSubscribtionModel');
const OwnedBooks = require('../models/owendBookModel');
const BorrowedBook = require('../models/borrowedBookModel');
const Offer = require('../models/offerModel');
const OfferedBook = require('../models/offeredBook');
const Transaction = require('../models/transactionModel');

const getSignedUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Returns the latest active subscription for the signed-in user (or null)
const getUserSubscription = asyncHandler(async (req, res) => {
  const active = await ActiveSubscription.findLatestActive(req.user._id);
  if (!active) return res.status(404).json({ message: 'No active subscription found' });
  res.status(200).json(active);
});

// Returns all subscription history for the signed-in user
const getUserSubscriptionHistory = asyncHandler(async (req, res) => {
  const history = await ActiveSubscription.findUserHistory(req.user._id);
  if (!history || history.length === 0) return res.status(404).json({ message: 'No subscription history found' });
  res.status(200).json(history);
});

// Returns transaction history for the signed-in user (most recent first)
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
  if (transactions.length === 0) {
    return res.status(404).json({ message: 'No transactions found' });
  }
  res.status(200).json(transactions);
});

// Returns all the ow owned books for the signed-in user (most recent first)
const getOwnedBooks = asyncHandler(async (req, res) => {
  const books = await OwnedBooks.find({ user: req.user._id }).sort({ createdAt: -1 }).populate("book");
  if (books.length === 0) {
    return res.status(404).json({ message: 'No owned books found' });
  }
  res.status(200).json(books);
});

// Returns all currently borrowed books for the signed-in user (most recent first)
const getBorrowedBooks = asyncHandler(async (req, res) => {
  const borrowedBooks = await BorrowedBook.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("book", "name author cover_image_url publication_date category type");
  
  if (borrowedBooks.length === 0) {
    return res.status(404).json({ message: 'No borrowed books found' });
  }

  // Add status to each borrowed book (active or expired)
  const borrowedBooksWithStatus = borrowedBooks.map(borrowedBook => {
    const isExpired = borrowedBook.return_date < new Date();
    return {
      ...borrowedBook.toObject(),
      status: isExpired ? 'expired' : 'active',
      daysRemaining: isExpired ? 0 : Math.ceil((borrowedBook.return_date - new Date()) / (1000 * 60 * 60 * 24))
    };
  });

  res.status(200).json(borrowedBooksWithStatus);
});

// Returns all offers created/assigned to the signed-in user (with included books)
const getUserOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();

  const results = await Promise.all(offers.map(async (offer) => {
    const offeredBooks = await OfferedBook.find({ offer: offer._id }).populate('book');
    return { offer, books: offeredBooks.map(ob => ob.book) };
  }));
  if (results.length === 0) {
    return res.status(404).json({ message: 'No offers found' });
  }

  res.status(200).json(results);
});

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, password, currentPassword } = value;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If updating password, verify current password
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to update password' });
      }
      
      const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      user.password = password;
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

module.exports = { getSignedUser, getUserSubscription, getUserSubscriptionHistory, getUserTransactions, getOwnedBooks, getBorrowedBooks, getUserOffers, updateProfile };