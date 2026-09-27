TRUNCATE TABLE registrations, activities, facilities, association_members, associations, members, families RESTART IDENTITY CASCADE;

INSERT INTO families (id, family_name, quotient_familial, address) VALUES
(1, 'Dupont', 550.00, '10 Rue de Paris'),
(2, 'Martin', 1200.00, '25 Avenue de Lyon');

INSERT INTO members (id, family_id, is_resident, first_name, last_name, email, phone, birth_date, medical_certificate_date, pass_sport_code) VALUES
(1, 1, TRUE, 'Zakaria', 'Lafhiel', 'zakaria@gmail.com', '+212727595231', '1997-09-03', '2022-02-28', 'PASS001'),
(2, 1, TRUE, 'Fatima', 'Dupont', 'fatima@gmail.com', '+212727595232', '1999-05-12', '2023-01-15', NULL),
(3, 2, FALSE, 'Jean', 'Martin', 'jean@gmail.com', '+33612345678', '1985-11-20', '2023-06-10', NULL);

INSERT INTO associations (id, name, contact_email, description, phone, base_price, siren_number) VALUES
(1, 'Sport Club Association', 'contact@sportclub.com', 'A local sports association', '+33123456789', 431.00, '12345678901234'),
(2, 'Community Sports Association', 'contact@communitysport.com', 'A community sports association', '+33123456788', 250.00, '98765432109876');

INSERT INTO association_members (association_id, member_id, family_id, first_name, last_name, email, phone, date_of_birth, is_resident, quotient_familial, medical_certificate_date, pass_sport_code, final_price, status) VALUES
(1, 1, 1, 'Zakaria', 'Lafhiel', 'zakaria@gmail.com', '+212727595231', '1997-09-03', TRUE, 550.00, '2022-02-28', 'PASS001', 120.00, 'accepted'),
(2, 3, 2, 'Jean', 'Martin', 'jean@gmail.com', '+33612345678', '1985-11-20', FALSE, 1200.00, '2023-06-10', NULL, 200.00, 'pending');

INSERT INTO facilities (id, name, description, erp_capacity, is_divisible, association_id) VALUES
(1, 'Main Stadium', 'Outdoor professional sports stadium with athletic tracks and natural grass pitch.', 5000, FALSE, 1),
(2, 'Indoor Arena', 'Multi-purpose indoor court suitable for basketball, volleyball, and handball.', 1200, TRUE, 1),
(3, 'Training Pitch A', 'Synthetic turf training ground for football practice and warm-ups.', 300, FALSE, 2),
(4, 'Swimming Pool Complex', 'Olympic size indoor swimming pool with spectator seating.', 800, FALSE, 2),
(5, 'Fitness Gym', 'Fully equipped weightlifting, resistance training, and cardio room.', 150, FALSE, 1);

INSERT INTO activities (id, association_id, facility_id, title, max_capacity, current_participants_number, activity_date, start_time, end_time) VALUES
(1, 1, 1, 'Basketball Practice', 20, 5, '2024-03-10', '10:00:00', '12:00:00'),
(2, 1, 2, 'Volleyball Tournament', 30, 12, '2024-05-22', '14:00:00', '17:00:00'),
(3, 2, 3, 'Football Training', 25, 8, '2024-07-15', '09:00:00', '11:00:00'),
(4, 2, 4, 'Swimming Lessons', 15, 15, '2024-09-05', '08:00:00', '09:30:00'),
(5, 1, 5, 'Fitness Bootcamp', 20, 3, '2024-11-18', '07:00:00', '08:30:00');

INSERT INTO registrations (member_id, activity_id, status) VALUES
(1, 1, 'accepted'),
(2, 2, 'pending'),
(3, 3, 'accepted'),
(1, 4, 'rejected'),
(2, 5, 'pending');

SELECT setval(pg_get_serial_sequence('families', 'id'), COALESCE(MAX(id), 1)) FROM families;
SELECT setval(pg_get_serial_sequence('members', 'id'), COALESCE(MAX(id), 1)) FROM members;
SELECT setval(pg_get_serial_sequence('associations', 'id'), COALESCE(MAX(id), 1)) FROM associations;
SELECT setval(pg_get_serial_sequence('association_members', 'id'), COALESCE(MAX(id), 1)) FROM association_members;
SELECT setval(pg_get_serial_sequence('facilities', 'id'), COALESCE(MAX(id), 1)) FROM facilities;
SELECT setval(pg_get_serial_sequence('activities', 'id'), COALESCE(MAX(id), 1)) FROM activities;
SELECT setval(pg_get_serial_sequence('registrations', 'id'), COALESCE(MAX(id), 1)) FROM registrations;
