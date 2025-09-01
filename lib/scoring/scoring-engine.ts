import type { ColdScoringFactors, WarmScoringFactors, ScoringWeights, LeadScoringData, Industry } from "./types"

// Default scoring weights based on PRD
const DEFAULT_WEIGHTS: ScoringWeights = {
  cold: {
    website_activity: 0.25,
    reviews: 0.25,
    years_in_business: 0.2,
    revenue_proxies: 0.2,
    industry_fit: 0.1,
  },
  warm: {
    behavior: 0.6,
    urgency: 0.3,
    profitability: 0.1,
  },
}

// Industry-specific scoring adjustments
const INDUSTRY_WEIGHTS: Record<Industry, Partial<ScoringWeights>> = {
  real_estate: {
    cold: {
      website_activity: 0.3, // Higher weight for online presence
      reviews: 0.3, // Critical for trust
      years_in_business: 0.15,
      revenue_proxies: 0.15,
      industry_fit: 0.1,
    },
  },
  agency: {
    cold: {
      website_activity: 0.35, // Portfolio showcase critical
      reviews: 0.2,
      years_in_business: 0.15,
      revenue_proxies: 0.25, // Budget signals important
      industry_fit: 0.05,
    },
  },
  coaching: {
    warm: {
      behavior: 0.7, // Engagement is everything
      urgency: 0.25,
      profitability: 0.05,
    },
  },
  local_services: {
    cold: {
      website_activity: 0.2,
      reviews: 0.35, // Reviews critical for local
      years_in_business: 0.25, // Stability important
      revenue_proxies: 0.15,
      industry_fit: 0.05,
    },
  },
  financial_services: {
    cold: {
      website_activity: 0.25,
      reviews: 0.3, // Trust is critical
      years_in_business: 0.3, // Stability paramount
      revenue_proxies: 0.1,
      industry_fit: 0.05,
    },
  },
}

export class LeadScoringEngine {
  private getWeights(industry: Industry): ScoringWeights {
    const industryWeights = INDUSTRY_WEIGHTS[industry]
    return {
      cold: { ...DEFAULT_WEIGHTS.cold, ...industryWeights?.cold },
      warm: { ...DEFAULT_WEIGHTS.warm, ...industryWeights?.warm },
    }
  }

  // Calculate website activity score (0-10)
  private calculateWebsiteActivityScore(data: LeadScoringData): number {
    let score = 0

    // Website quality component (0-10 base score)
    if (data.website_quality !== undefined) {
      score = data.website_quality
    } else if (data.website) {
      score = 5 // Default middle score if website exists
    } else {
      score = 0 // No website = 0
    }

    // Content freshness adjustment
    if (data.content_freshness !== undefined) {
      score = (score + data.content_freshness) / 2
    }

    // Lead funnel signals boost
    let funnelBoost = 0
    if (data.has_booking_system) funnelBoost += 1
    if (data.has_clear_pricing) funnelBoost += 1

    // Apply funnel boost (max 2 points)
    score = Math.min(score + funnelBoost, 10)

    return Math.round(score * 10) / 10
  }

  // Calculate reviews score (0-10)
  private calculateReviewsScore(data: LeadScoringData): number {
    if (!data.review_count || !data.average_rating) return 0

    let volumeScore = 0
    let ratingScore = 0

    // Volume scoring: 50+ = 10, 10-49 = 5, <10 = 2
    if (data.review_count >= 50) {
      volumeScore = 10
    } else if (data.review_count >= 10) {
      volumeScore = 5
    } else if (data.review_count > 0) {
      volumeScore = 2
    }

    // Rating scoring: 4-5 stars = 10, 3-3.9 = 5, <3 = 0
    if (data.average_rating >= 4.0) {
      ratingScore = 10
    } else if (data.average_rating >= 3.0) {
      ratingScore = 5
    } else {
      ratingScore = 0
    }

    // Average the two components
    return Math.round(((volumeScore + ratingScore) / 2) * 10) / 10
  }

  // Calculate years in business score (0-10)
  private calculateYearsInBusinessScore(data: LeadScoringData): number {
    if (!data.years_in_business) return 2 // Default for new businesses

    // >5 years = 10, 2-4 years = 5, <1 year = 2
    if (data.years_in_business > 5) {
      return 10
    } else if (data.years_in_business >= 2) {
      return 5
    } else {
      return 2
    }
  }

  // Calculate revenue proxies score (0-10)
  private calculateRevenueProxiesScore(data: LeadScoringData): number {
    let score = 0

    // Pricing signals (0-6)
    if (data.pricing_signals) {
      score += Math.min(data.pricing_signals, 6)
    }

    // Customer volume indicators (0-4)
    if (data.customer_volume_indicators) {
      score += Math.min(data.customer_volume_indicators, 4)
    }

    return Math.min(score, 10)
  }

  // Calculate industry fit score (0-10)
  private calculateIndustryFitScore(data: LeadScoringData, targetIndustry: Industry): number {
    // Use the target_fit field if available (user-assessed fit)
    if (data.target_fit !== undefined) {
      return data.target_fit
    }

    // Fallback to automatic industry matching
    if (data.industry === targetIndustry) return 10

    // Related industries get partial credit
    const relatedIndustries: Record<Industry, Industry[]> = {
      real_estate: ["financial_services"],
      agency: ["coaching"],
      coaching: ["agency"],
      local_services: ["real_estate"],
      financial_services: ["real_estate"],
    }

    if (relatedIndustries[targetIndustry]?.includes(data.industry as Industry)) {
      return 5
    }

    return 0 // Off-target = 0 (matching framework)
  }

