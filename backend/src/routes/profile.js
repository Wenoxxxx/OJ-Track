// src/routes/profile.js
const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");

const router = express.Router();

router.get("/",  getProfile);
router.put("/",  updateProfile);

module.exports = router;
