import { createClient } from "@/lib/supabase/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Mail, Phone, ArrowUpDown } from "lucide-react"

interface LeadsTableProps {
  userId: string
  searchQuery?: string
  industryFilter?: string
  statusFilter?: string
}

export async function LeadsTable({ userId, searchQuery, industryFilter, statusFilter }: LeadsTableProps) {
  const supabase = await createClient()

  let query = supabase.from("leads").select("*").eq("user_id", userId)

  if (searchQuery) {
    query = query.or(
      `company_name.ilike.%${searchQuery}%,contact_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
    )
  }

  if (industryFilter && industryFilter !== "all") {
    query = query.eq("industry", industryFilter)
  }

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  const { data: leads } = await query.order("created_at", { ascending: false })

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
      case "replied":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (!leads || leads.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchQuery || industryFilter || statusFilter ? "No matching leads found" : "No leads yet"}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || industryFilter || statusFilter
                ? "Try adjusting your search or filters to find leads."
                : "Start building your lead database by adding your first lead."}
            </p>
            {!searchQuery && !industryFilter && !statusFilter && (
              <Button asChild>
                <a href="/dashboard/leads/add">Add Your First Lead</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="font-semibold text-slate-900">
                  <Button variant="ghost" className="h-auto p-0 font-semibold">
                    Company
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-slate-900">Contact</TableHead>
                <TableHead className="font-semibold text-slate-900">Industry</TableHead>
                <TableHead className="font-semibold text-slate-900">
                  <Button variant="ghost" className="h-auto p-0 font-semibold">
                    Score
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold text-slate-900">Status</TableHead>
                <TableHead className="font-semibold text-slate-900">Added</TableHead>
                <TableHead className="font-semibold text-slate-900">Last Contact</TableHead>
                <TableHead className="font-semibold text-slate-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="border-slate-100">
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-900">{lead.company_name}</div>
                      {lead.website && (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {lead.website}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {lead.contact_name && <div className="font-medium text-slate-900">{lead.contact_name}</div>}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                          {lead.email}
                        </a>
                      )}
                      {lead.phone && <div className="text-sm text-slate-500">{lead.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-slate-700">{lead.industry?.replace("_", " ")}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <Badge variant="secondary" className={getScoreBadgeColor(lead.warm_score || lead.cold_score)}>
                        {lead.warm_score || lead.cold_score}/10
                      </Badge>
                      <span className="text-xs text-slate-500">{lead.warm_score ? "Warm" : "Cold"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusBadgeColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{formatDate(lead.created_at)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">
                      {lead.last_contacted_at ? formatDate(lead.last_contacted_at) : "Never"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/dashboard/leads/${lead.id}/score`}>
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      {lead.email && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${lead.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {lead.phone && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`tel:${lead.phone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
