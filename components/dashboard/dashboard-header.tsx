"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LogOut, User, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export function DashboardHeader() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="bg-background border-b border-border px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-foreground">LeadGen Pro</h1>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
