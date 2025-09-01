import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface RecentLeadsProps {
  userId: string
}

export async function RecentLeads({ userId }: RecentLeadsProps) {
  const supabase = await createClient()

  const { data: leads } = await supabase
    .from("leads")
    .select("id, company_name, industry, status, cold_score, warm_score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800"
    if (score >= 6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "converted":
        return "bg-green-100 text-green-800"
      case "qualified":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-900">Recent Leads</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/leads" className="text-blue-600 hover:text-blue-700">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {leads && leads.length > 0 ? (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{lead.company_name}</h4>
                  <p className="text-sm text-slate-600 capitalize">{lead.industry?.replace("_", " ")}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className={getScoreBadgeColor(lead.warm_score || lead.cold_score)}>
                    Score: {lead.warm_score || lead.cold_score}/10
                  </Badge>
                  <Badge variant="secondary" className={getStatusBadgeColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">No leads yet. Start by adding your first lead!</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/leads/add">Add Lead</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
