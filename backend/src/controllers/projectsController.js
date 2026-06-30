// src/controllers/projectsController.js
const pool = require("../config/db");
require("dotenv").config();

const USER_ID = process.env.OWNER_USER_ID || 1;

// ── Shared row mapper ────────────────────────────────────────
function mapRow(r) {
  return {
    id:             r.project_id,
    projectName:    r.project_name,
    clientName:     r.client_name,
    projectType:    r.project_type,
    rateAmount:     Number(r.rate_amount),
    revisionCount:  Number(r.revision_count),
    dateNegotiated: typeof r.date_negotiated === "string"
      ? r.date_negotiated
      : r.date_negotiated?.toISOString().split("T")[0],
    designStatus:   r.design_status,
    paymentStatus:  r.payment_status,
    isArchived:     Boolean(r.is_archived),
  };
}

// GET /api/projects  — active only
async function getProjects(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM v_clients_list WHERE user_id = ? AND is_archived = 0 ORDER BY date_negotiated DESC`,
      [USER_ID]
    );
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error("[projects/list]", err);
    res.status(500).json({ error: "Failed to load projects" });
  }
}

// GET /api/projects/archived  — archived only
async function getArchivedProjects(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM v_clients_list WHERE user_id = ? AND is_archived = 1 ORDER BY updated_at DESC`,
      [USER_ID]
    );
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error("[projects/archived]", err);
    res.status(500).json({ error: "Failed to load archived projects" });
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

    await conn.query(
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

    // Re-fetch the freshly created row
    const [newRows] = await conn.query(
      `SELECT * FROM v_clients_list WHERE user_id = ? AND project_name = ? AND is_archived = 0 ORDER BY created_at DESC LIMIT 1`,
      [USER_ID, projectName]
    );
    const nr = newRows[0];
    res.status(201).json(mapRow(nr));
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

// PATCH /api/projects/:id/archive  — soft delete
async function archiveProject(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE projects SET is_archived = 1 WHERE id = ? AND user_id = ?`,
      [id, USER_ID]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[projects/archive]", err);
    res.status(500).json({ error: "Failed to archive project" });
  }
}

// PATCH /api/projects/:id/unarchive  — restore from archive
async function unarchiveProject(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE projects SET is_archived = 0 WHERE id = ? AND user_id = ?`,
      [id, USER_ID]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("[projects/unarchive]", err);
    res.status(500).json({ error: "Failed to restore project" });
  }
}

// DELETE /api/projects/:id  — hard delete (only safe after archiving)
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

// PATCH /api/projects/:id/status
// Body: { designStatus? , paymentStatus? }
async function patchProjectStatus(req, res) {
  const { id } = req.params;
  const { designStatus, paymentStatus } = req.body;

  try {
    if (designStatus !== undefined) {
      const [[dsRow]] = await pool.query(
        `SELECT id FROM design_statuses WHERE name = ?`, [designStatus]
      );
      if (!dsRow) return res.status(400).json({ error: "Invalid designStatus" });
      await pool.query(
        `UPDATE projects SET design_status_id = ? WHERE id = ? AND user_id = ?`,
        [dsRow.id, id, USER_ID]
      );
    }

    if (paymentStatus !== undefined) {
      const [[psRow]] = await pool.query(
        `SELECT id FROM payment_statuses WHERE name = ?`, [paymentStatus]
      );
      if (!psRow) return res.status(400).json({ error: "Invalid paymentStatus" });
      await pool.query(
        `UPDATE projects SET payment_status_id = ? WHERE id = ? AND user_id = ?`,
        [psRow.id, id, USER_ID]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("[projects/patch-status]", err);
    res.status(500).json({ error: "Failed to update status" });
  }
}

module.exports = {
  getProjects,
  getArchivedProjects,
  createProject,
  updateProject,
  archiveProject,
  unarchiveProject,
  deleteProject,
  patchProjectStatus,
};
