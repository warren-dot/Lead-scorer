export interface ColdScoringFactors {
  website_activity: number // 0-10
  reviews: number // 0-10
  years_in_business: number // 0-10
  revenue_proxies: number // 0-10
  industry_fit: number // 0-10
}

export interface WarmScoringFactors {
  behavior: number // 0-10
  urgency: number // 0-10
  profitability: number // 0-10 (carry-over from cold score)
}

export interface ScoringWeights {
  cold: {
    website_activity: number // 25%
    reviews: number // 25%
    years_in_business: number // 20%
    revenue_proxies: number // 20%
    industry_fit: number // 10%
  }
  warm: {
    behavior: number // 60%
    urgency: number // 30%
    profitability: number // 10%
  }
}

export interface LeadScoringData {
  // Basic lead info
  industry: string
  company_name: string
  website?: string
  location?: string

  // Cold scoring data - Website Activity (25%)
  website_quality?: number // 0-10
  has_booking_system?: boolean
  has_clear_pricing?: boolean
  content_freshness?: number // 0-10

  // Cold scoring data - Reviews (25%)
  review_count?: number
  average_rating?: number // 0.0-5.0

  // Cold scoring data - Business Stability (20%)
  years_in_business?: number

  // Cold scoring data - Revenue Proxies (20%)
  pricing_signals?: number // 0-10
  customer_volume_indicators?: number // 0-10

  // Cold scoring data - Fit (10%)
  target_fit?: number // 0-10

  // Warm scoring data (after engagement)
  response_time_hours?: number
  engagement_depth?: number
  meeting_booked?: boolean
  timeline_mentioned?: boolean
  urgency_expressed?: boolean

  // Calculated scores
  cold_score?: number
  warm_score?: number
}

export type Industry = "real_estate" | "agency" | "coaching" | "local_services" | "financial_services"
