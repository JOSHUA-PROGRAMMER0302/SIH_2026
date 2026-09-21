-- ============================================================
-- Prometheus — Citizen Connect (SIH26129)
-- Supabase PostgreSQL Database Schema
-- ============================================================
-- Run this in the Supabase SQL Editor to create all tables.
-- ============================================================

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

-- Feedback helpfulness rating
CREATE TYPE helpfulness_rating AS ENUM ('yes', 'moderately', 'no');

-- Gender enum for citizen profiles
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- ============================================================
-- 2. CITIZEN PROFILES TABLE
-- Supports the "Fill Once, Use Everywhere" architecture.
-- A single citizen record used across all government services.
-- ============================================================

CREATE TABLE citizen_profiles (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unified_id    VARCHAR(20) UNIQUE NOT NULL,         -- Unique citizen identifier (e.g., "CIT-20260001")
    full_name     VARCHAR(200) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender        gender_type NOT NULL,
    aadhaar_hash  VARCHAR(64),                          -- SHA-256 hash of Aadhaar (never store raw)
    phone         VARCHAR(15),
    email         VARCHAR(254),
    address       JSONB DEFAULT '{}'::jsonb,            -- Structured address: {line1, line2, city, state, pincode}
    documents     JSONB DEFAULT '[]'::jsonb,            -- Array of {type, number, verified, uploaded_at}
    is_verified   BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_citizen_unified_id ON citizen_profiles (unified_id);
CREATE INDEX idx_citizen_aadhaar ON citizen_profiles (aadhaar_hash) WHERE aadhaar_hash IS NOT NULL;
CREATE INDEX idx_citizen_phone ON citizen_profiles (phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_citizen_email ON citizen_profiles (email) WHERE email IS NOT NULL;

-- Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_citizen_profiles_updated_at
    BEFORE UPDATE ON citizen_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. SERVICE FEEDBACK TABLE
-- Captures user feedback from the "Did you find this
-- information helpful?" form on each service page.
-- ============================================================

CREATE TABLE service_feedback (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_slug     VARCHAR(100) NOT NULL DEFAULT 'driving-licence',  -- Which service page
    helpfulness      helpfulness_rating NOT NULL,
    assessment_text  TEXT CHECK (char_length(assessment_text) <= 500), -- Max 500 chars
    captcha_valid    BOOLEAN DEFAULT FALSE,                            -- Was captcha verified
    citizen_id       UUID REFERENCES citizen_profiles(id) ON DELETE SET NULL,  -- Optional link
    ip_address       INET,                                             -- For rate limiting
    user_agent       TEXT,
    submitted_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX idx_feedback_service ON service_feedback (service_slug);
CREATE INDEX idx_feedback_submitted ON service_feedback (submitted_at DESC);
CREATE INDEX idx_feedback_helpfulness ON service_feedback (helpfulness);

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on both tables
ALTER TABLE citizen_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_feedback ENABLE ROW LEVEL SECURITY;

-- Citizen Profiles: Users can only read/update their own profile
-- (requires Supabase Auth — auth.uid() must match)
CREATE POLICY "Citizens can view own profile"
    ON citizen_profiles
    FOR SELECT
    USING (auth.uid()::text = id::text);

CREATE POLICY "Citizens can update own profile"
    ON citizen_profiles
    FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Service Feedback: Anyone can insert (anonymous feedback allowed)
CREATE POLICY "Anyone can submit feedback"
    ON service_feedback
    FOR INSERT
    WITH CHECK (true);

-- Service Feedback: Only service role can read (for analytics dashboards)
CREATE POLICY "Service role can read all feedback"
    ON service_feedback
    FOR SELECT
    USING (auth.role() = 'service_role');

-- ============================================================
-- 5. SAMPLE DATA (Optional — for development/testing)
-- ============================================================

-- Sample citizen profile
INSERT INTO citizen_profiles (unified_id, full_name, date_of_birth, gender, phone, email, address)
VALUES (
    'CIT-20260001',
    'Rajesh Kumar Sharma',
    '1990-05-15',
    'male',
    '+919876543210',
    'rajesh.sharma@email.com',
    '{"line1": "42, MG Road", "line2": "Near City Mall", "city": "Jaipur", "state": "Rajasthan", "pincode": "302001"}'::jsonb
);

-- Sample feedback entry
INSERT INTO service_feedback (service_slug, helpfulness, assessment_text, captcha_valid)
VALUES (
    'driving-licence',
    'yes',
    'The information about the online application process was very helpful.',
    true
);
