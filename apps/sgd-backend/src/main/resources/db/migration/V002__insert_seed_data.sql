-- SGD Backend Seed Data
-- Version: 1.0.0
-- Description: Insert basic configuration data for development and testing

-- Insert basic sports
INSERT INTO sports (name, description) VALUES
('Natación', 'Natación deportiva en diversas modalidades');

-- Insert categories for Football
INSERT INTO categories (sport_id, name, min_age, max_age) VALUES 
(1, 'Infantil', 8, 13),
(1, 'Infantil Juvenil', 14, 15),
(1, 'Juvenil', 16, 18),
(1, 'Mayo', 19, 60);

-- Insert default club for development (will be updated with real data)
INSERT INTO clubs (name, description, email, phone, address) VALUES 
('Waterpolo Academy',
 'Club dedicado a la formación y desarrollo de atletas en el deporte de waterpolo.',
 'desarrollo@sgd.com', 
 '+503 2222-0000', 
 'Polideportivo Ciudad Merliot, Santa Tecla');

-- Insert default venues for development
INSERT INTO venues (club_id, name, code, address, phone) VALUES 
(1, 'Polideportivo Ciudad Merliot', 'C001', 'Polideportivo de Ciudad Merliot, Santa Tecla', '+503 2222-0001');