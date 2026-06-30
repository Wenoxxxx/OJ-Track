// src/controllers/dashboardController.js
const pool = require("../config/db");
require("dotenv").config();

// users.id is INT AUTO_INCREMENT in the schema, not a UUID — keep this numeric.
// Falls back to 1, matching the seeded "Owen M. Jerusalem" user.
const USER_ID = Number(process.env.OWNER_USER_ID) || 1;

// GET /api/dashboard/stats
// Feeds: StatsCards component
async function getStats(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM v_dashboard_stats WHERE user_id = ?`,
      [USER_ID]
    );
    const stats = rows[0] ?? {
      total_projects: 0,
      total_sales: 0,
      not_started: 0,
      pending: 0,
      done: 0,
      pay_not_paid: 0,
      pay_partial: 0,
      pay_paid: 0,
    };
    res.json({
      totalClients:  Number(stats.total_projects),
      totalSales:    Number(stats.total_sales),
      notStarted:    Number(stats.not_started),
      pending:       Number(stats.pending),
      done:          Number(stats.done),
      payNotPaid:    Number(stats.pay_not_paid),
      payPartial:    Number(stats.pay_partial),
      payPaid:       Number(stats.pay_paid),
    });
  } catch (err) {
    console.error("[dashboard/stats]", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
}

// GET /api/dashboard/recent
// Feeds: RecentProjects component (last 5)
async function getRecentProjects(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM v_recent_projects WHERE user_id = ? LIMIT 5`,
      [USER_ID]
    );
    res.json(
      rows.map((r) => ({
        id:            r.project_id,
        projectName:   r.project_name,
        clientName:    r.client_name,
        projectType:   r.project_type,
        rateAmount:    Number(r.rate_amount),
        designStatus:  r.design_status,
        paymentStatus: r.payment_status,
        dateNegotiated: r.date_negotiated,
      }))
    );
  } catch (err) {
    console.error("[dashboard/recent]", err);
    res.status(500).json({ error: "Failed to load recent projects" });
  }
}

// GET /api/dashboard/activity
// Feeds: ActivityChart component
async function getMonthlyActivity(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM v_monthly_activity WHERE user_id = ? ORDER BY year, month_num`,
      [USER_ID]
    );
    res.json(
      rows.map((r) => ({
        month:    r.month,
        clients:  Number(r.client_count),
        sales:    Number(r.total_sales),
      }))
    );
  } catch (err) {
    console.error("[dashboard/activity]", err);
    res.status(500).json({ error: "Failed to load monthly activity" });
  }
}

module.exports = { getStats, getRecentProjects, getMonthlyActivity };