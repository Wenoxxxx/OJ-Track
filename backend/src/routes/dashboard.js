// src/routes/dashboard.js
const express = require("express");
const { getStats, getRecentProjects, getMonthlyActivity } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/stats",    getStats);
router.get("/recent",   getRecentProjects);
router.get("/activity", getMonthlyActivity);

module.exports = router;
