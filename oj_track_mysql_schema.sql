-- =============================================================================
-- OJ-Track Database Schema (MySQL 8.0+)
-- Generated from: Dashboard, Clients, Reports, and Profile pages
-- Database:       MySQL 8.0+ (requires UUID() default expressions + CHECK support)
-- Normalization:  3NF (Third Normal Form)
-- Converted from: PostgreSQL version
-- =============================================================================

-- Notes on conversion from Postgres:
--   * UUID columns        -> CHAR(36) with DEFAULT (UUID())
--   * SERIAL/SMALLSERIAL   -> INT/SMALLINT AUTO_INCREMENT
--   * TIMESTAMPTZ          -> TIMESTAMP (MySQL stores in UTC internally)
--   * FILTER (WHERE ...)   -> SUM(CASE WHEN ... THEN 1 ELSE 0 END)
--   * EXTRACT/DATE_TRUNC   -> YEAR(), MONTH(), DATE_FORMAT()
--   * Explicit ENGINE=InnoDB on every table for FK + CHECK support

-- ---------------------------------------------------------------------------
-- DATABASE
-- ---------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS oj_track
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE oj_track;


-- =============================================================================
-- LOOKUP / REFERENCE TABLES  (1NF -> 2NF separation of repeating groups)
-- =============================================================================

