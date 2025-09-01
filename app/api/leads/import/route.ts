import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { leadScoringEngine } from "@/lib/scoring/scoring-engine"
import type { LeadScoringData, Industry } from "@/lib/scoring/types"

interface LeadData {
  company_name: string
  contact_name?: string
  email?: string
  phone?: string
  website?: string
  industry: string
  notes?: string
  website_quality?: number
  has_booking_system?: boolean
  has_clear_pricing?: boolean
  content_freshness?: number
  review_count?: number
  average_rating?: number
  years_in_business?: number
  pricing_signals?: number
  customer_volume_indicators?: number
  location?: string
  target_fit?: number
}

const VALID_INDUSTRIES = ["real_estate", "agency", "coaching", "local_services", "financial_services"]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (userId !== user.id) {
      return NextResponse.json({ error: "Invalid user" }, { status: 403 })
    }

    const csvContent = await file.text()
    const lines = csvContent.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV file must contain headers and at least one data row" }, { status: 400 })
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const requiredHeaders = ["company_name", "industry"]

    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        return NextResponse.json(
          {
            error: `Missing required column: ${required}`,
          },
          { status: 400 },
        )
      }
    }

    const leads: LeadData[] = []
    const errors: string[] = []
    let imported = 0
    let failed = 0

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))

      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`)
        failed++
        continue
      }

      const leadData: Partial<LeadData> = {}

      headers.forEach((header, index) => {
        const value = values[index]
        if (value) {
          switch (header) {
            case "company_name":
            case "contact_name":
            case "email":
            case "phone":
            case "website":
            case "industry":
            case "notes":
            case "location":
              leadData[header as keyof LeadData] = value
              break
            case "website_quality":
            case "content_freshness":
            case "review_count":
            case "years_in_business":
            case "pricing_signals":
            case "customer_volume_indicators":
            case "target_fit":
              const numValue = Number.parseInt(value)
              if (!isNaN(numValue)) {
                leadData[header as keyof LeadData] = numValue as any
              }
              break
            case "average_rating":
              const ratingValue = Number.parseFloat(value)
              if (!isNaN(ratingValue)) {
                leadData[header as keyof LeadData] = ratingValue as any
              }
              break
            case "has_booking_system":
            case "has_clear_pricing":
              leadData[header as keyof LeadData] = value.toLowerCase() === ("true" as any)
              break
          }
        }
      })

      if (!leadData.company_name) {
        errors.push(`Row ${i + 1}: Missing company name`)
        failed++
        continue
      }

      if (!leadData.industry) {
        errors.push(`Row ${i + 1}: Missing industry`)
        failed++
        continue
      }

      if (!VALID_INDUSTRIES.includes(leadData.industry)) {
        errors.push(
          `Row ${i + 1}: Invalid industry "${leadData.industry}". Must be one of: ${VALID_INDUSTRIES.join(", ")}`,
        )
        failed++
        continue
      }

      if (leadData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
        errors.push(`Row ${i + 1}: Invalid email format`)
        failed++
        continue
      }

      if (leadData.website_quality && (leadData.website_quality < 1 || leadData.website_quality > 10)) {
        errors.push(`Row ${i + 1}: Website quality must be between 1-10`)
        failed++
        continue
      }

      if (leadData.average_rating && (leadData.average_rating < 1 || leadData.average_rating > 5)) {
        errors.push(`Row ${i + 1}: Average rating must be between 1-5`)
        failed++
        continue
      }

      if (leadData.review_count && leadData.review_count < 0) {
        errors.push(`Row ${i + 1}: Review count cannot be negative`)
        failed++
        continue
      }

      leads.push(leadData as LeadData)
    }

    if (leads.length > 0) {
      const leadsToInsert = leads.map((lead) => {
        let calculatedScore = 5 // fallback default

        try {
          const scoringData: LeadScoringData = {
            industry: lead.industry as Industry,
            website: lead.website,
            website_quality: lead.website_quality,
            has_booking_system: lead.has_booking_system || false,
            has_clear_pricing: lead.has_clear_pricing || false,
            content_freshness: lead.content_freshness,
            review_count: lead.review_count,
            average_rating: lead.average_rating,
            years_in_business: lead.years_in_business,
            pricing_signals: lead.pricing_signals,
            customer_volume_indicators: lead.customer_volume_indicators,
            location: lead.location,
            target_fit: lead.target_fit,
          }

          calculatedScore = leadScoringEngine.calculateColdScore(scoringData, lead.industry as Industry)
        } catch (error) {
          console.error(`Failed to calculate score for ${lead.company_name}:`, error)
        }

        return {
          ...lead,
          user_id: userId,
          status: "new",
          cold_score: calculatedScore,
          warm_score: 0,
        }
      })

      const { error: insertError } = await supabase.from("leads").insert(leadsToInsert)

      if (insertError) {
        console.error("Database insert error:", insertError)
        return NextResponse.json(
          {
            error: "Failed to insert leads into database",
          },
          { status: 500 },
        )
      }

      imported = leads.length
    }

    return NextResponse.json({
      success: imported > 0,
      imported,
      failed,
      errors: errors.slice(0, 10), // Limit errors returned
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      {
        error: "Failed to process CSV file",
      },
      { status: 500 },
    )
  }
}
