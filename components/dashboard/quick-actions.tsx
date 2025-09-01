import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Upload, BarChart3 } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Add Lead",
      description: "Manually add a new lead to your database",
      href: "/dashboard/leads/add",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Import Leads",
      description: "Upload leads from CSV or connect data sources",
      href: "/dashboard/leads/import",
      icon: Upload,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "View Analytics",
      description: "Check your performance metrics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              asChild
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 border-slate-200 hover:border-slate-300 bg-transparent"
            >
              <Link href={action.href}>
                <div className={`p-2 rounded-md ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-slate-900">{action.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
