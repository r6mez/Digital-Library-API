const Offer = require("../models/offerModel");
const Book = require("../models/bookModel");
const OfferedBook = require("../models/offeredBook");
const OwendBook = require("../models/owendBookModel");
const Transaction = require("../models/transactionModel");
const { sendOfferPurchaseEmail } = require("../utils/emailService");
const asyncHandler = require("../utils/asyncHandler");
const {
  SUCCESS,
  BAD_REQUEST,
  NOT_FOUND,
  GONE
} = require("../constants/httpStatusCodes");

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
        res.status(BAD_REQUEST).json({ 
            message: "User doesn't have enough money!",
            joke: "جيت اشتري كتاب امي قالتلي بس يبني لا يعايرونا بفقرنا، قولتلها ياما لا الفقر مش عيب"
        })
        return; 
    }

    const offer = await Offer.create({
        user: user._id,
        original_price: total_price,
        discounted_price: new_price,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // valid for 24 hours
    })

    const offeredBooksObj = books.map(book => ({
        offer: offer._id,
        book: book._id
    }));

    const offeredBooks = await OfferedBook.insertMany(offeredBooksObj);
    
    res.status(SUCCESS).json({ offer, offeredBooks });
});

const getOfferById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const offer = await Offer.findById(id).lean();
    if (!offer) return res.status(NOT_FOUND).json({ message: 'Offer not found' });
    if (offer.expiresAt && new Date() > new Date(offer.expiresAt)) {
        return res.status(GONE).json({ message: 'Offer has expired' });
    }

    const offeredBooks = await OfferedBook.find({ offer: id }).populate('book');

    const books = offeredBooks.map(ob => ob.book);

    res.status(SUCCESS).json({
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

const acceptOffer = asyncHandler(async (req, res) => {
    const user = req.user; // set by protect middleware
    const offerId = req.params.id;

    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(NOT_FOUND).json({ message: 'Offer not found' });
    if (offer.expiresAt && new Date() > new Date(offer.expiresAt)) {
        return res.status(GONE).json({ message: 'Offer has expired' });
    }

    const offeredBooks = await OfferedBook.find({ offer: offerId }).populate('book');

    // Check ownership conflicts
    const alreadyOwned = [];
    for (const ob of offeredBooks) {
        const owned = await OwendBook.findOne({ user: user._id, book: ob.book._id });
        if (owned) alreadyOwned.push(ob.book._id);
    }
    if (alreadyOwned.length > 0) {
        return res.status(BAD_REQUEST).json({ message: 'You already own one or more books in this offer', ownedBookIds: alreadyOwned });
    }

    // Check balance
    const price = offer.discounted_price;
    if (user.money < price) return res.status(BAD_REQUEST).json({ message: 'Insufficient funds' });

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

    // Send confirmation email
    try {
        const bookNames = offeredBooks.map(ob => ob.book.name);
        const offerDetails = `Special Offer (${offeredBooks.length} books)`;
        
        await sendOfferPurchaseEmail(
            user.email,
            user.name,
            offerDetails,
            bookNames,
            price
        );
    } catch (emailError) {
        console.error('Failed to send offer purchase email:', emailError);
        // Don't fail the transaction if email fails
    }

    res.status(SUCCESS).json({ message: 'Offer purchased successfully', owned, transaction });
});

const updateOffer = asyncHandler(async (req, res) => {
    const offerId = req.params.id;
    const { discounted_price, original_price, books } = req.body;

    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(NOT_FOUND).json({ message: 'Offer not found' });
    if (offer.expiresAt && new Date() > new Date(offer.expiresAt)) {
        return res.status(GONE).json({ message: 'Offer has expired' });
    }

    if (discounted_price !== undefined) offer.discounted_price = discounted_price;
    if (original_price !== undefined) offer.original_price = original_price;

    // If admin supplied a new books list, validate and replace offered books, and recalc prices
    if (books && Array.isArray(books)) {
        const foundBooks = await Promise.all(
            books.map(async (book_id) => {
                const book = await Book.findById(book_id).lean();
                if (!book) throw new Error(`Book not found: ${book_id}`);
                return book;
            })
        );

        let total_price = 0;
        foundBooks.forEach(b => { total_price += b.buy_price; });

        offer.original_price = total_price;
        // If admin didn't explicitly set discounted_price, keep 25% off as default
        if (discounted_price === undefined) offer.discounted_price = total_price * 0.75;

        // Replace offered books
        await OfferedBook.deleteMany({ offer: offer._id });
        const offeredBooksObj = foundBooks.map(book => ({ offer: offer._id, book: book._id }));
        await OfferedBook.insertMany(offeredBooksObj);
    }

    await offer.save();

    res.status(SUCCESS).json({ message: 'Offer updated', offer });
});

const deleteOffer = asyncHandler(async (req, res) => {
    const offerId = req.params.id;
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(NOT_FOUND).json({ message: 'Offer not found' });

    // Remove referenced offered book records, then the offer
    await OfferedBook.deleteMany({ offer: offer._id });
    await Offer.deleteOne({ _id: offer._id });

    res.status(SUCCESS).json({ message: 'Offer deleted' });
});

module.exports = { createOffer, getOfferById, acceptOffer, updateOffer, deleteOffer };