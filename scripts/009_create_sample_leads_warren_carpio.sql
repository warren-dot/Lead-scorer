-- Create sample leads with various scores for Warren Carpio
-- First, find or create Warren Carpio's profile

DO $$
DECLARE
    warren_user_id UUID;
BEGIN
    -- Try to find Warren Carpio by email or company name
    SELECT id INTO warren_user_id 
    FROM auth.users 
    WHERE email ILIKE '%warren%carpio%' OR email ILIKE '%warren.carpio%'
    LIMIT 1;
    
    -- If not found, look in profiles table
    IF warren_user_id IS NULL THEN
        SELECT id INTO warren_user_id 
        FROM profiles 
        WHERE email ILIKE '%warren%carpio%' OR company_name ILIKE '%warren%carpio%'
        LIMIT 1;
    END IF;
    
    -- If still not found, create a sample user ID (you'll need to replace this with actual user ID)
    IF warren_user_id IS NULL THEN
        -- Generate a sample UUID - replace this with Warren's actual user ID
        warren_user_id := gen_random_uuid();
        
        -- Insert a profile record for reference
        INSERT INTO profiles (id, email, company_name, industry, created_at, updated_at)
        VALUES (
            warren_user_id,
            'warren.carpio@example.com',
            'Warren Carpio Consulting',
            'consulting',
            NOW(),
            NOW()
        );
    END IF;
    
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
        9.2, 'new', 'referral', 'Premium luxury real estate firm with excellent online presence', NOW(), NOW()
    ),
    (
        gen_random_uuid(), warren_user_id, 'Pinnacle Marketing Agency', 'Michael Chen', 'michael@pinnaclemarketing.com',
        '555-0102', 'https://pinnaclemarketing.com', 'marketing_agency', 'San Francisco, CA',
        8.5, true, true, 8.0, 89, 4.7, 8, 8.0, 9.0, 9.0,
        8.4, 'new', 'website', 'Top-tier marketing agency with strong digital presence', NOW(), NOW()
    ),
    
    -- Insert medium-scoring leads (5-7 range)
    (
        gen_random_uuid(), warren_user_id, 'Metro Plumbing Services', 'David Rodriguez', 'david@metroplumbing.com',
        '555-0103', 'https://metroplumbing.com', 'local_services', 'Austin, TX',
        6.0, false, true, 5.0, 45, 4.2, 6, 6.0, 5.5, 7.0,
        5.8, 'new', 'cold_outreach', 'Established plumbing service with decent online presence', NOW(), NOW()
    ),
    (
        gen_random_uuid(), warren_user_id, 'Bright Future Coaching', 'Lisa Thompson', 'lisa@brightfuturecoaching.com',
        '555-0104', 'https://brightfuturecoaching.com', 'coaching', 'Denver, CO',
        7.0, true, false, 6.0, 28, 4.4, 4, 5.0, 6.0, 8.0,
        6.3, 'contacted', 'linkedin', 'Life coach with good website but unclear pricing', NOW(), NOW()
    ),
    
    -- Insert low-scoring leads (2-4 range)
    (
        gen_random_uuid(), warren_user_id, 'StartUp Financial Advisors', 'James Wilson', 'james@startupfinancial.com',
        '555-0105', 'https://startupfinancial.com', 'financial_services', 'Portland, OR',
        4.0, false, false, 3.0, 8, 3.2, 1, 3.0, 2.0, 6.0,
        3.1, 'new', 'cold_outreach', 'New financial advisory firm with limited online presence', NOW(), NOW()
    ),
    (
        gen_random_uuid(), warren_user_id, 'Budget Home Repairs', 'Tom Anderson', 'tom@budgethomerepairs.com',
        '555-0106', NULL, 'local_services', 'Phoenix, AZ',
        2.0, false, false, 2.0, 3, 2.8, 2, 2.0, 3.0, 5.0,
        2.4, 'new', 'directory', 'Small home repair service with minimal online presence', NOW(), NOW()
    ),
    
    -- Insert additional varied scoring leads
    (
        gen_random_uuid(), warren_user_id, 'Prestige Realty Partners', 'Amanda Foster', 'amanda@prestigerealty.com',
        '555-0107', 'https://prestigerealty.com', 'real_estate', 'Miami, FL',
        8.0, true, true, 7.5, 67, 4.6, 12, 7.5, 8.0, 9.5,
        8.1, 'qualified', 'referral', 'High-end real estate with strong market presence', NOW(), NOW()
    ),
    (
        gen_random_uuid(), warren_user_id, 'Growth Marketing Co', 'Kevin Park', 'kevin@growthmarketing.co',
        '555-0108', 'https://growthmarketing.co', 'marketing_agency', 'Seattle, WA',
        5.5, false, true, 4.0, 22, 3.9, 3, 4.5, 5.0, 7.5,
        5.2, 'contacted', 'cold_outreach', 'Mid-tier marketing agency with room for improvement', NOW(), NOW()
    );
    
    RAISE NOTICE 'Created 8 sample leads for user ID: %', warren_user_id;
    RAISE NOTICE 'Leads created with scores ranging from 2.4 to 9.2';
    
END $$;
