-- Add detailed scoring fields to leads table to support comprehensive scoring criteria
ALTER TABLE leads ADD COLUMN IF NOT EXISTS website_quality INTEGER DEFAULT 5;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_booking_system BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_clear_pricing BOOLEAN DEFAULT false;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS content_freshness INTEGER DEFAULT 5;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1) DEFAULT 0.0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS years_in_business INTEGER DEFAULT 1;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS pricing_signals INTEGER DEFAULT 5;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS customer_volume_indicators INTEGER DEFAULT 5;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS target_fit INTEGER DEFAULT 5;

-- Add comment to document the scoring fields
COMMENT ON COLUMN leads.website_quality IS 'Website quality score 0-10 (active site, updated content, working forms)';
COMMENT ON COLUMN leads.has_booking_system IS 'Whether the lead has an online booking system';
COMMENT ON COLUMN leads.has_clear_pricing IS 'Whether the lead displays clear pricing information';
COMMENT ON COLUMN leads.content_freshness IS 'Content freshness score 0-10 (recent updates, active blog)';
COMMENT ON COLUMN leads.review_count IS 'Total number of online reviews';
COMMENT ON COLUMN leads.average_rating IS 'Average review rating (0.0-5.0)';
COMMENT ON COLUMN leads.years_in_business IS 'Number of years the business has been operating';
COMMENT ON COLUMN leads.pricing_signals IS 'Pricing and revenue signals score 0-10';
COMMENT ON COLUMN leads.customer_volume_indicators IS 'Customer volume indicators score 0-10';
COMMENT ON COLUMN leads.location IS 'Business location/geography';
COMMENT ON COLUMN leads.target_fit IS 'Industry and location fit score 0-10';
