DROP TABLE IF EXISTS waiting_list CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS associations CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS families CASCADE;

DROP TYPE IF EXISTS waiting_status CASCADE;
DROP TYPE IF EXISTS registration_status CASCADE;

CREATE TYPE registration_status AS ENUM ('confirmed', 'cancelled', 'medical_non_compliant');

CREATE TYPE waiting_status AS ENUM ('waiting', 'promoted_pending', 'expired', 'converted');

CREATE TABLE families (
    id BIGINT PRIMARY KEY,
    family_name VARCHAR(255) NOT NULL,
    quotient_familial NUMERIC(10, 2) NOT NULL CHECK (quotient_familial >= 0),
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    is_resident BOOLEAN NOT NULL,
    family_id BIGINT NOT NULL REFERENCES families (id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
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
    siren_number VARCHAR(14) NOT NULL UNIQUE,
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
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
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
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    final_price NUMERIC(10, 2) NOT NULL CHECK (final_price >= 15.00),
    status registration_status NOT NULL DEFAULT 'confirmed',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_member_activity UNIQUE (member_id, activity_id)
);

CREATE TABLE waiting_list (
    id BIGSERIAL PRIMARY KEY,
    activity_id BIGINT NOT NULL REFERENCES activities (id) ON DELETE CASCADE,
    member_id BIGINT NOT NULL REFERENCES members (id) ON DELETE CASCADE,
    is_resident BOOLEAN NOT NULL,
    family_id BIGINT NOT NULL REFERENCES families (id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    status waiting_status NOT NULL DEFAULT 'waiting',
    medical_certificate_date DATE NOT NULL,
    pass_sport_code VARCHAR(50) DEFAULT NULL,
    priority_score INT DEFAULT 0,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_family_id ON members (family_id);

CREATE INDEX idx_activities_facility_id ON activities (facility_id);

CREATE INDEX idx_activities_association_id ON activities (association_id);

CREATE INDEX idx_registrations_activity_status ON registrations (activity_id, status);

CREATE INDEX idx_waiting_list_activity_priority ON waiting_list (
    activity_id,
    priority_score DESC,
    registered_at ASC
);