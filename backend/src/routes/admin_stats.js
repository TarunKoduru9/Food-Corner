const express = require("express");
const router = express.Router();
const adminStatsController = require("../controller/adminStatsController");


router.get("/stats/users-count", adminStatsController.getUsersCount);
router.get("/stats/orders-count", adminStatsController.getOrdersCount);
router.get("/stats/total-revenue", adminStatsController.getTotalRevenue);
router.get("/stats/categories-count", adminStatsController.getCategoriesCount);
router.get("/stats/items-count", adminStatsController.getItemsCount);

module.exports = router;
