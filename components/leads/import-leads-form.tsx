"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react"

interface ImportLeadsFormProps {
  userId: string
}

interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: string[]
}

export function ImportLeadsForm({ userId }: ImportLeadsFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please select a CSV file")
        return
      }
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", userId)

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/leads/import", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const result: ImportResult = await response.json()
      setResult(result)

      if (result.success && result.imported > 0) {
        setTimeout(() => {
          router.push("/dashboard/leads")
        }, 3000)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed")
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent =
      "company_name,contact_name,email,phone,website,industry,notes,website_quality,has_booking_system,has_clear_pricing,content_freshness,review_count,average_rating,years_in_business,pricing_signals,customer_volume_indicators,location,target_fit\nExample Corp,John Doe,john@example.com,555-0123,https://example.com,real_estate,Sample lead,8,true,true,7,45,4.2,5,7,6,New York,8\n"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "leads_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">CSV Template</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Download our CSV template to ensure your data is formatted correctly for import.
          </p>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="csv-file" className="text-slate-700 font-medium">
              Select CSV File
            </Label>
            <div className="flex items-center space-x-4">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="h-11"
                disabled={isUploading}
              />
              {file && (
                <div className="flex items-center text-sm text-slate-600">
                  <FileText className="h-4 w-4 mr-1" />
                  {file.name}
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Uploading and processing...</span>
                <span className="text-slate-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success/Results Display */}
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    <strong>Import completed:</strong> {result.imported} leads imported successfully
                    {result.failed > 0 && `, ${result.failed} failed`}
                  </p>
                  {result.errors.length > 0 && (
                    <div>
                      <p className="font-medium">Errors:</p>
                      <ul className="list-disc list-inside text-sm">
                        {result.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {result.errors.length > 5 && <li>... and {result.errors.length - 5} more errors</li>}
                      </ul>
                    </div>
                  )}
                  {result.success && result.imported > 0 && (
                    <p className="text-sm text-green-600">Redirecting to leads page in 3 seconds...</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          <div className="flex items-center justify-end space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Leads
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Format Requirements */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">CSV Format Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Required Columns:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <code>company_name</code> - Company name (required)
                </li>
                <li>
                  <code>industry</code> - Industry type (required): real_estate, agency, coaching, local_services,
                  financial_services
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Basic Information (Optional):</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <code>contact_name</code> - Contact person name
                </li>
                <li>
                  <code>email</code> - Email address
                </li>
                <li>
                  <code>phone</code> - Phone number
                </li>
                <li>
                  <code>website</code> - Website URL
                </li>
                <li>
                  <code>notes</code> - Additional notes
                </li>
                <li>
                  <code>location</code> - Business location/city
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Scoring Criteria (Optional):</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <code>website_quality</code> - Website quality score (1-10)
                </li>
                <li>
                  <code>has_booking_system</code> - Has online booking (true/false)
                </li>
                <li>
                  <code>has_clear_pricing</code> - Has clear pricing displayed (true/false)
                </li>
                <li>
                  <code>content_freshness</code> - Content freshness score (1-10)
                </li>
                <li>
                  <code>review_count</code> - Number of online reviews
                </li>
                <li>
                  <code>average_rating</code> - Average review rating (1-5)
                </li>
                <li>
                  <code>years_in_business</code> - Years in business
                </li>
                <li>
                  <code>pricing_signals</code> - Pricing signals score (1-10)
                </li>
                <li>
                  <code>customer_volume_indicators</code> - Customer volume score (1-10)
                </li>
                <li>
                  <code>target_fit</code> - Target fit assessment (1-10)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
