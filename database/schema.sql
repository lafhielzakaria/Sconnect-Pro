DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS association_members CASCADE;
DROP TABLE IF EXISTS associations CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS families CASCADE;

DROP TYPE IF EXISTS registration_status CASCADE;
DROP TYPE IF EXISTS association_member_status CASCADE;

CREATE TYPE registration_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
CREATE TYPE association_member_status AS ENUM ('accepted', 'pending', 'rejected');

CREATE TABLE families (
    id BIGSERIAL PRIMARY KEY,
    family_name VARCHAR(255) NOT NULL,
    quotient_familial NUMERIC(10, 2) NOT NULL CHECK (quotient_familial >= 0),
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    family_id BIGINT NOT NULL REFERENCES families (id) ON DELETE CASCADE,
    is_resident BOOLEAN NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    birth_date DATE NOT NULL,
    medical_certificate_date DATE NOT NULL,
    pass_sport_code VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE associations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    phone VARCHAR(20) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    siren_number VARCHAR(14) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE association_members (
    id BIGSERIAL PRIMARY KEY,
    association_id BIGINT NOT NULL REFERENCES associations(id) ON DELETE CASCADE,
    member_id BIGINT REFERENCES members(id) ON DELETE SET NULL, 
    family_id BIGINT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    is_resident BOOLEAN NOT NULL,
    quotient_familial NUMERIC(10, 2) NOT NULL,
    medical_certificate_date DATE NOT NULL,
    pass_sport_code VARCHAR(50) DEFAULT NULL,
    final_price NUMERIC(10, 2) NOT NULL CHECK (final_price >= 15.00),
    status association_member_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facilities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    erp_capacity INT NOT NULL CHECK (erp_capacity > 0),
    is_divisible BOOLEAN NOT NULL DEFAULT FALSE,
    parent_facility_id BIGINT REFERENCES facilities (id) ON DELETE SET NULL,
    association_id BIGINT NOT NULL REFERENCES associations (id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    association_id BIGINT NOT NULL REFERENCES associations (id) ON DELETE CASCADE,
    facility_id BIGINT NOT NULL REFERENCES facilities (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    max_capacity INT NOT NULL CHECK (max_capacity > 0),
    activity_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_time_order CHECK (end_time > start_time)
);

CREATE TABLE registrations (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL REFERENCES members (id) ON DELETE CASCADE,
    activity_id BIGINT NOT NULL REFERENCES activities (id) ON DELETE CASCADE,
    status registration_status NOT NULL DEFAULT 'pending',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_member_activity UNIQUE (member_id, activity_id)
);

CREATE INDEX idx_members_family_id ON members (family_id);
CREATE INDEX idx_association_members_status ON association_members (association_id, status);
CREATE INDEX idx_activities_facility_id ON activities (facility_id);
CREATE INDEX idx_activities_association_id ON activities (association_id);
CREATE INDEX idx_registrations_activity_status ON registrations (activity_id, status);