import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeadsTable } from "@/components/leads/leads-table"
import { LeadsHeader } from "@/components/leads/leads-header"

interface LeadsPageProps {
  searchParams: {
    search?: string
    industry?: string
    status?: string
  }
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <LeadsHeader />
      <LeadsTable
        userId={data.user.id}
        searchQuery={searchParams.search}
        industryFilter={searchParams.industry}
        statusFilter={searchParams.status}
      />
    </div>
  )
}
