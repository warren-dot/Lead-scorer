"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Calculator, TrendingUp } from "lucide-react"
import type { LeadScoringData } from "@/lib/scoring/types"

interface LeadScoringFormProps {
  leadId: string
  initialData?: Partial<LeadScoringData>
  onScoreCalculated?: (result: any) => void
}

export function LeadScoringForm({ leadId, initialData, onScoreCalculated }: LeadScoringFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [scoringResult, setScoringResult] = useState<any>(null)
  const [formData, setFormData] = useState<LeadScoringData>({
    industry: "",
    companyName: "",
    website: "",
    // Cold scoring defaults
    websiteQuality: 5,
    hasBookingSystem: false,
    hasClearPricing: false,
    reviewCount: 0,
    averageRating: 0,
    yearsInBusiness: 0,
    pricingSignals: 5,
    customerVolumeIndicators: 5,
    // Warm scoring defaults
    responseTimeHours: undefined,
    engagementDepth: 5,
    meetingBooked: false,
    timelineMentioned: false,
    urgencyExpressed: false,
    ...initialData,
  })

  const handleInputChange = (field: keyof LeadScoringData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateScore = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/leads/${leadId}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to calculate score")

      const result = await response.json()
      setScoringResult(result)
      onScoreCalculated?.(result)
    } catch (error) {
      console.error("Error calculating score:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-green-100"
    if (score >= 6) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Lead Scoring Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cold" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cold">Cold Outreach Scoring</TabsTrigger>
              <TabsTrigger value="warm">Warm Outreach Scoring</TabsTrigger>
            </TabsList>

            <TabsContent value="cold" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="websiteQuality">Website Quality (1-10)</Label>
                  <Input
                    id="websiteQuality"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.websiteQuality}
                    onChange={(e) => handleInputChange("websiteQuality", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness">Years in Business</Label>
                  <Input
                    id="yearsInBusiness"
                    type="number"
                    min="0"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleInputChange("yearsInBusiness", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Review Count</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    min="0"
                    value={formData.reviewCount}
                    onChange={(e) => handleInputChange("reviewCount", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageRating">Average Rating (1-5)</Label>
                  <Input
                    id="averageRating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.averageRating}
                    onChange={(e) => handleInputChange("averageRating", Number.parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricingSignals">Pricing Signals (1-10)</Label>
                  <Input
                    id="pricingSignals"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.pricingSignals}
                    onChange={(e) => handleInputChange("pricingSignals", Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerVolumeIndicators">Customer Volume (1-10)</Label>
                  <Input
                    id="customerVolumeIndicators"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.customerVolumeIndicators}
                    onChange={(e) => handleInputChange("customerVolumeIndicators", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasBookingSystem"
                    checked={formData.hasBookingSystem}
                    onCheckedChange={(checked) => handleInputChange("hasBookingSystem", checked)}
                  />
                  <Label htmlFor="hasBookingSystem">Has Booking System</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasClearPricing"
                    checked={formData.hasClearPricing}
                    onCheckedChange={(checked) => handleInputChange("hasClearPricing", checked)}
                  />
                  <Label htmlFor="hasClearPricing">Has Clear Pricing</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="warm" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="responseTimeHours">Response Time (Hours)</Label>
                  <Input
                    id="responseTimeHours"
                    type="number"
                    min="0"
                    value={formData.responseTimeHours || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "responseTimeHours",
                        e.target.value ? Number.parseInt(e.target.value) : undefined,
                      )
                    }
                    placeholder="Leave empty if no response yet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engagementDepth">Engagement Depth (1-10)</Label>
                  <Input
                    id="engagementDepth"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.engagementDepth}
                    onChange={(e) => handleInputChange("engagementDepth", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="meetingBooked"
                    checked={formData.meetingBooked}
                    onCheckedChange={(checked) => handleInputChange("meetingBooked", checked)}
                  />
                  <Label htmlFor="meetingBooked">Meeting Booked</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="timelineMentioned"
                    checked={formData.timelineMentioned}
                    onCheckedChange={(checked) => handleInputChange("timelineMentioned", checked)}
                  />
                  <Label htmlFor="timelineMentioned">Timeline Mentioned</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgencyExpressed"
                    checked={formData.urgencyExpressed}
                    onCheckedChange={(checked) => handleInputChange("urgencyExpressed", checked)}
                  />
                  <Label htmlFor="urgencyExpressed">Urgency Expressed</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6">
            <Button onClick={calculateScore} disabled={isLoading}>
              {isLoading ? "Calculating..." : "Calculate Score"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {scoringResult && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Scoring Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-2">Cold Score</div>
                <div className={`text-4xl font-bold ${getScoreColor(scoringResult.coldScore)}`}>
                  {scoringResult.coldScore}/10
                </div>
              </div>

              {scoringResult.warmScore && (
                <div className="text-center">
                  <div className="text-sm text-slate-600 mb-2">Warm Score</div>
                  <div className={`text-4xl font-bold ${getScoreColor(scoringResult.warmScore)}`}>
                    {scoringResult.warmScore}/10
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <Badge
                variant="secondary"
                className={`${getScoreBgColor(scoringResult.warmScore || scoringResult.coldScore)} text-slate-900 px-4 py-2`}
              >
                {scoringResult.interpretation.level.toUpperCase()} - {scoringResult.interpretation.description}
              </Badge>
            </div>

            {scoringResult.breakdown && (
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Score Breakdown</h4>
                {Object.entries(scoringResult.breakdown).map(([factor, data]: [string, any]) => (
                  <div key={factor} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-slate-700">{factor.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-slate-900 font-medium">
                        {data.score}/10 × {Math.round(data.weight * 100)}% = {data.contribution.toFixed(1)}
                      </span>
                    </div>
                    <Progress value={data.score * 10} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
