-- 1. TRUNCATE ALL TABLES AND RESET IDENTITY SEQUENCES
TRUNCATE TABLE 
    waiting_list, 
    registrations, 
    activities, 
    facilities, 
    associations, 
    members, 
    families 
RESTART IDENTITY CASCADE;

-- 2. FAMILIES
INSERT INTO families (family_name, quotient_familial, address) VALUES
('Dupont', 550.00, '14 Avenue de la République, 75011 Paris'),
('Martin', 920.50, '8 Rue des Lilas, 69002 Lyon'),
('Bernard', 380.00, '22 Boulevard Victor Hugo, 13001 Marseille');

-- 3. MEMBERS (Will now cleanly start at ID 1, 2, 3, 4)
INSERT INTO members (is_resident, family_id, first_name, last_name, birth_date, medical_certificate_date, pass_sport_code) VALUES
(TRUE, 1, 'Jean', 'Dupont', '1985-04-12', '2025-09-01', NULL),
(TRUE, 1, 'Chloé', 'Dupont', '2012-06-15', '2025-08-20', 'PASS-2026-9982'),
(FALSE, 2, 'Lucas', 'Martin', '1990-11-03', '2025-07-10', NULL),
(TRUE, 3, 'Fatima', 'Bernard', '2005-02-25', '2026-01-15', 'PASS-2026-1104');

-- 4. ASSOCIATIONS
INSERT INTO associations (name, contact_email, description, phone, siren_number) VALUES
('Paris Aquatic Club', 'contact@aquaticclub.fr', 'Association de natation et water-polo pour tous les âges.', '0142385920', '12345678901234'),
('Lyon Basket Association', 'info@lyonbasket.org', 'Club de basketball dynamique favorisant le sport de proximité.', '0478291034', '98765432109876'),
('Marseille Multisports', 'bureau@marseille-multi.com', 'Activités sportives diversifiées, gymnastique et fitness.', '0491823746', '45678912345678');

-- 5. FACILITIES
INSERT INTO facilities (name, erp_capacity, is_divisible, parent_facility_id, association_id) VALUES
('Piscine Municipale Aqualude', 250, TRUE, NULL, 1),
('Gymnase Municipal Jean Bouin', 180, FALSE, NULL, 2),
('Complexe Sportif Paul Ricard', 300, TRUE, NULL, 3);

-- 6. ACTIVITIES
INSERT INTO activities (association_id, facility_id, title, base_price, max_capacity, activity_date, start_time, end_time) VALUES
(1, 1, 'Cours de Natation Adulte - Niveau 1', 120.00, 20, '2026-06-10', '18:00:00', '19:30:00'),
(2, 2, 'Entraînement Basketball U15', 90.00, 15, '2026-06-12', '14:00:00', '16:00:00'),
(3, 3, 'Fitness & Renforcement Musculaire', 80.00, 25, '2026-06-15', '19:00:00', '20:00:00');

-- 7. REGISTRATIONS (Now member_id 1, 2, 3, 4 are guaranteed to exist)
INSERT INTO registrations (member_id, activity_id, base_price, final_price, status) VALUES
(1, 1, 120.00, 102.00, 'confirmed'),
(2, 1, 120.00, 45.00, 'confirmed'),
(3, 2, 90.00, 90.00, 'confirmed'),
(4, 3, 80.00, 25.00, 'confirmed');

-- 8. WAITING LIST
INSERT INTO waiting_list (member_id, activity_id, priority_score, status, deadline_confirmation) VALUES
(3, 1, 5, 'waiting', NULL),
(1, 2, 2, 'promoted_pending', '2026-06-01 23:59:59+02');