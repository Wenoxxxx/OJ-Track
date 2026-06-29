-- ============================================================
-- Migration: add is_archived to projects table
-- Run once against your live database.
-- ============================================================

-- 1. Add the column (idempotent-safe: only errors if already exists)
ALTER TABLE projects
  ADD COLUMN is_archived TINYINT(1) NOT NULL DEFAULT 0
  AFTER payment_status_id;

-- 2. Re-create v_clients_list to expose is_archived
--    (DROP + CREATE is the safest way to replace a view)
DROP VIEW IF EXISTS v_clients_list;

CREATE VIEW v_clients_list AS
SELECT
    p.id             AS project_id,
    p.user_id,
    c.full_name      AS client_name,
    p.project_name,
    pt.name          AS project_type,
    p.rate_amount,
    p.revision_count,
    p.date_negotiated,
    ds.name          AS design_status,
    ps.name          AS payment_status,
    p.is_archived,
    p.created_at,
    p.updated_at
FROM projects p
JOIN clients         c  ON c.id  = p.client_id
JOIN project_types   pt ON pt.id = p.project_type_id
JOIN design_statuses ds ON ds.id = p.design_status_id
JOIN payment_statuses ps ON ps.id = p.payment_status_id;
