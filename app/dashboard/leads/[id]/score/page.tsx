import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeadScoringForm } from "@/components/leads/lead-scoring-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ScoreLeadPageProps {
  params: Promise<{ id: string }>
}

export default async function ScoreLeadPage({ params }: ScoreLeadPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get the lead
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (leadError || !lead) {
    redirect("/dashboard/leads")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/leads">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leads
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Score Lead</h1>
        <p className="text-slate-600 mt-2">
          Calculate lead quality score for <span className="font-medium">{lead.company_name}</span>
        </p>
      </div>

      <LeadScoringForm
        leadId={id}
        initialData={{
          industry: lead.industry,
          companyName: lead.company_name,
          website: lead.website,
        }}
        onScoreCalculated={(result) => {
          console.log("Score calculated:", result)
        }}
      />
    </div>
  )
}
