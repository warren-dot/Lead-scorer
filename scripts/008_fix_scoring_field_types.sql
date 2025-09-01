-- Fix scoring fields to allow decimal values instead of integers only
-- This resolves the "invalid input syntax for type integer: '9.9'" error

-- Convert integer scoring fields to numeric to allow decimal values
ALTER TABLE leads 
  ALTER COLUMN website_quality TYPE numeric USING website_quality::numeric,
  ALTER COLUMN content_freshness TYPE numeric USING content_freshness::numeric,
  ALTER COLUMN pricing_signals TYPE numeric USING pricing_signals::numeric,
  ALTER COLUMN customer_volume_indicators TYPE numeric USING customer_volume_indicators::numeric,
  ALTER COLUMN target_fit TYPE numeric USING target_fit::numeric,
  ALTER COLUMN response_time_hours TYPE numeric USING response_time_hours::numeric,
  ALTER COLUMN engagement_depth TYPE numeric USING engagement_depth::numeric,
  ALTER COLUMN cold_score TYPE numeric USING cold_score::numeric,
  ALTER COLUMN warm_score TYPE numeric USING warm_score::numeric;

-- Add constraints to ensure values stay within reasonable ranges
ALTER TABLE leads 
  ADD CONSTRAINT website_quality_range CHECK (website_quality >= 0 AND website_quality <= 10),
  ADD CONSTRAINT content_freshness_range CHECK (content_freshness >= 0 AND content_freshness <= 10),
  ADD CONSTRAINT pricing_signals_range CHECK (pricing_signals >= 0 AND pricing_signals <= 10),
  ADD CONSTRAINT customer_volume_indicators_range CHECK (customer_volume_indicators >= 0 AND customer_volume_indicators <= 10),
  ADD CONSTRAINT target_fit_range CHECK (target_fit >= 0 AND target_fit <= 10),
  ADD CONSTRAINT cold_score_range CHECK (cold_score >= 0 AND cold_score <= 10),
  ADD CONSTRAINT warm_score_range CHECK (warm_score >= 0 AND warm_score <= 10);
