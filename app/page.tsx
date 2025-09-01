import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (data?.user) {
    redirect("/dashboard")
  } else {
    redirect("/auth/login")
  }
}
