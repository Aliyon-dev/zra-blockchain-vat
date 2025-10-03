"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search } from "lucide-react"
import VerifyResult from "@/components/verify-result"

export default function VerifyForm() {
  const [invoiceId, setInvoiceId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Error verifying invoice:", error)
      setResult({ valid: false, error: "Failed to verify invoice. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Enter Invoice ID</CardTitle>
          <CardDescription className="text-muted-foreground">
            Provide the invoice ID to check its authenticity and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceId" className="text-foreground">
                Invoice ID
              </Label>
              <Input
                id="invoiceId"
                name="invoiceId"
                placeholder="e.g., INV-2024-001"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                required
                className="bg-background border-input"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Verify Invoice
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && <VerifyResult data={result} />}
    </div>
  )
}
