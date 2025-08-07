-- Test data for SGD Backend
-- This file is loaded during testing to provide consistent test data

-- Insert test clubs
INSERT INTO clubs (id, name, description, email, phone, address, active, created_at, updated_at) VALUES
(1, 'Club Deportivo Test', 'Club principal para testing', 'club@test.com', '+503 1234-5678', 'San Salvador, El Salvador', true, NOW(), NOW()),
(2, 'Club Secundario', 'Club secundario para testing', 'club2@test.com', '+503 2345-6789', 'Santa Ana, El Salvador', true, NOW(), NOW());

-- Insert test venues
INSERT INTO venues (id, club_id, name, code, address, phone, active, created_at, updated_at) VALUES
(1, 1, 'Sede Central', 'SC001', 'Centro de San Salvador', '+503 1111-2222', true, NOW(), NOW()),
(2, 1, 'Sede Norte', 'SN001', 'Norte de San Salvador', '+503 1111-3333', true, NOW(), NOW()),
(3, 2, 'Sede Santa Ana', 'SSA001', 'Centro de Santa Ana', '+503 2222-1111', true, NOW(), NOW());

-- Insert test sports
INSERT INTO sports (id, name, description, active, created_at, updated_at) VALUES
(1, 'Fútbol', 'Fútbol asociación masculino y femenino', true, NOW(), NOW()),
(2, 'Natación', 'Natación deportiva en diversas modalidades', true, NOW(), NOW()),
(3, 'Baloncesto', 'Baloncesto masculino y femenino', true, NOW(), NOW());

-- Insert test categories
INSERT INTO categories (id, sport_id, name, min_age, max_age, active, created_at, updated_at) VALUES
(1, 1, 'Infantil', 6, 10, true, NOW(), NOW()),
(2, 1, 'Juvenil', 11, 15, true, NOW(), NOW()),
(3, 1, 'Cadete', 16, 18, true, NOW(), NOW()),
(4, 1, 'Adulto', 19, 40, true, NOW(), NOW()),
(5, 2, 'Infantil', 6, 12, true, NOW(), NOW()),
(6, 2, 'Juvenil', 13, 17, true, NOW(), NOW()),
(7, 2, 'Adulto', 18, 35, true, NOW(), NOW()),
(8, 3, 'Juvenil', 12, 17, true, NOW(), NOW()),
(9, 3, 'Adulto', 18, 35, true, NOW(), NOW());

-- Insert test guardians
INSERT INTO guardians (id, full_name, email, phone, secondary_phone, address, identification_number, active, created_at, updated_at) VALUES
(1, 'María Elena Pérez', 'maria.perez@test.com', '+503 7777-1111', '+503 7777-2222', 'Residencial Los Robles', '12345678-9', true, NOW(), NOW()),
(2, 'Carlos Roberto Martínez', 'carlos.martinez@test.com', '+503 7777-3333', NULL, 'Colonia Escalón', '98765432-1', true, NOW(), NOW()),
(3, 'Ana Sofía López', 'ana.lopez@test.com', '+503 7777-4444', '+503 7777-5555', 'Soyapango', '11223344-5', true, NOW(), NOW()),
(4, 'Roberto Carlos Hernández', NULL, '+503 7777-6666', NULL, 'Mejicanos', '55667788-9', true, NOW(), NOW());

-- Insert test athletes
INSERT INTO athletes (id, club_id, venue_id, sport_id, category_id, full_name, birth_date, gender, email, phone, address, identification_number, emergency_contact, emergency_phone, medical_notes, registration_date, active, created_at, updated_at) VALUES
(1, 1, 1, 1, 2, 'Juan Carlos Pérez', '2010-03-15', 'M', 'juan.perez@test.com', '+503 6666-1111', 'San Salvador Centro', '11111111-1', 'María Elena Pérez', '+503 7777-1111', 'Alergia a mariscos', '2024-01-15', true, NOW(), NOW()),
(2, 1, 1, 1, 3, 'Ana María González', '2006-07-22', 'F', 'ana.gonzalez@test.com', '+503 6666-2222', 'Colonia Miramonte', '22222222-2', 'Carlos Roberto Martínez', '+503 7777-3333', NULL, '2024-02-01', true, NOW(), NOW()),
(3, 1, 2, 2, 6, 'Diego Alejandro Morales', '2008-11-10', 'M', NULL, NULL, 'Ciudad Delgado', '33333333-3', 'Ana Sofía López', '+503 7777-4444', 'Asma leve', '2024-02-15', true, NOW(), NOW()),
(4, 1, 1, 1, 4, 'Patricia Isabel Ramírez', '1995-05-30', 'F', 'patricia.ramirez@test.com', '+503 6666-4444', 'Antiguo Cuscatlán', '44444444-4', 'Roberto Ramírez', '+503 8888-1111', NULL, '2024-03-01', true, NOW(), NOW()),
(5, 2, 3, 3, 9, 'Roberto Ernesto Silva', '1998-09-12', 'M', 'roberto.silva@test.com', '+503 6666-5555', 'Santa Ana Centro', '55555555-5', 'Elena Silva', '+503 8888-2222', 'Lesión previa en rodilla', '2024-03-15', true, NOW(), NOW());

-- Insert test athlete-guardian relationships
INSERT INTO athlete_guardians (id, athlete_id, guardian_id, relationship, is_primary, active, created_at) VALUES
(1, 1, 1, 'madre', true, true, NOW()),
(2, 2, 2, 'padre', true, true, NOW()),
(3, 3, 3, 'madre', true, true, NOW()),
(4, 3, 4, 'padre', false, true, NOW());

-- Set sequences to continue from test data
SELECT setval('clubs_id_seq', 10);
SELECT setval('venues_id_seq', 10);
SELECT setval('sports_id_seq', 10);
SELECT setval('categories_id_seq', 20);
SELECT setval('guardians_id_seq', 10);
SELECT setval('athletes_id_seq', 10);
SELECT setval('athlete_guardians_id_seq', 10);