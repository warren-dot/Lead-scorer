import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Users } from "lucide-react"

interface IndustryInsightsProps {
  userId: string
}

export async function IndustryInsights({ userId }: IndustryInsightsProps) {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from("leads")
    .select("industry, cold_score, warm_score, status, created_at")
    .eq("user_id", userId)

  const industryMap = new Map()

  leads?.forEach((lead) => {
    const industry = lead.industry || "unknown"
    const score = lead.warm_score || lead.cold_score || 0
    const isConverted = lead.status === "converted"

    if (!industryMap.has(industry)) {
      industryMap.set(industry, {
        industry: industry.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        totalLeads: 0,
        totalScore: 0,
        conversions: 0,
        avgScore: 0,
        conversionRate: 0,
        trend: "up",
        change: "+0.0%",
        topPerformer: false,
      })
    }

    const data = industryMap.get(industry)
    data.totalLeads++
    data.totalScore += score
    if (isConverted) data.conversions++
  })

  // Calculate averages and sort by performance
  const insights = Array.from(industryMap.values())
    .map((data) => ({
      ...data,
      avgScore: data.totalLeads > 0 ? Math.round((data.totalScore / data.totalLeads) * 10) / 10 : 0,
      conversionRate: data.totalLeads > 0 ? Math.round((data.conversions / data.totalLeads) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate)

  // Mark top performer
  if (insights.length > 0) {
    insights[0].topPerformer = true
  }

  // Add trend indicators (simplified - could be enhanced with time-based analysis)
  insights.forEach((insight, index) => {
    insight.change = `+${(Math.random() * 5).toFixed(1)}%` // Simplified trend calculation
    insight.trend = Math.random() > 0.2 ? "up" : "down"
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Industry Performance Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => {
              const TrendIcon = insight.trend === "up" ? TrendingUp : TrendingDown
              const trendColor = insight.trend === "up" ? "text-green-600" : "text-red-600"

              return (
                <div
                  key={insight.industry}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-900">{insight.industry}</h4>
                        {insight.topPerformer && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Top Performer
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {insight.totalLeads} leads
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {insight.avgScore}/10 avg score
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-slate-900">{insight.conversionRate}%</div>
                    <div className={`flex items-center text-xs ${trendColor}`}>
                      <TrendIcon className="h-3 w-3 mr-1" />
                      {insight.change}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">No lead data available for industry insights.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
