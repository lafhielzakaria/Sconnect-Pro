INSERT INTO families (id, family_name, quotient_familial, address) VALUES
(1, 'Dupont', 550.00, '10 Rue de Paris'),
(2, 'Martin', 1200.00, '25 Avenue de Lyon');

INSERT INTO members (id, family_id, is_resident, first_name, last_name, email, phone, birth_date, medical_certificate_date, pass_sport_code) VALUES
(1, 1, true, 'zakaria', 'zakaria', 'lafhielzakaria@gmail.com', '+212727595231', '1997-09-03', '2022-02-28', 'Quasi sequi ipsam qu'),
(2, 1, true, 'Fatima', 'Dupont', 'fatima@gmail.com', '+212727595232', '1999-05-12', '2023-01-15', NULL),
(3, 2, false, 'Jean', 'Martin', 'jean@gmail.com', '+33612345678', '1985-11-20', '2023-06-10', NULL);

INSERT INTO associations (id, name, contact_email, description, phone, base_price, siren_number) VALUES
(17, 'Sport Club Association', 'contact@sportclub.com', 'A local sports association', '+33123456789', 431.00, '12345678901234');

INSERT INTO association_members (association_id, member_id, family_id, first_name, last_name, email, phone, date_of_birth, is_resident, quotient_familial, medical_certificate_date, pass_sport_code, final_price, status) VALUES
(17, 1, 1, 'zakaria', 'zakaria', 'lafhielzakaria@gmail.com', '+212727595231', '1997-09-03', true, 59.00, '2022-02-28', 'Quasi sequi ipsam qu', 431.00, 'pending');

INSERT INTO facilities (id, name, erp_capacity, is_divisible, parent_facility_id, association_id) VALUES
(1, 'Main Gymnasium', 100, false, NULL, 17);

INSERT INTO activities (id, association_id, facility_id, title, max_capacity, activity_date, start_time, end_time) VALUES
(1, 17, 1, 'Basketball Practice', 20, '2026-10-01', '10:00:00', '12:00:00');

INSERT INTO registrations (member_id, activity_id, status) VALUES
(1, 1, 'pending');