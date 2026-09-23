-- ==========================================
-- 1. FAMILIES (No foreign keys)
-- ==========================================
INSERT INTO families (id, family_name, quotient_familial, address) VALUES
(1001, 'Dupont', 550.00, '12 Rue de Paris, Paris'),
(1002, 'Martin', 850.50, '45 Avenue de la République, Lyon'),
(1003, 'Bernard', 1200.00, '8 Boulevard Victor Hugo, Marseille'),
(1004, 'Dubois', 450.25, '3 Rue de la Liberté, Nice'),
(1005, 'Thomas', 950.00, '19 Place Bellecour, Lyon');

-- ==========================================
-- 2. ASSOCIATIONS (No foreign keys)
-- ==========================================
INSERT INTO associations (name, contact_email, description, phone, base_price, siren_number) VALUES
('Paris Athletic Club', 'contact@parisac.fr', 'Main sports club in Paris', '+33100000001', 50.00, '12345678901234'),
('Lyon Sports Association', 'info@lyonsports.fr', 'Multisport association in Lyon', '+33400000002', 45.00, '22345678901234'),
('Marseille Nautique', 'contact@marseillenautique.fr', 'Water sports club', '+33491000003', 60.00, '32345678901234'),
('Nice Tennis Club', 'info@nicetennis.fr', 'Tennis club', '+33493000004', 70.00, '42345678901234'),
('Bordeaux Running', 'contact@bordeauxrun.fr', 'Running and athletics', '+33556000005', 40.00, '52345678901234');

-- ==========================================
-- 3. FACILITIES (Depends on associations)
-- ==========================================
INSERT INTO facilities (name, erp_capacity, is_divisible, parent_facility_id, association_id) VALUES
('Stade Municipal de Paris', 5000, FALSE, NULL, 1),
('Gymnase Lyon Centre', 300, TRUE, NULL, 2),
('Base Nautique Marseille', 150, FALSE, NULL, 3),
('Court Central Nice', 1200, FALSE, NULL, 4),
('Parc Bordeaux', 800, TRUE, NULL, 5);

-- ==========================================
-- 4. MEMBERS (Depends on families)
-- ==========================================
INSERT INTO members (is_resident, family_id, first_name, last_name, birth_date, medical_certificate_date, pass_sport_code) VALUES
(TRUE, 1001, 'Jean', 'Dupont', '1995-05-12', '2024-01-10', 'PASS123'),
(FALSE, 1002, 'Marie', 'Martin', '1988-11-22', '2023-06-15', NULL),
(TRUE, 1003, 'Luc', 'Bernard', '2001-02-03', '2025-02-20', 'PASS456'),
(TRUE, 1004, 'Sophie', 'Dubois', '1992-09-30', '2024-11-05', NULL),
(FALSE, 1005, 'Pierre', 'Thomas', '1985-07-19', '2022-12-01', NULL);

-- ==========================================
-- 5. ACTIVITIES (Depends on associations & facilities)
-- ==========================================
INSERT INTO activities (association_id, facility_id, title, base_price, max_capacity, activity_date, start_time, end_time) VALUES
(1, 1, 'Football Training', 50.00, 22, '2026-06-01', '14:00:00', '16:00:00'),
(2, 2, 'Basketball League', 45.00, 10, '2026-06-02', '10:00:00', '12:00:00'),
(3, 3, 'Sailing Intro', 60.00, 8, '2026-06-03', '09:00:00', '12:00:00'),
(4, 4, 'Tennis Tournament', 70.00, 4, '2026-06-04', '15:00:00', '18:00:00'),
(5, 5, 'Morning Jog', 40.00, 50, '2026-06-05', '08:00:00', '09:30:00');

-- ==========================================
-- 6. REGISTRATIONS (Depends on members & activities)
-- ==========================================
INSERT INTO registrations (member_id, activity_id, base_price, final_price, status) VALUES
(1, 1, 50.00, 35.00, 'confirmed'),
(2, 2, 45.00, 45.00, 'confirmed'),
(3, 3, 60.00, 42.00, 'confirmed'),
(4, 4, 70.00, 70.00, 'cancelled'),
(5, 5, 40.00, 30.00, 'medical_non_compliant');

-- ==========================================
-- 7. WAITING_LIST (Depends on activities, members, families)
-- ==========================================
INSERT INTO waiting_list (activity_id, member_id, is_resident, family_id, first_name, last_name, birth_date, status, medical_certificate_date, pass_sport_code, priority_score) VALUES
(1, 2, FALSE, 1002, 'Marie', 'Martin', '1988-11-22', 'waiting', '2023-06-15', NULL, 10),
(2, 1, TRUE, 1001, 'Jean', 'Dupont', '1995-05-12', 'promoted_pending', '2024-01-10', 'PASS123', 25),
(3, 4, TRUE, 1004, 'Sophie', 'Dubois', '1992-09-30', 'expired', '2024-11-05', NULL, 5),
(4, 5, FALSE, 1005, 'Pierre', 'Thomas', '1985-07-19', 'converted', '2022-12-01', NULL, 0),
(5, 3, TRUE, 1003, 'Luc', 'Bernard', '2001-02-03', 'waiting', '2025-02-20', 'PASS456', 15);