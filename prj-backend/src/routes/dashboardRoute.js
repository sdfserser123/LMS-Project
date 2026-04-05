const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

// Universal Summary Route
router.get("/summary", getDashboardSummary);

module.exports = router;