-- 1. Project types  (Logo, UI/UX, Branding, Print, Web, Illustration ...)
CREATE TABLE project_types (
    id          SMALLINT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(64)        NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO project_types (name) VALUES
    ('Logo'),
    ('UI/UX'),
    ('Branding'),
    ('Print'),
    ('Web'),
    ('Illustration');


-- 2. Design statuses
CREATE TABLE design_statuses (
    id          SMALLINT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(32)        NOT NULL UNIQUE   -- 'Not Started' | 'Pending' | 'Done'
) ENGINE=InnoDB;

INSERT INTO design_statuses (name) VALUES
    ('Not Started'),
    ('Pending'),
    ('Done');


-- 3. Payment statuses
CREATE TABLE payment_statuses (
    id          SMALLINT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(32)        NOT NULL UNIQUE   -- 'Not Paid' | 'Partial' | 'Paid'
) ENGINE=InnoDB;

INSERT INTO payment_statuses (name) VALUES
    ('Not Paid'),
    ('Partial'),
    ('Paid');


-- =============================================================================
-- CORE ENTITY TABLES
-- =============================================================================

-- 4. Users / Designers  (Profile page: Owen M. Jerusalem - Graphic Designer)
--    A user record represents one designer account in the system.
CREATE TABLE users (
    id              CHAR(36)        NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    full_name       VARCHAR(128)    NOT NULL,
    initials        CHAR(4),                          -- derived, stored for display (e.g. 'OJ')
    profession      VARCHAR(128)    NOT NULL DEFAULT 'Graphic Designer',
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   TEXT            NOT NULL,
    avatar_url      TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- 5. Clients  (Clients page: client names that recur across multiple projects)
--    Separating client identity from project data (2NF / 3NF).
CREATE TABLE clients (
    id              CHAR(36)        NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    full_name       VARCHAR(128)    NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(32),
    notes           TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =============================================================================
-- TRANSACTION / FACT TABLES
-- =============================================================================

-- 6. Projects  (Core fact table used by Dashboard, Clients, and Reports pages)
--    Each row is one design engagement / job.
CREATE TABLE projects (
    id                  CHAR(36)        NOT NULL DEFAULT (UUID()) PRIMARY KEY,

    -- Ownership
    user_id             CHAR(36)        NOT NULL,
    client_id           CHAR(36)        NOT NULL,

    -- Project details (Clients page columns)
    project_name        VARCHAR(256)    NOT NULL,
    project_type_id     SMALLINT UNSIGNED NOT NULL,

    -- Financials (Clients / Reports page: rateAmount)
    rate_amount         DECIMAL(12, 2)  NOT NULL DEFAULT 0 CHECK (rate_amount >= 0),

    -- Work tracking (Clients page: revisionCount)
    revision_count      SMALLINT        NOT NULL DEFAULT 0 CHECK (revision_count >= 0),

    -- Timeline (Clients page: dateNegotiated)
    date_negotiated     DATE            NOT NULL,
    date_started        DATE,
    date_completed       DATE,

    -- Status (Clients / Dashboard: designStatus, paymentStatus)
    design_status_id    SMALLINT UNSIGNED NOT NULL DEFAULT 1,  -- 'Not Started'
    payment_status_id   SMALLINT UNSIGNED NOT NULL DEFAULT 1,  -- 'Not Paid'

    -- Soft delete flag (archive before hard-delete)
    is_archived         TINYINT(1)      NOT NULL DEFAULT 0,

    -- Audit
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_projects_user          FOREIGN KEY (user_id)          REFERENCES users(id)             ON DELETE CASCADE,
    CONSTRAINT fk_projects_client        FOREIGN KEY (client_id)        REFERENCES clients(id)           ON DELETE RESTRICT,
    CONSTRAINT fk_projects_type          FOREIGN KEY (project_type_id)  REFERENCES project_types(id),
    CONSTRAINT fk_projects_design_status FOREIGN KEY (design_status_id) REFERENCES design_statuses(id),
    CONSTRAINT fk_projects_pay_status    FOREIGN KEY (payment_status_id) REFERENCES payment_statuses(id),

    CONSTRAINT chk_dates CHECK (
        (date_started IS NULL OR date_started >= date_negotiated) AND
        (date_completed IS NULL OR date_completed >= COALESCE(date_started, date_negotiated))
    )
) ENGINE=InnoDB;


-- 7. Payments  (Detailed payment records; drives paymentStatus aggregate)
--    Partial payments are tracked here; the payment_status on projects is
--    derived / denormalized for fast reads.
CREATE TABLE payments (
    id              CHAR(36)        NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    project_id      CHAR(36)        NOT NULL,
    amount          DECIMAL(12, 2)  NOT NULL CHECK (amount > 0),
    paid_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reference_no    VARCHAR(128),
    notes           TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- 8. Revisions  (Optional granular log; revisionCount is the summary column)
CREATE TABLE revisions (
    id              CHAR(36)        NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    project_id      CHAR(36)        NOT NULL,
    revision_no     SMALLINT        NOT NULL,   -- 1-based within the project
    description     TEXT,
    requested_at    DATE            NOT NULL DEFAULT (CURRENT_DATE),
    resolved_at     DATE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_revisions_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY uq_project_revision (project_id, revision_no)
) ENGINE=InnoDB;


-- =============================================================================
-- REPORTING / ANALYTICS SUPPORT
-- =============================================================================

-- 9. Monthly Summary  (Materialised snapshot used by Dashboard ActivityChart
--    and Reports Monthly Sales BarChart: month, clients count, sales total)
--    In MySQL this is a plain table, refreshed periodically (no native
--    materialised views), or you can swap it for the v_monthly_activity
--    view below and skip storing it altogether.
CREATE TABLE monthly_summaries (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id         CHAR(36)        NOT NULL,
    year            SMALLINT        NOT NULL,
    month           SMALLINT        NOT NULL CHECK (month BETWEEN 1 AND 12),
    client_count    INT             NOT NULL DEFAULT 0,
    total_sales     DECIMAL(14, 2)  NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_monthly_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_year_month (user_id, year, month)
) ENGINE=InnoDB;


-- =============================================================================
-- INDEXES  (performance for common query patterns)
-- =============================================================================

-- Projects lookups
CREATE INDEX idx_projects_user_id         ON projects (user_id);
CREATE INDEX idx_projects_client_id       ON projects (client_id);
CREATE INDEX idx_projects_date_negotiated ON projects (date_negotiated DESC);
CREATE INDEX idx_projects_design_status   ON projects (design_status_id);
CREATE INDEX idx_projects_payment_status  ON projects (payment_status_id);
CREATE INDEX idx_projects_project_type    ON projects (project_type_id);

-- Payment lookups
CREATE INDEX idx_payments_project_id      ON payments (project_id);

-- Revision lookups
CREATE INDEX idx_revisions_project_id     ON revisions (project_id);

-- Monthly summaries
CREATE INDEX idx_monthly_user_year_month  ON monthly_summaries (user_id, year, month);


-- =============================================================================
-- VIEWS  (convenience for frontend API queries)
-- =============================================================================

-- v_clients_list  ->  feeds the Clients page table
CREATE OR REPLACE VIEW v_clients_list AS
SELECT
    p.id                        AS project_id,
    p.project_name,
    c.full_name                 AS client_name,
    pt.name                     AS project_type,
    p.rate_amount,
    p.revision_count,
    p.date_negotiated,
    ds.name                     AS design_status,
    ps.name                     AS payment_status,
    p.user_id
FROM projects           p
JOIN clients            c  ON c.id = p.client_id
JOIN project_types      pt ON pt.id = p.project_type_id
JOIN design_statuses    ds ON ds.id = p.design_status_id
JOIN payment_statuses   ps ON ps.id = p.payment_status_id;


-- v_dashboard_stats  ->  feeds Dashboard StatsCards (one row per user)
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT
    p.user_id,
    COUNT(*)                                                              AS total_projects,
    SUM(p.rate_amount)                                                    AS total_sales,
    SUM(CASE WHEN ds.name = 'Not Started' THEN 1 ELSE 0 END)             AS not_started,
    SUM(CASE WHEN ds.name = 'Pending'     THEN 1 ELSE 0 END)             AS pending,
    SUM(CASE WHEN ds.name = 'Done'        THEN 1 ELSE 0 END)             AS done,
    SUM(CASE WHEN ps.name = 'Not Paid'    THEN 1 ELSE 0 END)             AS pay_not_paid,
    SUM(CASE WHEN ps.name = 'Partial'     THEN 1 ELSE 0 END)             AS pay_partial,
    SUM(CASE WHEN ps.name = 'Paid'        THEN 1 ELSE 0 END)             AS pay_paid
FROM projects           p
JOIN design_statuses    ds ON ds.id = p.design_status_id
JOIN payment_statuses   ps ON ps.id = p.payment_status_id
GROUP BY p.user_id;


-- v_recent_projects  ->  feeds Dashboard RecentProjects widget (last 5)
CREATE OR REPLACE VIEW v_recent_projects AS
SELECT
    p.id                        AS project_id,
    p.project_name,
    c.full_name                 AS client_name,
    pt.name                     AS project_type,
    p.rate_amount,
    ds.name                     AS design_status,
    ps.name                     AS payment_status,
    p.date_negotiated,
    p.user_id
FROM projects           p
JOIN clients            c  ON c.id = p.client_id
JOIN project_types      pt ON pt.id = p.project_type_id
JOIN design_statuses    ds ON ds.id = p.design_status_id
JOIN payment_statuses   ps ON ps.id = p.payment_status_id
ORDER BY p.date_negotiated DESC;


-- v_sales_by_type  ->  feeds Reports "Sales by Project Type" horizontal bar chart
CREATE OR REPLACE VIEW v_sales_by_type AS
SELECT
    p.user_id,
    pt.name                     AS project_type,
    SUM(p.rate_amount)          AS total_sales
FROM projects       p
JOIN project_types  pt ON pt.id = p.project_type_id
GROUP BY p.user_id, pt.name
ORDER BY total_sales DESC;


-- v_monthly_activity  ->  feeds Dashboard ActivityChart + Reports Monthly Sales bar chart
CREATE OR REPLACE VIEW v_monthly_activity AS
SELECT
    p.user_id,
    DATE_FORMAT(p.date_negotiated, '%b') AS month,
    YEAR(p.date_negotiated)              AS year,
    MONTH(p.date_negotiated)             AS month_num,
    COUNT(DISTINCT p.client_id)          AS client_count,
    SUM(p.rate_amount)                   AS total_sales
FROM projects p
GROUP BY p.user_id,
         YEAR(p.date_negotiated),
         MONTH(p.date_negotiated),
         DATE_FORMAT(p.date_negotiated, '%b')
ORDER BY year, month_num;

