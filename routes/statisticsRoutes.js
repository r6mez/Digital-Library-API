const express = require("express");
const router = express.Router();
const { getSubscriptionStatistics, getTotalRevenue, getRevenueByType, getLibraryStatistics } = require("../controllers/statisticsController");
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get("/library", protect, admin, getLibraryStatistics);
router.get("/revenue/total", protect, admin, getTotalRevenue);
router.get("/revenue/type", protect, admin, getRevenueByType);
router.get("/subscriptions", protect, admin, getSubscriptionStatistics);

module.exports = router;
