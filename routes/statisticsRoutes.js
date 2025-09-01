const express = require("express");
const router = express.Router();
const { getSubscriptionStatistics, getTotalRevenue, getRevenueByType, getLibraryStatistics } = require("../controllers/statisticsController");

router.get("/library", getLibraryStatistics);
router.get("/revenue/total", getTotalRevenue);
router.get("/revenue/type", getRevenueByType);
router.get("/subscriptions", getSubscriptionStatistics);

module.exports = router;
