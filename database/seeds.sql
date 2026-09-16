TRUNCATE TABLE waiting_list, registrations, activities, facilities, associations, members, families RESTART IDENTITY CASCADE;

INSERT INTO families (family_name, quotient_familial, is_resident, address) VALUES
('Dupont', 450.00, TRUE, '12 Rue de la Paix, 75002 Paris'),
('Martin', 850.50, TRUE, '45 Avenue Victor Hugo, 75016 Paris'),
('Bernard', 1200.00, FALSE, '8 Boulevard Haussmann, 75009 Paris'),
('Moreau', 300.00, TRUE, '27 Rue de la République, 69002 Lyon');

INSERT INTO members (family_id, first_name, last_name, birth_date, medical_certificate_date, pass_sport_code) VALUES
(1, 'Jean', 'Dupont', '2012-05-14', '2025-09-01', 'PS-2025-8841'),
(1, 'Marie', 'Dupont', '2015-08-22', '2025-09-01', 'PS-2025-8842'),
(2, 'Lucas', 'Martin', '2010-11-03', '2025-08-15', NULL),
(3, 'Emma', 'Bernard', '2008-03-30', '2024-06-10', NULL), 
(4, 'Liam', 'Moreau', '2014-01-19', '2025-09-05', 'PS-2025-1092');

INSERT INTO associations (name, contact_email, phone, siren_number) VALUES
('Paris Multi-Sport Club', 'contact@parismultisport.fr', '+33142680000', '12345678900014'),
('Aquatic Club de Lyon', 'info@aquaticlyon.fr', '+33472001122', '98765432100028'),
('Dojo Arts Martiaux', 'contact@dojoam.org', '+33140506070', '55566677700039');

INSERT INTO facilities (name, erp_capacity, is_divisible, parent_facility_id, association_id) VALUES
('Gymnase Central - Halle Principale', 200, TRUE, NULL, 1),
('Gymnase Central - Terrain A', 100, FALSE, 1, 1), 
('Piscine Olympique Municipal', 150, FALSE, NULL, 2),
('Dojo Central', 50, FALSE, NULL, 3);

INSERT INTO activities (association_id, facility_id, title, base_price, max_capacity, activity_date, start_time, end_time) VALUES
(1, 2, 'Basketball Junior (8-12 ans)', 45.00, 2, '2026-10-05', '14:00:00', '16:00:00'),
(2, 3, 'Natation Performance', 60.00, 20, '2026-10-06', '10:00:00', '11:30:00'),
(3, 4, 'Judo Initiation', 35.00, 15, '2026-10-07', '17:00:00', '18:30:00');

INSERT INTO registrations (member_id, activity_id, base_price, final_price, status) VALUES
(1, 1, 45.00, 25.00, 'confirmed'),
(2, 1, 45.00, 25.00, 'confirmed'),
(3, 2, 60.00, 60.00, 'confirmed'),
(4, 3, 35.00, 35.00, 'medical_non_compliant');

INSERT INTO waiting_list (member_id, activity_id, priority_score, status, deadline_confirmation) VALUES
(3, 1, 10, 'waiting', NULL),
(5, 1, 5, 'promoted_pending', CURRENT_TIMESTAMP + INTERVAL '48 hours');