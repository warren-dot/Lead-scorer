-- Create sample leads with various scores for Warren Carpio
-- First, create/update Warren's profile if it doesn't exist

-- Insert or update Warren's profile
INSERT INTO profiles (id, email, company_name, industry, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'wcarpio@infinitysupport.com',
  'Infinity Support',
  'local_services',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  industry = EXCLUDED.industry,
  updated_at = NOW();

-- Get Warren's user ID for lead assignment
DO $$
DECLARE
  warren_user_id UUID;
BEGIN
  -- Get Warren's user ID
  SELECT id INTO warren_user_id FROM profiles WHERE email = 'wcarpio@infinitysupport.com';
  
  -- Insert high-scoring leads (8-10 range)
  INSERT INTO leads (
    id, user_id, company_name, contact_name, email, phone, website, industry, location,
    website_quality, has_booking_system, has_clear_pricing, content_freshness,
    review_count, average_rating, years_in_business, pricing_signals, customer_volume_indicators, target_fit,
    cold_score, status, source, notes, created_at, updated_at
  ) VALUES
  (
    gen_random_uuid(), warren_user_id, 'Elite Real Estate Group', 'Sarah Johnson', 'sarah@eliterealestate.com', 
    '555-0101', 'https://eliterealestate.com', 'real_estate', 'Beverly Hills, CA',
    9.5, true, true, 9.0, 150, 4.9, 15, 9.0, 8.5, 10.0,
    9.2, 'new', 'website', 'Luxury real estate with excellent online presence and stellar reviews', NOW(), NOW()
  ),
  (
    gen_random_uuid(), warren_user_id, 'Premier Marketing Solutions', 'Michael Chen', 'mike@premiermarketing.com',
    '555-0102', 'https://premiermarketing.com', 'marketing_agency', 'San Francisco, CA',
    8.5, true, true, 8.0, 89, 4.7, 8, 8.0, 7.5, 9.0,
    8.4, 'new', 'referral', 'Established marketing agency with strong digital presence', NOW(), NOW()
  ),
  
  -- Insert medium-scoring leads (5-7 range)
  (
    gen_random_uuid(), warren_user_id, 'Metro Property Management', 'Lisa Rodriguez', 'lisa@metroprop.com',
    '555-0103', 'https://metroprop.com', 'real_estate', 'Austin, TX',
    6.0, false, true, 5.0, 45, 4.2, 6, 6.0, 5.5, 7.0,
    5.8, 'new', 'cold_outreach', 'Mid-size property management with decent online presence', NOW(), NOW()
  ),
  (
    gen_random_uuid(), warren_user_id, 'Success Life Coaching', 'David Park', 'david@successcoaching.com',
    '555-0104', 'https://successcoaching.com', 'coaching', 'Denver, CO',
    7.0, true, false, 6.0, 28, 4.4, 4, 5.0, 6.0, 8.0,
    6.3, 'contacted', 'linkedin', 'Growing coaching business with good engagement but unclear pricing', NOW(), NOW()
  ),
  (
    gen_random_uuid(), warren_user_id, 'Downtown Legal Services', 'Jennifer White', 'jen@downtownlegal.com',
    '555-0105', 'https://downtownlegal.com', 'financial_services', 'Chicago, IL',
    5.5, false, true, 4.0, 32, 4.0, 12, 7.0, 4.0, 6.0,
    5.4, 'new', 'website', 'Established law firm with traditional approach, limited online booking', NOW(), NOW()
  ),
  
  -- Insert low-scoring leads (2-4 range)
  (
    gen_random_uuid(), warren_user_id, 'Startup Marketing Hub', 'Alex Thompson', 'alex@startupmarketing.com',
    '555-0106', 'https://startupmarketing.com', 'marketing_agency', 'Portland, OR',
    4.0, false, false, 3.0, 8, 3.2, 1, 3.0, 2.0, 5.0,
    3.1, 'new', 'cold_outreach', 'New agency with basic website and limited track record', NOW(), NOW()
  ),
  (
    gen_random_uuid(), warren_user_id, 'Quick Fix Plumbing', 'Bob Martinez', 'bob@quickfixplumbing.com',
    '555-0107', 'https://quickfixplumbing.com', 'local_services', 'Phoenix, AZ',
    3.5, false, false, 2.0, 12, 3.8, 3, 4.0, 3.0, 4.0,
    3.4, 'new', 'google_ads', 'Small plumbing service with outdated website and few reviews', NOW(), NOW()
  ),
  (
    gen_random_uuid(), warren_user_id, 'New Wave Consulting', 'Emma Davis', 'emma@newwaveconsult.com',
    '555-0108', 'https://newwaveconsult.com', 'coaching', 'Miami, FL',
    2.5, false, false, 2.0, 3, 2.7, 0, 2.0, 1.0, 3.0,
    2.2, 'new', 'social_media', 'Brand new consulting firm with minimal online presence', NOW(), NOW()
  ),
  
  -- Insert some leads with warm scoring data (replied leads)
  (
    gen_random_uuid(), warren_user_id, 'Apex Financial Advisors', 'Robert Kim', 'robert@apexfinancial.com',
    '555-0109', 'https://apexfinancial.com', 'financial_services', 'Seattle, WA',
    8.0, true, true, 7.5, 67, 4.6, 10, 7.5, 7.0, 9.0,
    7.8, 'replied', 'referral', 'High-quality financial advisory firm that responded to outreach',
    NOW(), NOW()
  ),
  (
    gen_random_uuid(), warren_user_id, 'Urban Home Realty', 'Amanda Foster', 'amanda@urbanhome.com',
    '555-0110', 'https://urbanhome.com', 'real_estate', 'Nashville, TN',
    6.5, true, false, 6.0, 41, 4.3, 7, 6.0, 5.5, 8.0,
    6.4, 'replied', 'cold_outreach', 'Mid-tier realty company that showed interest in our services',
    NOW(), NOW()
  );

  -- Update some leads with warm scoring data
  UPDATE leads SET
    response_time_hours = 2.5,
    engagement_depth = 8.0,
    meeting_booked = true,
    timeline_mentioned = true,
    urgency_expressed = true,
    warm_score = 8.5,
    replied_at = NOW() - INTERVAL '2 days',
    last_contacted_at = NOW() - INTERVAL '3 days'
  WHERE company_name = 'Apex Financial Advisors' AND user_id = warren_user_id;

  UPDATE leads SET
    response_time_hours = 24.0,
    engagement_depth = 6.0,
    meeting_booked = false,
    timeline_mentioned = true,
    urgency_expressed = false,
    warm_score = 6.2,
    replied_at = NOW() - INTERVAL '1 day',
    last_contacted_at = NOW() - INTERVAL '2 days'
  WHERE company_name = 'Urban Home Realty' AND user_id = warren_user_id;

END $$;
