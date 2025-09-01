import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Target } from "lucide-react"

interface AnalyticsOverviewProps {
  userId: string
}

export async function AnalyticsOverview({ userId }: AnalyticsOverviewProps) {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from("leads")
    .select("status, cold_score, warm_score, created_at, industry")
    .eq("user_id", userId)

  console.log("[v0] Analytics Debug - User ID:", userId)
  console.log("[v0] Analytics Debug - Leads data:", leads)
  console.log("[v0] Analytics Debug - Total leads found:", leads?.length || 0)

  const totalLeads = leads?.length || 0
  const highQualityLeads = leads?.filter((lead) => (lead.warm_score || lead.cold_score) >= 7).length || 0
  const avgScore = leads?.length
    ? (leads.reduce((sum, lead) => sum + (lead.warm_score || lead.cold_score || 0), 0) / leads.length).toFixed(1)
    : "0.0"

  // Calculate trends (comparing last 30 days vs previous 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recentLeads = leads?.filter((lead) => new Date(lead.created_at) >= thirtyDaysAgo).length || 0
  const previousLeads =
    leads?.filter((lead) => new Date(lead.created_at) >= sixtyDaysAgo && new Date(lead.created_at) < thirtyDaysAgo)
      .length || 0

  const leadsTrend = previousLeads > 0 ? (((recentLeads - previousLeads) / previousLeads) * 100).toFixed(1) : "0.0"
  const leadsTrendDirection = Number.parseFloat(leadsTrend) >= 0 ? "up" : "down"

  const recentScores =
    leads
      ?.filter((lead) => new Date(lead.created_at) >= thirtyDaysAgo)
      .map((lead) => lead.warm_score || lead.cold_score || 0) || []
  const previousScores =
    leads
      ?.filter((lead) => new Date(lead.created_at) >= sixtyDaysAgo && new Date(lead.created_at) < thirtyDaysAgo)
      .map((lead) => lead.warm_score || lead.cold_score || 0) || []

  const recentAvgScore =
    recentScores.length > 0 ? recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length : 0
  const previousAvgScore =
    previousScores.length > 0 ? previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length : 0

  const scoreTrend =
    previousAvgScore > 0 ? (((recentAvgScore - previousAvgScore) / previousAvgScore) * 100).toFixed(1) : "0.0"
  const scoreTrendDirection = Number.parseFloat(scoreTrend) >= 0 ? "up" : "down"

  const recentHighQualityLeads =
    leads?.filter((lead) => new Date(lead.created_at) >= thirtyDaysAgo && (lead.warm_score || lead.cold_score) >= 7)
      .length || 0
  const previousHighQualityLeads =
    leads?.filter(
      (lead) =>
        new Date(lead.created_at) >= sixtyDaysAgo &&
        new Date(lead.created_at) < thirtyDaysAgo &&
        (lead.warm_score || lead.cold_score) >= 7,
    ).length || 0

  const highQualityTrend =
    previousHighQualityLeads > 0
      ? (((recentHighQualityLeads - previousHighQualityLeads) / previousHighQualityLeads) * 100).toFixed(1)
      : "0.0"
  const highQualityTrendDirection = Number.parseFloat(highQualityTrend) >= 0 ? "up" : "down"

  const metrics = [
    {
      title: "Total Leads",
      value: totalLeads.toString(),
      change: `${leadsTrendDirection === "up" ? "+" : ""}${leadsTrend}%`,
      trend: leadsTrendDirection,
      icon: Users,
    },
    {
      title: "Avg Lead Score",
      value: avgScore,
      change: `${scoreTrendDirection === "up" ? "+" : ""}${scoreTrend}%`,
      trend: scoreTrendDirection,
      icon: Target,
    },
    {
      title: "High-Quality Leads",
      value: highQualityLeads.toString(),
      change: `${highQualityTrendDirection === "up" ? "+" : ""}${highQualityTrend}%`,
      trend: highQualityTrendDirection,
      icon: Target,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
        const trendColor = metric.trend === "up" ? "text-green-600" : "text-red-600"

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{metric.title}</CardTitle>
              <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
              <div className={`flex items-center text-xs ${trendColor} mt-1`}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {metric.change} from last period
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
