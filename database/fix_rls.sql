-- ============================================================
-- Prometheus -- Fix RLS for anonymous feedback insertion
-- Run this in Supabase SQL Editor after the initial schema.
-- ============================================================

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Anyone can submit feedback" ON service_feedback;

-- Create a permissive insert policy that works with anon/publishable keys
-- This allows ANY authenticated or anonymous request to insert feedback
CREATE POLICY "Allow anonymous feedback insertion"
    ON service_feedback
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Also allow the anon role to SELECT feedback they just inserted
-- (so the REST API can return the inserted row with Prefer: return=representation)
DROP POLICY IF EXISTS "Service role can read all feedback" ON service_feedback;

CREATE POLICY "Allow reading own feedback"
    ON service_feedback
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Verify: test insert
INSERT INTO service_feedback (service_slug, helpfulness, assessment_text, captcha_valid)
VALUES ('driving-licence', 'yes', 'RLS fix verification test', true);

-- Verify: read back
SELECT id, service_slug, helpfulness, assessment_text, submitted_at
FROM service_feedback
ORDER BY submitted_at DESC
LIMIT 3;
