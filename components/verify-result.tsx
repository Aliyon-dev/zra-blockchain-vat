"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Calendar, Hash, User, DollarSign } from "lucide-react"
import Image from "next/image"

interface VerifyResultProps {
  data: {
    valid?: boolean
    invoiceId?: string
    supplierTpin?: string
    buyerTpin?: string
    amount?: number
    vat?: number
    hash?: string
    timestamp?: string
    qrCode?: string
    error?: string
  }
}

export default function VerifyResult({ data }: VerifyResultProps) {
  if (data.error || data.valid === false) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Invalid Invoice</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            This invoice could not be verified in the blockchain registry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="border-destructive bg-destructive/10">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive-foreground">
              {data.error || "Invoice not found or has been tampered with"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const totalAmount = data.amount && data.vat ? (data.amount * (1 + data.vat / 100)).toFixed(2) : "0.00"

  return (
    <Card className="border-success bg-success/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <CardTitle className="text-success">Valid Invoice</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          This invoice has been verified on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Supplier TPIN</p>
                <p className="text-base font-mono text-foreground">{data.supplierTpin}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Buyer TPIN</p>
                <p className="text-base font-mono text-foreground">{data.buyerTpin}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <DollarSign className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Amount</p>
                <p className="text-base text-foreground">ZMW {data.amount?.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <DollarSign className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">VAT ({data.vat}%)</p>
                <p className="text-base text-foreground">ZMW {((data.amount! * data.vat!) / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Amount (incl. VAT)</p>
              <p className="text-xl font-semibold text-foreground">ZMW {totalAmount}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
            <Hash className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">Blockchain Hash</p>
              <p className="text-sm font-mono text-foreground break-all">{data.hash}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">Issued On</p>
              <p className="text-base text-foreground">{data.timestamp}</p>
            </div>
          </div>
        </div>

        {data.qrCode && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card border border-border">
            <p className="text-sm font-medium text-muted-foreground">Invoice QR Code</p>
            <div className="relative w-48 h-48 bg-white p-4 rounded-lg">
              <Image src={data.qrCode || "/placeholder.svg"} alt="Invoice QR Code" fill className="object-contain" />
            </div>
            <p className="text-xs text-muted-foreground text-center">Original QR code from the issued invoice</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
