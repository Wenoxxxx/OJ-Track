// src/controllers/reportsController.js
const pool = require("../config/db");
require("dotenv").config();

const USER_ID = process.env.OWNER_USER_ID || 1;

// GET /api/reports/stats
// Feeds: Reports page summary KPIs + pie charts
async function getReportStats(req, res) {
  try {
    const [[stats]] = await pool.query(
      `SELECT * FROM v_dashboard_stats WHERE user_id = ?`,
      [USER_ID]
    );

    // Total revisions (separate aggregate — not in view)
    const [[rev]] = await pool.query(
      `SELECT SUM(revision_count) AS total_revisions
       FROM projects WHERE user_id = ?`,
      [USER_ID]
    );

    res.json({
      totalClients:    Number(stats?.total_projects   ?? 0),
      totalSales:      Number(stats?.total_sales      ?? 0),
      totalRevisions:  Number(rev?.total_revisions    ?? 0),
      notStarted:      Number(stats?.not_started      ?? 0),
      pending:         Number(stats?.pending          ?? 0),
      done:            Number(stats?.done             ?? 0),
      payNotPaid:      Number(stats?.pay_not_paid     ?? 0),
      payPartial:      Number(stats?.pay_partial      ?? 0),
      payPaid:         Number(stats?.pay_paid         ?? 0),
    });
  } catch (err) {
    console.error("[reports/stats]", err);
    res.status(500).json({ error: "Failed to load report stats" });
  }
}

// GET /api/reports/monthly
// Feeds: Reports Monthly Sales BarChart
async function getMonthlyReport(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM v_monthly_activity WHERE user_id = ? ORDER BY year, month_num`,
      [USER_ID]
    );
    res.json(
      rows.map((r) => ({
        month:   r.month,
        clients: Number(r.client_count),
        sales:   Number(r.total_sales),
      }))
    );
  } catch (err) {
    console.error("[reports/monthly]", err);
    res.status(500).json({ error: "Failed to load monthly report" });
  }
}

// GET /api/reports/by-type
// Feeds: Reports "Sales by Project Type" horizontal bar chart
async function getSalesByType(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM v_sales_by_type WHERE user_id = ?`,
      [USER_ID]
    );
    res.json(
      rows.map((r) => ({
        type:  r.project_type,
        sales: Number(r.total_sales),
      }))
    );
  } catch (err) {
    console.error("[reports/by-type]", err);
    res.status(500).json({ error: "Failed to load sales by type" });
  }
}

module.exports = { getReportStats, getMonthlyReport, getSalesByType };
