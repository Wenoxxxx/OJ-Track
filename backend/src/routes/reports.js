// src/routes/reports.js
const express = require("express");
const { getReportStats, getMonthlyReport, getSalesByType } = require("../controllers/reportsController");

const router = express.Router();

router.get("/stats",   getReportStats);
router.get("/monthly", getMonthlyReport);
router.get("/by-type", getSalesByType);

module.exports = router;
