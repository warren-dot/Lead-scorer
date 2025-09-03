"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const industries = [
  { value: "real_estate", label: "Real Estate" },
  { value: "agency", label: "Marketing Agency" },
  { value: "coaching", label: "Coaching & Consulting" },
  { value: "local_services", label: "Local Services" },
  { value: "financial_services", label: "Financial Services" },
]

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email)

      if (existingUser?.user) {
        setError(
          "This email address is already registered. Please try a different email address or sign in to your existing account.",
        )
        setIsLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            company_name: companyName,
            industry: industry,
          },
        },
      })
      if (error) throw error
      router.push("/auth/signup-success")
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()
        if (
          errorMessage.includes("user already registered") ||
          errorMessage.includes("email already registered") ||
          errorMessage.includes("already been registered")
        ) {
          setError(
            "This email address is already registered. Please try a different email address or sign in to your existing account.",
          )
        } else if (errorMessage.includes("password")) {
          setError("Password must be at least 6 characters long.")
        } else if (errorMessage.includes("email")) {
          setError("Please enter a valid email address.")
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">Create your account</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Start generating and scoring leads today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-slate-700 font-medium">
                  Company Name
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Enter your company name"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-slate-700 font-medium">
                  Industry
                </Label>
                <Select value={industry} onValueChange={setIndustry} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind.value} value={ind.value}>
                        {ind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                  {error.includes("already registered") && (
                    <div className="mt-2">
                      <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium underline">
                        Sign in to your existing account
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
