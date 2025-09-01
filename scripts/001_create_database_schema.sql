-- Lead Generation Platform Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profiles table (references auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  industry TEXT CHECK (industry IN ('real_estate', 'agency', 'coaching', 'local_services', 'financial_services')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic lead information
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT NOT NULL CHECK (industry IN ('real_estate', 'agency', 'coaching', 'local_services', 'financial_services')),
  
  -- Lead scoring data
  cold_score INTEGER DEFAULT 0 CHECK (cold_score >= 0 AND cold_score <= 10),
  warm_score INTEGER DEFAULT 0 CHECK (warm_score >= 0 AND warm_score <= 10),
  
  -- Cold scoring factors
  website_activity_score INTEGER DEFAULT 0,
  reviews_score INTEGER DEFAULT 0,
  years_in_business_score INTEGER DEFAULT 0,
  revenue_proxy_score INTEGER DEFAULT 0,
  fit_score INTEGER DEFAULT 0,
  
  -- Warm scoring factors (after engagement)
  behavior_score INTEGER DEFAULT 0,
  urgency_score INTEGER DEFAULT 0,
  demographics_score INTEGER DEFAULT 0,
  
  -- Lead status and tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'replied', 'qualified', 'converted', 'lost')),
  source TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT CHECK (industry IN ('real_estate', 'agency', 'coaching', 'local_services', 'financial_services')),
  
  -- Campaign settings
  min_cold_score INTEGER DEFAULT 5,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  
  -- Email templates
  subject_line TEXT,
  email_template TEXT,
  
  -- Campaign metrics
  leads_targeted INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  replies_received INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign leads junction table
CREATE TABLE IF NOT EXISTS public.campaign_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  
  -- Outreach tracking
  email_sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'replied', 'bounced')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(campaign_id, lead_id)
);

-- Lead interactions table (for tracking all touchpoints)
CREATE TABLE IF NOT EXISTS public.lead_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email_sent', 'email_opened', 'email_replied', 'call_made', 'meeting_scheduled', 'note_added')),
  content TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for leads
CREATE POLICY "leads_select_own" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "leads_insert_own" ON public.leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "leads_update_own" ON public.leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "leads_delete_own" ON public.leads FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for campaigns
CREATE POLICY "campaigns_select_own" ON public.campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "campaigns_insert_own" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "campaigns_update_own" ON public.campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "campaigns_delete_own" ON public.campaigns FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for campaign_leads
CREATE POLICY "campaign_leads_select_own" ON public.campaign_leads FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = campaign_id AND campaigns.user_id = auth.uid()));
CREATE POLICY "campaign_leads_insert_own" ON public.campaign_leads FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = campaign_id AND campaigns.user_id = auth.uid()));
CREATE POLICY "campaign_leads_update_own" ON public.campaign_leads FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = campaign_id AND campaigns.user_id = auth.uid()));
CREATE POLICY "campaign_leads_delete_own" ON public.campaign_leads FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = campaign_id AND campaigns.user_id = auth.uid()));

-- RLS Policies for lead_interactions
CREATE POLICY "interactions_select_own" ON public.lead_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "interactions_insert_own" ON public.lead_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "interactions_update_own" ON public.lead_interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "interactions_delete_own" ON public.lead_interactions FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_industry ON public.leads(industry);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_cold_score ON public.leads(cold_score);
CREATE INDEX IF NOT EXISTS idx_leads_warm_score ON public.leads(warm_score);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_campaign_id ON public.campaign_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_lead_id ON public.campaign_leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_interactions_lead_id ON public.lead_interactions(lead_id);
