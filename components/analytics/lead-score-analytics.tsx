"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface LeadScoreAnalyticsProps {
  userId: string
}

export function LeadScoreAnalytics({ userId }: LeadScoreAnalyticsProps) {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient()
      const { data } = await supabase.from("leads").select("cold_score, warm_score, status").eq("user_id", userId)
      setLeads(data || [])
      setLoading(false)
    }
    fetchLeads()
  }, [userId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Lead Score Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const scoreRanges = [
    { score: "1-2", count: 0, percentage: 0 },
    { score: "3-4", count: 0, percentage: 0 },
    { score: "5-6", count: 0, percentage: 0 },
    { score: "7-8", count: 0, percentage: 0 },
    { score: "9-10", count: 0, percentage: 0 },
  ]

  const conversionRanges = [
    { score: "1-2", conversions: 0, rate: 0, total: 0 },
    { score: "3-4", conversions: 0, rate: 0, total: 0 },
    { score: "5-6", conversions: 0, rate: 0, total: 0 },
    { score: "7-8", conversions: 0, rate: 0, total: 0 },
    { score: "9-10", conversions: 0, rate: 0, total: 0 },
  ]

  leads?.forEach((lead) => {
    const score = lead.warm_score || lead.cold_score || 0
    const isConverted = lead.status === "converted"

    let rangeIndex = 0
    if (score >= 9) rangeIndex = 4
    else if (score >= 7) rangeIndex = 3
    else if (score >= 5) rangeIndex = 2
    else if (score >= 3) rangeIndex = 1
    else rangeIndex = 0

    scoreRanges[rangeIndex].count++
    conversionRanges[rangeIndex].total++
    if (isConverted) {
      conversionRanges[rangeIndex].conversions++
    }
  })

  // Calculate percentages and conversion rates
  const totalLeads = leads?.length || 1
  scoreRanges.forEach((range) => {
    range.percentage = Math.round((range.count / totalLeads) * 100)
  })

  conversionRanges.forEach((range) => {
    range.rate = range.total > 0 ? Math.round((range.conversions / range.total) * 100 * 10) / 10 : 0
  })

  const COLORS = ["#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Lead Score Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Score Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={scoreRanges}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
              >
                {scoreRanges.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} leads`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Conversion Rate by Score</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="score" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value}%`, "Conversion Rate"]} />
              <Bar dataKey="rate" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
