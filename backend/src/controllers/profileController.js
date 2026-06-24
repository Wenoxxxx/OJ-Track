// src/controllers/profileController.js
const pool = require("../config/db");
require("dotenv").config();

const USER_ID = process.env.OWNER_USER_ID || "00000000-0000-0000-0000-000000000001";

// GET /api/profile
async function getProfile(req, res) {
  try {
    const [[user]] = await pool.query(
      `SELECT id, full_name, initials, profession, email, avatar_url, created_at
       FROM users WHERE id = ?`,
      [USER_ID]
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id:         user.id,
      fullName:   user.full_name,
      initials:   user.initials?.trim() ?? "",
      profession: user.profession,
      email:      user.email,
      avatarUrl:  user.avatar_url ?? null,
      createdAt:  user.created_at,
    });
  } catch (err) {
    console.error("[profile/get]", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
}

// PUT /api/profile
// Body: { fullName, initials, profession, email, avatarUrl }
async function updateProfile(req, res) {
  const { fullName, initials, profession, email, avatarUrl } = req.body;
  try {
    await pool.query(
      `UPDATE users SET full_name = ?, initials = ?, profession = ?, email = ?, avatar_url = ?
       WHERE id = ?`,
      [fullName, initials, profession, email, avatarUrl ?? null, USER_ID]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[profile/update]", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

module.exports = { getProfile, updateProfile };