  // Calculate behavior score (0-10) for warm leads
  private calculateBehaviorScore(data: LeadScoringData): number {
    let score = 0

    // Response time (0-4)
    if (data.response_time_hours !== undefined) {
      if (data.response_time_hours <= 1) score += 4
      else if (data.response_time_hours <= 4) score += 3
      else if (data.response_time_hours <= 24) score += 2
      else if (data.response_time_hours <= 72) score += 1
    }

    // Engagement depth (0-4)
    if (data.engagement_depth) {
      score += Math.min(data.engagement_depth, 4)
    }

    // Meeting booked (+2)
    if (data.meeting_booked) {
      score += 2
    }

    return Math.min(score, 10)
  }

  // Calculate urgency score (0-10) for warm leads
  private calculateUrgencyScore(data: LeadScoringData): number {
    let score = 5 // Default middle score

    // Timeline mentioned
    if (data.timeline_mentioned) {
      score += 3
    }

    // Urgency expressed
    if (data.urgency_expressed) {
      score += 2
    }

    return Math.min(score, 10)
  }

  // Calculate cold lead score
  public calculateColdScore(data: LeadScoringData, industry: Industry): number {
    const weights = this.getWeights(industry)

    const factors: ColdScoringFactors = {
      website_activity: this.calculateWebsiteActivityScore(data),
      reviews: this.calculateReviewsScore(data),
      years_in_business: this.calculateYearsInBusinessScore(data),
      revenue_proxies: this.calculateRevenueProxiesScore(data),
      industry_fit: this.calculateIndustryFitScore(data, industry),
    }

    const score =
      factors.website_activity * weights.cold.website_activity +
      factors.reviews * weights.cold.reviews +
      factors.years_in_business * weights.cold.years_in_business +
      factors.revenue_proxies * weights.cold.revenue_proxies +
      factors.industry_fit * weights.cold.industry_fit

    return Math.round(score * 10) / 10 // Round to 1 decimal
  }

  // Calculate warm lead score
  public calculateWarmScore(data: LeadScoringData, industry: Industry): number {
    const weights = this.getWeights(industry)

    const factors: WarmScoringFactors = {
      behavior: this.calculateBehaviorScore(data),
      urgency: this.calculateUrgencyScore(data),
      profitability: data.cold_score || 5, // Use existing cold score
    }

    const score =
      factors.behavior * weights.warm.behavior +
      factors.urgency * weights.warm.urgency +
      factors.profitability * weights.warm.profitability

    return Math.round(score * 10) / 10 // Round to 1 decimal
  }

  // Get score interpretation
  public getScoreInterpretation(score: number): {
    level: "excellent" | "good" | "fair" | "poor"
    description: string
    priority: "high" | "medium" | "low"
  } {
    if (score >= 8) {
      return {
        level: "excellent",
        description: "High-quality lead with strong conversion potential",
        priority: "high",
      }
    } else if (score >= 6) {
      return {
        level: "good",
        description: "Qualified lead worth pursuing",
        priority: "medium",
      }
    } else if (score >= 4) {
      return {
        level: "fair",
        description: "Moderate potential, requires nurturing",
        priority: "medium",
      }
    } else {
      return {
        level: "poor",
        description: "Low conversion probability",
        priority: "low",
      }
    }
  }

  // Get detailed scoring breakdown
  public getScoringBreakdown(data: LeadScoringData, industry: Industry, scoreType: "cold" | "warm") {
    const weights = this.getWeights(industry)

    if (scoreType === "cold") {
      return {
        website_activity: {
          score: this.calculateWebsiteActivityScore(data),
          weight: weights.cold.website_activity,
          contribution: this.calculateWebsiteActivityScore(data) * weights.cold.website_activity,
        },
        reviews: {
          score: this.calculateReviewsScore(data),
          weight: weights.cold.reviews,
          contribution: this.calculateReviewsScore(data) * weights.cold.reviews,
        },
        years_in_business: {
          score: this.calculateYearsInBusinessScore(data),
          weight: weights.cold.years_in_business,
          contribution: this.calculateYearsInBusinessScore(data) * weights.cold.years_in_business,
        },
        revenue_proxies: {
          score: this.calculateRevenueProxiesScore(data),
          weight: weights.cold.revenue_proxies,
          contribution: this.calculateRevenueProxiesScore(data) * weights.cold.revenue_proxies,
        },
        industry_fit: {
          score: this.calculateIndustryFitScore(data, industry),
          weight: weights.cold.industry_fit,
          contribution: this.calculateIndustryFitScore(data, industry) * weights.cold.industry_fit,
        },
      }
    } else {
      return {
        behavior: {
          score: this.calculateBehaviorScore(data),
          weight: weights.warm.behavior,
          contribution: this.calculateBehaviorScore(data) * weights.warm.behavior,
        },
        urgency: {
          score: this.calculateUrgencyScore(data),
          weight: weights.warm.urgency,
          contribution: this.calculateUrgencyScore(data) * weights.warm.urgency,
        },
        profitability: {
          score: data.cold_score || 5,
          weight: weights.warm.profitability,
          contribution: (data.cold_score || 5) * weights.warm.profitability,
        },
      }
    }
  }
}

// Export singleton instance
export const leadScoringEngine = new LeadScoringEngine()
