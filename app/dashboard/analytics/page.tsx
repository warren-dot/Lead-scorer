import { Suspense } from "react"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { LeadScoreAnalytics } from "@/components/analytics/lead-score-analytics"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader />
      <Suspense fallback={<AnalyticsLoading />}>
        <div className="space-y-6">
          <AnalyticsOverview userId={user.id} />
          <div className="grid gap-6 lg:grid-cols-1">
            <LeadScoreAnalytics userId={user.id} />
          </div>
        </div>
      </Suspense>
    </div>
  )
}
