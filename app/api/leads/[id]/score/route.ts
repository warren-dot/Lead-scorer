import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { leadScoringEngine } from "@/lib/scoring/scoring-engine"
import type { LeadScoringData, Industry } from "@/lib/scoring/types"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Get scoring data from request body
    const scoringData: LeadScoringData = await request.json()

    console.log("[v0] Received scoring data:", scoringData)

    // Calculate scores
    const coldScore = leadScoringEngine.calculateColdScore(scoringData, lead.industry as Industry)
    const warmScore =
      scoringData.responseTimeHours !== undefined
        ? leadScoringEngine.calculateWarmScore({ ...scoringData, coldScore }, lead.industry as Industry)
        : null

    console.log("[v0] Calculated scores - Cold:", coldScore, "Warm:", warmScore)

    const updateData: any = {
      // Save calculated scores
      cold_score: Math.round(coldScore * 10) / 10, // Round to 1 decimal
      updated_at: new Date().toISOString(),

      // Save all scoring data fields
      website_quality: scoringData.websiteQuality,
      has_booking_system: scoringData.hasBookingSystem,
      has_clear_pricing: scoringData.hasClearPricing,
      content_freshness: scoringData.contentFreshness || null,
      review_count: scoringData.reviewCount,
      average_rating: scoringData.averageRating,
      years_in_business: scoringData.yearsInBusiness,
      pricing_signals: scoringData.pricingSignals,
      customer_volume_indicators: scoringData.customerVolumeIndicators,
      location: scoringData.location || null,
      target_fit: scoringData.targetFit || null,
    }

    if (warmScore !== null) {
      updateData.warm_score = Math.round(warmScore * 10) / 10
      // Save warm scoring data if provided
      if (scoringData.responseTimeHours !== undefined) {
        updateData.replied_at = new Date().toISOString()
      }
    }

    console.log("[v0] Updating lead with data:", updateData)

    const { error: updateError } = await supabase.from("leads").update(updateData).eq("id", id)

    if (updateError) {
      console.error("[v0] Database update error:", updateError)
      return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
    }

    // Get score interpretation
    const interpretation = leadScoringEngine.getScoreInterpretation(warmScore || coldScore)

    // Get detailed breakdown
    const breakdown = leadScoringEngine.getScoringBreakdown(
      { ...scoringData, coldScore },
      lead.industry as Industry,
      warmScore ? "warm" : "cold",
    )

    console.log("[v0] Scoring complete - returning results")

    return NextResponse.json({
      coldScore: Math.round(coldScore * 10) / 10,
      warmScore: warmScore ? Math.round(warmScore * 10) / 10 : null,
      interpretation,
      breakdown,
    })
  } catch (error) {
    console.error("[v0] Scoring error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
