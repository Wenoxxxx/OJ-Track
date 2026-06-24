// src/controllers/projectsController.js
const pool = require("../config/db");
require("dotenv").config();

const USER_ID = process.env.OWNER_USER_ID || "00000000-0000-0000-0000-000000000001";

// GET /api/projects
// Feeds: Clients page table — uses v_clients_list view
async function getProjects(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM v_clients_list WHERE user_id = ? ORDER BY date_negotiated DESC`,
      [USER_ID]
    );
    res.json(
      rows.map((r) => ({
        id:            r.project_id,
        projectName:   r.project_name,
        clientName:    r.client_name,
        projectType:   r.project_type,
        rateAmount:    Number(r.rate_amount),
        revisionCount: Number(r.revision_count),
        dateNegotiated: typeof r.date_negotiated === "string"
          ? r.date_negotiated
          : r.date_negotiated?.toISOString().split("T")[0],
        designStatus:  r.design_status,
        paymentStatus: r.payment_status,
      }))
    );
  } catch (err) {
    console.error("[projects/list]", err);
    res.status(500).json({ error: "Failed to load projects" });
  }
}

// POST /api/projects
// Body: { projectName, clientName, projectType, rateAmount, revisionCount, dateNegotiated, designStatus, paymentStatus }
async function createProject(req, res) {
  const {
    projectName, clientName, projectType,
    rateAmount, revisionCount, dateNegotiated,
    designStatus, paymentStatus,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Upsert client by name
    await conn.query(
      `INSERT INTO clients (full_name) VALUES (?) ON DUPLICATE KEY UPDATE full_name = full_name`,
      [clientName]
    );
    const [[client]] = await conn.query(
      `SELECT id FROM clients WHERE full_name = ? LIMIT 1`,
      [clientName]
    );

    // Resolve FK IDs
    const [[ptRow]]  = await conn.query(`SELECT id FROM project_types    WHERE name = ?`, [projectType]);
    const [[dsRow]]  = await conn.query(`SELECT id FROM design_statuses  WHERE name = ?`, [designStatus]);
    const [[psRow]]  = await conn.query(`SELECT id FROM payment_statuses WHERE name = ?`, [paymentStatus]);

    if (!ptRow || !dsRow || !psRow) {
      await conn.rollback();
      return res.status(400).json({ error: "Invalid projectType, designStatus, or paymentStatus value" });
    }

    const [result] = await conn.query(
      `INSERT INTO projects
         (user_id, client_id, project_name, project_type_id,
          rate_amount, revision_count, date_negotiated,
          design_status_id, payment_status_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        USER_ID, client.id, projectName, ptRow.id,
        rateAmount, revisionCount ?? 0, dateNegotiated,
        dsRow.id, psRow.id,
      ]
    );

    await conn.commit();

    // Return fresh record
    const [[fresh]] = await conn.query(
      `SELECT * FROM v_clients_list WHERE project_id = ?`,
      [result.insertId]   // won't match — UUID auto-generated; use last insert
    );

    // Re-fetch by name (fallback since UUID is auto)
    const [newRows] = await conn.query(
      `SELECT * FROM v_clients_list WHERE user_id = ? AND project_name = ? ORDER BY date_negotiated DESC LIMIT 1`,
      [USER_ID, projectName]
    );
    const nr = newRows[0];
    res.status(201).json({
      id:            nr?.project_id,
      projectName:   nr?.project_name,
      clientName:    nr?.client_name,
      projectType:   nr?.project_type,
      rateAmount:    Number(nr?.rate_amount),
      revisionCount: Number(nr?.revision_count),
      dateNegotiated: typeof nr?.date_negotiated === "string"
        ? nr.date_negotiated
        : nr?.date_negotiated?.toISOString().split("T")[0],
      designStatus:  nr?.design_status,
      paymentStatus: nr?.payment_status,
    });
  } catch (err) {
    await conn.rollback();
    console.error("[projects/create]", err);
    res.status(500).json({ error: "Failed to create project" });
  } finally {
    conn.release();
  }
}

// PUT /api/projects/:id
async function updateProject(req, res) {
  const { id } = req.params;
  const {
    projectName, projectType, rateAmount,
    revisionCount, dateNegotiated,
    designStatus, paymentStatus,
  } = req.body;

  try {
    const [[ptRow]] = await pool.query(`SELECT id FROM project_types    WHERE name = ?`, [projectType]);
    const [[dsRow]] = await pool.query(`SELECT id FROM design_statuses  WHERE name = ?`, [designStatus]);
    const [[psRow]] = await pool.query(`SELECT id FROM payment_statuses WHERE name = ?`, [paymentStatus]);

    if (!ptRow || !dsRow || !psRow) {
      return res.status(400).json({ error: "Invalid lookup value" });
    }

    await pool.query(
      `UPDATE projects SET
         project_name      = ?,
         project_type_id   = ?,
         rate_amount       = ?,
         revision_count    = ?,
         date_negotiated   = ?,
         design_status_id  = ?,
         payment_status_id = ?
       WHERE id = ? AND user_id = ?`,
      [projectName, ptRow.id, rateAmount, revisionCount,
       dateNegotiated, dsRow.id, psRow.id, id, USER_ID]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[projects/update]", err);
    res.status(500).json({ error: "Failed to update project" });
  }
}

// DELETE /api/projects/:id
async function deleteProject(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      `DELETE FROM projects WHERE id = ? AND user_id = ?`,
      [id, USER_ID]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[projects/delete]", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
}

module.exports = { getProjects, createProject, updateProject, deleteProject };
