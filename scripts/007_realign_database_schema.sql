-- Realign database schema to match app input fields exactly
-- This script drops and recreates the leads table with proper field alignment

-- First, backup any existing data (optional - remove if not needed)
-- CREATE TABLE leads_backup AS SELECT * FROM leads;

-- Drop existing leads table and recreate with aligned schema
DROP TABLE IF EXISTS public.campaign_leads CASCADE;
DROP TABLE IF EXISTS public.lead_interactions CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;

-- Create leads table with fields that exactly match app forms
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic lead information (matches add-lead-form.tsx)
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT NOT NULL CHECK (industry IN ('real_estate', 'agency', 'coaching', 'local_services', 'financial_services')),
  location TEXT,
  notes TEXT,
  
  -- Website Activity scoring fields (25% of cold score)
  website_quality INTEGER DEFAULT 5 CHECK (website_quality >= 0 AND website_quality <= 10),
  has_booking_system BOOLEAN DEFAULT false,
  has_clear_pricing BOOLEAN DEFAULT false,
  content_freshness INTEGER DEFAULT 5 CHECK (content_freshness >= 0 AND content_freshness <= 10),
  
  -- Reviews & Social Proof fields (25% of cold score)
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  average_rating DECIMAL(2,1) DEFAULT 0.0 CHECK (average_rating >= 0.0 AND average_rating <= 5.0),
  
  -- Business Stability & Revenue fields (40% of cold score)
  years_in_business INTEGER DEFAULT 1 CHECK (years_in_business >= 0),
  pricing_signals INTEGER DEFAULT 5 CHECK (pricing_signals >= 0 AND pricing_signals <= 10),
  customer_volume_indicators INTEGER DEFAULT 5 CHECK (customer_volume_indicators >= 0 AND customer_volume_indicators <= 10),
  
  -- Target Fit fields (10% of cold score)
  target_fit INTEGER DEFAULT 5 CHECK (target_fit >= 0 AND target_fit <= 10),
  
  -- Warm scoring fields (post-engagement)
  response_time_hours INTEGER CHECK (response_time_hours >= 0),
  engagement_depth INTEGER DEFAULT 5 CHECK (engagement_depth >= 1 AND engagement_depth <= 10),
  meeting_booked BOOLEAN DEFAULT false,
  timeline_mentioned BOOLEAN DEFAULT false,
  urgency_expressed BOOLEAN DEFAULT false,
  
  -- Calculated scores (system-generated)
  cold_score INTEGER DEFAULT 0 CHECK (cold_score >= 0 AND cold_score <= 10),
  warm_score INTEGER DEFAULT 0 CHECK (warm_score >= 0 AND warm_score <= 10),
  
  -- Lead status and tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'replied', 'qualified', 'converted', 'lost')),
  source TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE
);

-- Recreate lead interactions table (simplified)
CREATE TABLE public.lead_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email_sent', 'email_opened', 'email_replied', 'call_made', 'meeting_scheduled', 'note_added')),
  content TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "leads_select_own" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "leads_insert_own" ON public.leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "leads_update_own" ON public.leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "leads_delete_own" ON public.leads FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for lead_interactions
CREATE POLICY "interactions_select_own" ON public.lead_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "interactions_insert_own" ON public.lead_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "interactions_update_own" ON public.lead_interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "interactions_delete_own" ON public.lead_interactions FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_industry ON public.leads(industry);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_cold_score ON public.leads(cold_score);
CREATE INDEX idx_leads_warm_score ON public.leads(warm_score);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_interactions_lead_id ON public.lead_interactions(lead_id);

-- Add helpful comments
COMMENT ON TABLE public.leads IS 'Lead records with comprehensive scoring data aligned with app forms';
COMMENT ON COLUMN public.leads.website_quality IS 'Website quality assessment (0-10)';
COMMENT ON COLUMN public.leads.has_booking_system IS 'Online booking system presence';
COMMENT ON COLUMN public.leads.has_clear_pricing IS 'Clear pricing display';
COMMENT ON COLUMN public.leads.content_freshness IS 'Content freshness score (0-10)';
COMMENT ON COLUMN public.leads.review_count IS 'Total number of reviews';
COMMENT ON COLUMN public.leads.average_rating IS 'Average review rating (0.0-5.0)';
COMMENT ON COLUMN public.leads.years_in_business IS 'Years in operation';
COMMENT ON COLUMN public.leads.pricing_signals IS 'Pricing and revenue indicators (0-10)';
COMMENT ON COLUMN public.leads.customer_volume_indicators IS 'Customer volume assessment (0-10)';
COMMENT ON COLUMN public.leads.target_fit IS 'Industry and location fit (0-10)';
COMMENT ON COLUMN public.leads.response_time_hours IS 'Response time in hours (warm scoring)';
COMMENT ON COLUMN public.leads.engagement_depth IS 'Engagement quality (1-10)';
COMMENT ON COLUMN public.leads.meeting_booked IS 'Meeting scheduled status';
COMMENT ON COLUMN public.leads.timeline_mentioned IS 'Timeline discussion indicator';
COMMENT ON COLUMN public.leads.urgency_expressed IS 'Urgency signals present';
