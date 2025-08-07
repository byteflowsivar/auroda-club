-- SGD Backend Initial Schema
-- Version: 1.0.0
-- Description: Creates all tables for the Sports Management System

-- Create clubs table
CREATE TABLE clubs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create venues table
CREATE TABLE venues (
    id BIGSERIAL PRIMARY KEY,
    club_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_venues_club FOREIGN KEY (club_id) REFERENCES clubs(id)
);

-- Create sports table
CREATE TABLE sports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    sport_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_categories_sport FOREIGN KEY (sport_id) REFERENCES sports(id),
    CONSTRAINT ck_categories_age_range CHECK (min_age <= max_age)
);

-- Create guardians table
CREATE TABLE guardians (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    secondary_phone VARCHAR(50),
    address TEXT,
    identification_number VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create athletes table
CREATE TABLE athletes (
    id BIGSERIAL PRIMARY KEY,
    club_id BIGINT NOT NULL,
    venue_id BIGINT NOT NULL,
    sport_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    identification_number VARCHAR(50),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(50),
    medical_notes TEXT,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_athletes_club FOREIGN KEY (club_id) REFERENCES clubs(id),
    CONSTRAINT fk_athletes_venue FOREIGN KEY (venue_id) REFERENCES venues(id),
    CONSTRAINT fk_athletes_sport FOREIGN KEY (sport_id) REFERENCES sports(id),
    CONSTRAINT fk_athletes_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT ck_athletes_birth_date CHECK (birth_date <= CURRENT_DATE)
);

-- Create athlete_guardians relationship table
CREATE TABLE athlete_guardians (
    id BIGSERIAL PRIMARY KEY,
    athlete_id BIGINT NOT NULL,
    guardian_id BIGINT NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_athlete_guardians_athlete FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
    CONSTRAINT fk_athlete_guardians_guardian FOREIGN KEY (guardian_id) REFERENCES guardians(id),
    CONSTRAINT uk_athlete_guardians UNIQUE (athlete_id, guardian_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_athletes_club_venue ON athletes(club_id, venue_id);
CREATE INDEX idx_athletes_sport_category ON athletes(sport_id, category_id);
CREATE INDEX idx_athletes_active ON athletes(active) WHERE active = true;
CREATE INDEX idx_athletes_birth_date ON athletes(birth_date);
CREATE INDEX idx_venues_club ON venues(club_id);
CREATE INDEX idx_categories_sport ON categories(sport_id);
CREATE INDEX idx_athlete_guardians_athlete ON athlete_guardians(athlete_id);
CREATE INDEX idx_athlete_guardians_guardian ON athlete_guardians(guardian_id);

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at updates
CREATE TRIGGER update_clubs_updated_at 
    BEFORE UPDATE ON clubs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at 
    BEFORE UPDATE ON venues 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sports_updated_at 
    BEFORE UPDATE ON sports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guardians_updated_at 
    BEFORE UPDATE ON guardians 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athletes_updated_at 
    BEFORE UPDATE ON athletes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();