-- Update the sample lead with detailed scoring data that should score above 5
-- This adds the specific fields the scoring algorithm needs

UPDATE leads 
SET 
  -- Cold scoring data for high score
  website_quality = 9,
  has_booking_system = true,
  has_clear_pricing = true,
  review_count = 120,
  average_rating = 4.8,
  years_in_business = 12,
  pricing_signals = 8,
  customer_volume_indicators = 8,
  
  -- Update other fields for completeness
  website = 'https://premiumrealestate.com',
  notes = 'High-quality real estate agency with excellent online presence, strong reviews, and established business history. Should score 7-8 points.'

WHERE company_name = 'Premium Real Estate Group';

-- Verify the update
SELECT 
  company_name,
  industry,
  website_quality,
  has_booking_system,
  has_clear_pricing,
  review_count,
  average_rating,
  years_in_business,
  pricing_signals,
  customer_volume_indicators
FROM leads 
WHERE company_name = 'Premium Real Estate Group';
