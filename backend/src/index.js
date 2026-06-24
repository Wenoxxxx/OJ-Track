// src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dashboardRoutes = require("./routes/dashboard");
const projectsRoutes = require("./routes/projects");
const reportsRoutes = require("./routes/reports");
const profileRoutes = require("./routes/profile");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/profile", profileRoutes);

// Health check
app.get("/", (_req, res) => res.json({ status: "OJ-Track API running" }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error("[unhandled]", err);
    res.status(500).json({ error: "Internal server error" });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(` OJ-Track API → http://localhost:${PORT}`);
});
