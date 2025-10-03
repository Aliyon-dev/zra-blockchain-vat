"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import InvoiceResult from "@/components/invoice-result"

export default function InvoiceForm() {
  const [formData, setFormData] = useState({
    supplierTpin: "",
    buyerTpin: "",
    amount: "",
    vat: "",
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Error issuing invoice:", error)
      setResult({ error: "Failed to issue invoice. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Invoice Details</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the supplier, buyer, and transaction information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supplierTpin" className="text-foreground">
                  Supplier TPIN
                </Label>
                <Input
                  id="supplierTpin"
                  name="supplierTpin"
                  placeholder="e.g., 1234567890"
                  value={formData.supplierTpin}
                  onChange={handleChange}
                  required
                  className="bg-background border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerTpin" className="text-foreground">
                  Buyer TPIN
                </Label>
                <Input
                  id="buyerTpin"
                  name="buyerTpin"
                  placeholder="e.g., 0987654321"
                  value={formData.buyerTpin}
                  onChange={handleChange}
                  required
                  className="bg-background border-input"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">
                  Amount (ZMW)
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1000.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="bg-background border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vat" className="text-foreground">
                  VAT (%)
                </Label>
                <Input
                  id="vat"
                  name="vat"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 16.00"
                  value={formData.vat}
                  onChange={handleChange}
                  required
                  className="bg-background border-input"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Issuing Invoice...
                </>
              ) : (
                "Issue Invoice"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && <InvoiceResult data={result} />}
    </div>
  )
}
