const express = require("express");
const router = express.Router();

const {
    getTotalRevenue,
    getRevenueByType,
    getBorrowedBooks,
    getSoldBooks,
    getLibraryStatistics
} = require("../controllers/statisticsController");

router.get("/libraryStatistics", getLibraryStatistics);
router.get("/revenue/total", getTotalRevenue);
router.get("/revenue/type", getRevenueByType);
router.get("/books/borrowed", getBorrowedBooks);
router.get("/books/sold", getSoldBooks);

module.exports = router;
