const Offer = require("../models/offerModel");
const Book = require("../models/bookModel");
const OfferedBook = require("../models/offeredBook");
const OwendBook = require("../models/owendBookModel");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const asyncHandler = require("../utils/asyncHandler");

const createOffer = asyncHandler(async (req, res) => {
    const user = req.user;

    const books = await Promise.all(
        req.body.books.map(async (book_id) => {
            const book = await Book.findById(book_id).lean();
            if (!book) throw new Error(`Book not found: ${book_id}`);
            return book;
        })
    );

    let total_price = 0;
    books.forEach(book => { total_price += book.buy_price; });

    let new_price = total_price * 0.75;

    if(user.money < new_price){
        res.status(400).json({ 
            message: "User doesn't have enough money!",
            joke: "جيت اشتري كتاب امي قالتلي بس يبني لا يعايرونا بفقرنا، قولتلها ياما لا الفقر مش عيب"
        })
        return; 
    }

    const offer = await Offer.create({
        user: user._id,
        original_price: total_price,
        discounted_price: new_price
    })

    const offeredBooksObj = books.map(book => ({
        offer: offer._id,
        book: book._id
    }));

    const offeredBooks = await OfferedBook.insertMany(offeredBooksObj);
    
    res.status(200).json({ offer, offeredBooks });
});

// GET /offer/:id -> return offer + included books + prices
const getOfferById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const offer = await Offer.findById(id).lean();
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    const offeredBooks = await OfferedBook.find({ offer: id }).populate('book');

    const books = offeredBooks.map(ob => ob.book);

    res.status(200).json({
        offer: {
            _id: offer._id,
            original_price: offer.original_price,
            discounted_price: offer.discounted_price,
            user: offer.user,
            createdAt: offer.createdAt
        },
        books
    });
});

// POST /offer/:id/accept -> purchase all books in the offer for discounted_price
const acceptOffer = asyncHandler(async (req, res) => {
    const user = req.user; // set by protect middleware
    const offerId = req.params.id;

    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    const offeredBooks = await OfferedBook.find({ offer: offerId }).populate('book');

    // Check ownership conflicts
    const alreadyOwned = [];
    for (const ob of offeredBooks) {
        const owned = await OwendBook.findOne({ user: user._id, book: ob.book._id });
        if (owned) alreadyOwned.push(ob.book._id);
    }
    if (alreadyOwned.length > 0) {
        return res.status(400).json({ message: 'You already own one or more books in this offer', ownedBookIds: alreadyOwned });
    }

    // Check balance
    const price = offer.discounted_price;
    if (user.money < price) return res.status(400).json({ message: 'Insufficient funds' });

    // Deduct money
    user.money = user.money - price;
    await user.save();

    // Create ownership records
    const ownedObjs = offeredBooks.map(ob => ({ user: user._id, book: ob.book._id }));
    const owned = await OwendBook.insertMany(ownedObjs);

    // Create transaction
    const transaction = await Transaction.create({
        user: user._id,
        amount: price,
        type: 'PURCHASE_OFFER',
        description: `Purchase of offer ${offerId}`
    });

    res.status(200).json({ message: 'Offer purchased successfully', owned, transaction });
});

module.exports = { createOffer, getOfferById, acceptOffer };