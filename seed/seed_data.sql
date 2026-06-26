
-- =============================================================================
-- SEED DATA  (mirrors the mock data in store.ts)
-- =============================================================================

-- Designer account
INSERT INTO users (id, full_name, initials, profession, email, password_hash) VALUES
    ('00000000-0000-0000-0000-000000000001',
     'Owen M. Jerusalem', 'OJ', 'Graphic Designer',
     'owen@oj-track.dev', 'CHANGE_ME_HASHED_PASSWORD');

-- Clients (de-duplicated from store.ts clientName values)
INSERT INTO clients (id, full_name) VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Jessa Reyes'),
    ('c1000000-0000-0000-0000-000000000002', 'Mark Santos'),
    ('c1000000-0000-0000-0000-000000000003', 'Nina Cruz'),
    ('c1000000-0000-0000-0000-000000000004', 'Leo Tan'),
    ('c1000000-0000-0000-0000-000000000005', 'Sofia Lim'),
    ('c1000000-0000-0000-0000-000000000006', 'Ryan Dela Cruz'),
    ('c1000000-0000-0000-0000-000000000007', 'Ana Villanueva'),
    ('c1000000-0000-0000-0000-000000000008', 'Kevin Go'),
    ('c1000000-0000-0000-0000-000000000009', 'Bea Ocampo'),
    ('c1000000-0000-0000-0000-000000000010', 'Chris Morales'),
    ('c1000000-0000-0000-0000-000000000011', 'Ella Torres'),
    ('c1000000-0000-0000-0000-000000000012', 'Dan Aquino');

-- Projects
INSERT INTO projects
    (id, user_id, client_id, project_name, project_type_id,
     rate_amount, revision_count, date_negotiated,
     design_status_id, payment_status_id)
VALUES
    ('p0000001-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000001',
     'Brand Identity Redesign',
     (SELECT id FROM project_types WHERE name = 'Branding'),
     12000, 3, '2026-01-15',
     (SELECT id FROM design_statuses WHERE name = 'Done'),
     (SELECT id FROM payment_statuses WHERE name = 'Paid')),

    ('p0000002-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000002',
     'App UI Design',
     (SELECT id FROM project_types WHERE name = 'UI/UX'),
     18500, 5, '2026-02-03',
     (SELECT id FROM design_statuses WHERE name = 'Done'),
     (SELECT id FROM payment_statuses WHERE name = 'Paid')),

    ('p0000003-0000-0000-0000-000000000003',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000003',
     'Logo Concept Pack',
     (SELECT id FROM project_types WHERE name = 'Logo'),
     5000, 2, '2026-02-18',
     (SELECT id FROM design_statuses WHERE name = 'Done'),
     (SELECT id FROM payment_statuses WHERE name = 'Paid')),

    ('p0000004-0000-0000-0000-000000000004',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000004',
     'Product Flyer Series',
     (SELECT id FROM project_types WHERE name = 'Print'),
     4500, 1, '2026-03-01',
     (SELECT id FROM design_statuses WHERE name = 'Pending'),
     (SELECT id FROM payment_statuses WHERE name = 'Partial')),

    ('p0000005-0000-0000-0000-000000000005',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000005',
     'E-commerce Website',
     (SELECT id FROM project_types WHERE name = 'Web'),
     35000, 0, '2026-03-12',
     (SELECT id FROM design_statuses WHERE name = 'Pending'),
     (SELECT id FROM payment_statuses WHERE name = 'Partial')),

    ('p0000006-0000-0000-0000-000000000006',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000006',
     'Character Illustration Set',
     (SELECT id FROM project_types WHERE name = 'Illustration'),
     9000, 4, '2026-03-25',
     (SELECT id FROM design_statuses WHERE name = 'Done'),
     (SELECT id FROM payment_statuses WHERE name = 'Paid')),

    ('p0000007-0000-0000-0000-000000000007',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000007',
     'Company Profile Layout',
     (SELECT id FROM project_types WHERE name = 'Print'),
     7500, 2, '2026-04-08',
     (SELECT id FROM design_statuses WHERE name = 'Pending'),
     (SELECT id FROM payment_statuses WHERE name = 'Not Paid')),

    ('p0000008-0000-0000-0000-000000000008',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000008',
     'Mobile App Prototype',
     (SELECT id FROM project_types WHERE name = 'UI/UX'),
     22000, 6, '2026-04-20',
     (SELECT id FROM design_statuses WHERE name = 'Not Started'),
     (SELECT id FROM payment_statuses WHERE name = 'Not Paid')),

    ('p0000009-0000-0000-0000-000000000009',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000009',
     'Social Media Kit',
     (SELECT id FROM project_types WHERE name = 'Branding'),
     6000, 1, '2026-05-03',
     (SELECT id FROM design_statuses WHERE name = 'Not Started'),
     (SELECT id FROM payment_statuses WHERE name = 'Not Paid')),

    ('p0000010-0000-0000-0000-000000000010',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000010',
     'Restaurant Menu Design',
     (SELECT id FROM project_types WHERE name = 'Print'),
     3500, 0, '2026-05-17',
     (SELECT id FROM design_statuses WHERE name = 'Not Started'),
     (SELECT id FROM payment_statuses WHERE name = 'Not Paid')),

    ('p0000011-0000-0000-0000-000000000011',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000011',
     'Portfolio Website',
     (SELECT id FROM project_types WHERE name = 'Web'),
     15000, 2, '2026-05-28',
     (SELECT id FROM design_statuses WHERE name = 'Pending'),
     (SELECT id FROM payment_statuses WHERE name = 'Partial')),

    ('p0000012-0000-0000-0000-000000000012',
     '00000000-0000-0000-0000-000000000001',
     'c1000000-0000-0000-0000-000000000012',
     'Event Poster Pack',
     (SELECT id FROM project_types WHERE name = 'Print'),
     4000, 1, '2026-06-05',
     (SELECT id FROM design_statuses WHERE name = 'Not Started'),
     (SELECT id FROM payment_statuses WHERE name = 'Not Paid'));
