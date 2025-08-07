-- SGD Backend Seed Data
-- Version: 1.0.0
-- Description: Insert basic configuration data for development and testing

-- Insert basic sports
INSERT INTO sports (name, description) VALUES 
('Fútbol', 'Fútbol asociación masculino y femenino'),
('Natación', 'Natación deportiva en diversas modalidades'),
('Baloncesto', 'Baloncesto masculino y femenino'),
('Tenis', 'Tenis individual y dobles'),
('Voleibol', 'Voleibol de playa y cancha'),
('Atletismo', 'Carreras, saltos y lanzamientos');

-- Insert categories for Football
INSERT INTO categories (sport_id, name, min_age, max_age) VALUES 
(1, 'Infantil', 6, 10),
(1, 'Juvenil', 11, 15),
(1, 'Cadete', 16, 18),
(1, 'Adulto', 19, 40),
(1, 'Veterano', 41, 60);

-- Insert categories for Swimming
INSERT INTO categories (sport_id, name, min_age, max_age) VALUES 
(2, 'Infantil', 6, 12),
(2, 'Juvenil', 13, 17),
(2, 'Adulto', 18, 35),
(2, 'Master', 36, 60);

-- Insert categories for Basketball
INSERT INTO categories (sport_id, name, min_age, max_age) VALUES 
(3, 'Infantil', 8, 12),
(3, 'Juvenil', 13, 17),
(3, 'Adulto', 18, 35);

-- Insert categories for Tennis
INSERT INTO categories (sport_id, name, min_age, max_age) VALUES 
(4, 'Infantil', 6, 12),
(4, 'Juvenil', 13, 17),
(4, 'Adulto', 18, 45);

-- Insert categories for Volleyball
INSERT INTO categories (sport_id, name, min_age, max_age) VALUES 
(5, 'Juvenil', 12, 17),
(5, 'Adulto', 18, 40);

-- Insert categories for Athletics
INSERT INTO categories (sport_id, name, min_age, max_age) VALUES 
(6, 'Infantil', 8, 12),
(6, 'Juvenil', 13, 17),
(6, 'Adulto', 18, 35),
(6, 'Master', 36, 55);

-- Insert default club for development (will be updated with real data)
INSERT INTO clubs (name, description, email, phone, address) VALUES 
('Club Deportivo Desarrollo', 
 'Club principal para desarrollo y testing', 
 'desarrollo@sgd.com', 
 '+503 2222-0000', 
 'San Salvador, El Salvador');

-- Insert default venues for development
INSERT INTO venues (club_id, name, code, address, phone) VALUES 
(1, 'Sede Principal', 'SP001', 'Avenida Principal #123, San Salvador', '+503 2222-0001'),
(1, 'Complejo Norte', 'CN001', 'Boulevard Norte #456, San Salvador', '+503 2222-0002'),
(1, 'Centro Acuático', 'CA001', 'Zona Rosa, San Salvador', '+503 2222-0003');