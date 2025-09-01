"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Plus, Search, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function LeadsHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [industryFilter, setIndustryFilter] = useState(searchParams.get("industry") || "all")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [showFilters, setShowFilters] = useState(false)

  const updateFilters = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (industryFilter !== "all") params.set("industry", industryFilter)
    if (statusFilter !== "all") params.set("status", statusFilter)

    router.push(`/dashboard/leads?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setIndustryFilter("all")
    setStatusFilter("all")
    router.push("/dashboard/leads")
  }

  const hasActiveFilters = searchQuery || industryFilter !== "all" || statusFilter !== "all"

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-600 mt-2">Manage and track all your leads in one place.</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilters()}
            />
          </div>

          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button asChild>
            <Link href="/dashboard/leads/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Link>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Industry:</label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="coaching">Coaching</SelectItem>
                  <SelectItem value="local_services">Local Services</SelectItem>
                  <SelectItem value="financial_services">Financial Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={updateFilters} size="sm">
              Apply Filters
            </Button>

            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
