"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
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
      const { data } = await supabase.from("leads").select("cold_score, warm_score").eq("user_id", userId)
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

  leads?.forEach((lead) => {
    const score = lead.warm_score || lead.cold_score || 0

    let rangeIndex = 0
    if (score >= 9) rangeIndex = 4
    else if (score >= 7) rangeIndex = 3
    else if (score >= 5) rangeIndex = 2
    else if (score >= 3) rangeIndex = 1
    else rangeIndex = 0

    scoreRanges[rangeIndex].count++
  })

  // Calculate percentages
  const totalLeads = leads?.length || 1
  scoreRanges.forEach((range) => {
    range.percentage = Math.round((range.count / totalLeads) * 100)
  })

  const COLORS = ["#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Lead Score Analytics</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
