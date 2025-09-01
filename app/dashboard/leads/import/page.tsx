import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ImportLeadsForm } from "@/components/leads/import-leads-form"

export default async function ImportLeadsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Import Leads</h1>
        <p className="text-slate-600 mt-2">Upload a CSV file to bulk import leads into your database</p>
      </div>

      <ImportLeadsForm userId={user.id} />
    </div>
  )
}
