-- =============================================================================
-- OJ-Track Seed Data
-- 5 clients (+ 1 designer user + 1 project per client so v_clients_list
-- actually returns rows for the Clients page).
-- Run AFTER oj_track_schema.sql.
-- =============================================================================

USE oj_track;

-- ---------------------------------------------------------------------------
-- 1 designer / user account
-- ---------------------------------------------------------------------------
INSERT INTO users (full_name, initials, profession, email, password_hash) VALUES
    ('Owen M. Jerusalem', 'OJ', 'Graphic Designer', 'owen@ojtrack.test', 'CHANGE_ME_HASH');

-- ---------------------------------------------------------------------------
-- 5 clients
-- ---------------------------------------------------------------------------
INSERT INTO clients (full_name, email, phone, notes) VALUES
    ('Maria Santos',        'maria.santos@example.com',     '0917-123-4567', 'Repeat client, prefers minimalist style'),
    ('Bukidnon AgriCoop',   'info@bukidnonagricoop.ph',      '0928-555-1212', 'Local agri cooperative, branding refresh'),
    ('Carlo Reyes',         'carlo.reyes@example.com',       '0939-888-7654', 'Freelance photographer, needs portfolio site'),
    ('Northern Mindanao Cafe', 'hello@nmcafe.ph',            '0905-222-3344', 'Logo + menu design'),
    ('Liza Fernandez',      'liza.fernandez@example.com',    '0916-444-9090', 'Wedding invitation design, tight deadline');

-- ---------------------------------------------------------------------------
-- 1 sample project per client
-- (project_type_id, design_status_id, payment_status_id reference the
--  lookup tables seeded in oj_track_schema.sql: 1=Logo/Not Started/Not Paid,
--  2=UI/UX/Pending/Partial, 3=Branding/Done/Paid, etc.)
-- ---------------------------------------------------------------------------
INSERT INTO projects (
    user_id, client_id, project_name, project_type_id,
    rate_amount, revision_count, date_negotiated,
    design_status_id, payment_status_id, is_archived
) VALUES
    (1, 1, 'Personal Brand Logo',        1, 3500.00,  2, '2026-05-02', 3, 3, 0),  -- Maria Santos: Logo, Done, Paid
    (1, 2, 'Cooperative Brand Identity', 3, 12000.00, 4, '2026-05-10', 2, 2, 0),  -- AgriCoop: Branding, Pending, Partial
    (1, 3, 'Photography Portfolio Site', 5, 8500.00,  1, '2026-05-18', 1, 1, 0),  -- Carlo Reyes: Web, Not Started, Not Paid
    (1, 4, 'Cafe Logo & Menu Design',    1, 4200.00,  3, '2026-05-22', 3, 3, 0),  -- NM Cafe: Logo, Done, Paid
    (1, 5, 'Wedding Invitation Set',     6, 2800.00,  1, '2026-06-01', 2, 1, 0);  -- Liza Fernandez: Illustration, Pending, Not Paid
