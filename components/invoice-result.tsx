"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Calendar, Hash, FileText } from "lucide-react"
import Image from "next/image"

interface InvoiceResultProps {
  data: {
    invoiceId?: string
    hash?: string
    timestamp?: string
    qrCode?: string
    error?: string
  }
}

export default function InvoiceResult({ data }: InvoiceResultProps) {
  if (data.error) {
    return (
      <Alert variant="destructive" className="border-destructive bg-destructive/10">
        <XCircle className="h-4 w-4" />
        <AlertDescription className="text-destructive-foreground">{data.error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-success bg-success/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <CardTitle className="text-success">Invoice Issued Successfully</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Your invoice has been recorded on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">Invoice ID</p>
              <p className="text-base font-mono text-foreground break-all">{data.invoiceId}</p>
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
              <p className="text-sm font-medium text-muted-foreground mb-1">Timestamp</p>
              <p className="text-base text-foreground">{data.timestamp}</p>
            </div>
          </div>
        </div>

        {data.qrCode && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card border border-border">
            <p className="text-sm font-medium text-muted-foreground">QR Code for Quick Verification</p>
            <div className="relative w-48 h-48 bg-white p-4 rounded-lg">
              <Image src={data.qrCode || "/placeholder.svg"} alt="Invoice QR Code" fill className="object-contain" />
            </div>
            <p className="text-xs text-muted-foreground text-center">Scan this code to quickly verify the invoice</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
