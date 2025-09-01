-- Add a sample lead that should score above 5
INSERT INTO leads (
  user_id,
  company_name,
  contact_name,
  email,
  phone,
  website,
  industry,
  notes,
  status,
  created_at
) VALUES (
  (SELECT id FROM auth.users LIMIT 1), -- Use first available user
  'Premium Real Estate Group',
  'Sarah Johnson',
  'sarah@premiumrealestate.com',
  '555-0199',
  'https://premiumrealestate.com',
  'real_estate',
  'Established luxury real estate firm with excellent online presence, 4.8-star rating from 120+ reviews, 12 years in business, clear pricing structure, and online booking system. Strong revenue indicators with high-end property listings.',
  'new',
  NOW()
);

-- Add scoring factors for this lead that will result in a score above 5
INSERT INTO lead_scoring_factors (
  lead_id,
  -- Website Activity factors (should score ~9/10)
  website_quality,
  has_booking_system,
  has_clear_pricing,
  
  -- Reviews factors (should score ~9/10)
  review_count,
  average_rating,
  
  -- Years in business (should score 10/10)
  years_in_business,
  
  -- Revenue proxies (should score ~8/10)
  pricing_signals,
  customer_volume_indicators,
  
  -- Industry fit (perfect match = 10/10)
  industry,
  
  created_at
) VALUES (
  (SELECT id FROM leads WHERE company_name = 'Premium Real Estate Group' LIMIT 1),
  9, -- High quality website
  true, -- Has booking system
  true, -- Clear pricing displayed
  120, -- 120 reviews
  4.8, -- 4.8 star rating
  12, -- 12 years in business
  8, -- Strong pricing signals (luxury market)
  7, -- Good customer volume indicators
  'real_estate', -- Perfect industry match
  NOW()
);
