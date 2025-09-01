-- Remove campaign functionality from database

-- Drop campaign-related tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS public.campaign_leads CASCADE;
DROP TABLE IF EXISTS public.campaigns CASCADE;

-- Remove any campaign-related indexes that might still exist
DROP INDEX IF EXISTS idx_campaigns_user_id;
DROP INDEX IF EXISTS idx_campaign_leads_campaign_id;
DROP INDEX IF EXISTS idx_campaign_leads_lead_id;
