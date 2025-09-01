import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AddLeadForm } from "@/components/leads/add-lead-form"

export default async function AddLeadPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add New Lead</h1>
        <p className="text-slate-600 mt-2">Enter lead information to start tracking and scoring.</p>
      </div>

      <AddLeadForm userId={data.user.id} />
    </div>
  )
}
