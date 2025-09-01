"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

const industries = [
  { value: "real_estate", label: "Real Estate" },
  { value: "agency", label: "Marketing Agency" },
  { value: "coaching", label: "Coaching & Consulting" },
  { value: "local_services", label: "Local Services" },
  { value: "financial_services", label: "Financial Services" },
]

interface AddLeadFormProps {
  userId: string
}

export function AddLeadForm({ userId }: AddLeadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    location: "",
    notes: "",
    website_quality: 5,
    has_booking_system: false,
    has_clear_pricing: false,
    content_freshness: 5,
    review_count: 0,
    average_rating: 0,
    years_in_business: 1,
    pricing_signals: 5,
    customer_volume_indicators: 5,
    target_fit: 5,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("leads").insert({
        ...formData,
        user_id: userId,
        status: "new",
        cold_score: 0,
        warm_score: 0,
      })

      if (error) throw error

      router.push("/dashboard/leads")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Basic Lead Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-slate-700 font-medium">
                  Company Name *
                </Label>
                <Input
                  id="company_name"
                  required
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  placeholder="Enter company name"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_name" className="text-slate-700 font-medium">
                  Contact Name
                </Label>
                <Input
                  id="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => handleInputChange("contact_name", e.target.value)}
                  placeholder="Enter contact person name"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-slate-700 font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="Enter website URL"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-slate-700 font-medium">
                  Industry *
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => handleInputChange("industry", value)}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-700 font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, State or Region"
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-700 font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Add any additional notes about this lead..."
                rows={4}
              />
            </div>

            <Separator />

            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Website Activity (25% of Cold Score)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website_quality" className="text-slate-700 font-medium">
                      Website Quality (0-10)
                    </Label>
                    <Select
                      value={formData.website_quality.toString()}
                      onValueChange={(value) => handleInputChange("website_quality", Number.parseInt(value))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - No website</SelectItem>
                        <SelectItem value="3">3 - Basic static site</SelectItem>
                        <SelectItem value="5">5 - Outdated but functional</SelectItem>
                        <SelectItem value="8">8 - Active, updated content</SelectItem>
                        <SelectItem value="10">10 - Professional, modern site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content_freshness" className="text-slate-700 font-medium">
                      Content Freshness (0-10)
                    </Label>
                    <Select
                      value={formData.content_freshness.toString()}
                      onValueChange={(value) => handleInputChange("content_freshness", Number.parseInt(value))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - No recent updates</SelectItem>
                        <SelectItem value="3">3 - Updates 1+ years ago</SelectItem>
                        <SelectItem value="5">5 - Updates 6-12 months ago</SelectItem>
                        <SelectItem value="8">8 - Updates within 3 months</SelectItem>
                        <SelectItem value="10">10 - Regular fresh content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_booking_system"
                      checked={formData.has_booking_system}
                      onCheckedChange={(checked) => handleInputChange("has_booking_system", checked)}
                    />
                    <Label htmlFor="has_booking_system" className="text-slate-700">
                      Has Online Booking System
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has_clear_pricing"
                      checked={formData.has_clear_pricing}
                      onCheckedChange={(checked) => handleInputChange("has_clear_pricing", checked)}
                    />
                    <Label htmlFor="has_clear_pricing" className="text-slate-700">
                      Has Clear Pricing Displayed
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Reviews & Social Proof (25% of Cold Score)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="review_count" className="text-slate-700 font-medium">
                      Total Review Count
                    </Label>
                    <Input
                      id="review_count"
                      type="number"
                      min="0"
                      value={formData.review_count}
                      onChange={(e) => handleInputChange("review_count", Number.parseInt(e.target.value) || 0)}
                      placeholder="Number of reviews"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="average_rating" className="text-slate-700 font-medium">
                      Average Rating (0.0-5.0)
                    </Label>
                    <Input
                      id="average_rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.average_rating}
                      onChange={(e) => handleInputChange("average_rating", Number.parseFloat(e.target.value) || 0)}
                      placeholder="4.5"
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Business Stability & Revenue (40% of Cold Score)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="years_in_business" className="text-slate-700 font-medium">
                      Years in Business
                    </Label>
                    <Input
                      id="years_in_business"
                      type="number"
                      min="0"
                      value={formData.years_in_business}
                      onChange={(e) => handleInputChange("years_in_business", Number.parseInt(e.target.value) || 1)}
                      placeholder="5"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricing_signals" className="text-slate-700 font-medium">
                      Pricing Signals (0-10)
                    </Label>
                    <Select
                      value={formData.pricing_signals.toString()}
                      onValueChange={(value) => handleInputChange("pricing_signals", Number.parseInt(value))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 - Low-ticket services</SelectItem>
                        <SelectItem value="5">5 - Medium-ticket services</SelectItem>
                        <SelectItem value="8">8 - High-ticket services</SelectItem>
                        <SelectItem value="10">10 - Premium pricing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_volume_indicators" className="text-slate-700 font-medium">
                      Customer Volume (0-10)
                    </Label>
                    <Select
                      value={formData.customer_volume_indicators.toString()}
                      onValueChange={(value) => handleInputChange("customer_volume_indicators", Number.parseInt(value))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 - Few visible customers</SelectItem>
                        <SelectItem value="5">5 - Moderate customer base</SelectItem>
                        <SelectItem value="8">8 - Strong customer volume</SelectItem>
                        <SelectItem value="10">10 - High volume indicators</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Target Fit (10% of Cold Score)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="target_fit" className="text-slate-700 font-medium">
                    Industry & Location Fit (0-10)
                  </Label>
                  <Select
                    value={formData.target_fit.toString()}
                    onValueChange={(value) => handleInputChange("target_fit", Number.parseInt(value))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - Off-target industry/location</SelectItem>
                      <SelectItem value="5">5 - Adjacent industry or location</SelectItem>
                      <SelectItem value="10">10 - Perfect target match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <div className="flex items-center justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding Lead..." : "Add Lead"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
