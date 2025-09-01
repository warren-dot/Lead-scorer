import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, TrendingUp, Mail } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  // Get lead statistics
  const { data: leads } = await supabase.from("leads").select("status, cold_score, warm_score").eq("user_id", userId)

  const totalLeads = leads?.length || 0
  const qualifiedLeads = leads?.filter((lead) => lead.cold_score >= 7 || lead.warm_score >= 7).length || 0
  const convertedLeads = leads?.filter((lead) => lead.status === "converted").length || 0
  const avgScore = leads?.length
    ? Math.round(leads.reduce((sum, lead) => sum + (lead.warm_score || lead.cold_score), 0) / leads.length)
    : 0

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads.toString(),
      icon: Users,
      description: "All leads in your database",
    },
    {
      title: "Qualified Leads",
      value: qualifiedLeads.toString(),
      icon: Target,
      description: "Leads scoring 7+ points",
    },
    {
      title: "Converted",
      value: convertedLeads.toString(),
      icon: TrendingUp,
      description: "Successfully converted leads",
    },
    {
      title: "Avg Score",
      value: avgScore.toString(),
      icon: Mail,
      description: "Average lead quality score",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
