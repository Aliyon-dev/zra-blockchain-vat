"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Calendar, Hash, FileText, Download } from "lucide-react"
import Image from "next/image"
import { generateInvoicePDF } from "@/lib/pdf-generator"

interface InvoiceResultProps {
  data: {
    invoiceId?: string
    hash?: string
    blockchain_hash?: string
    blockchain_tx_ref?: string
    blockchain_timestamp?: string
    timestamp?: string
    qr_code?: string
    qrCode?: string
    supplierTpin?: string
    buyerTpin?: string
    amount?: number
    vat?: number
    error?: string
  }
}

export default function InvoiceResult({ data }: InvoiceResultProps) {
  const handleDownloadPDF = async () => {
    if (data.invoiceId && data.supplierTpin && data.buyerTpin && data.amount && data.vat && data.hash && data.timestamp && data.qrCode) {
      await generateInvoicePDF({
        invoiceId: data.invoiceId,
        supplierTpin: data.supplierTpin,
        buyerTpin: data.buyerTpin,
        amount: data.amount,
        vat: data.vat,
        hash: data.hash,
        timestamp: data.timestamp,
        qrCode: data.qrCode
      })
    }
  }

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <CardTitle className="text-success">Invoice Issued Successfully</CardTitle>
          </div>
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
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
              <p className="text-sm font-mono text-foreground break-all">{data.blockchain_hash || data.hash}</p>
            </div>
          </div>

          {data.blockchain_tx_ref && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <Hash className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Transaction Reference</p>
                <p className="text-sm font-mono text-foreground break-all">{data.blockchain_tx_ref}</p>
              </div>
            </div>
          )}

          {data.blockchain_timestamp && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Blockchain Timestamp</p>
                <p className="text-base text-foreground">{new Date(data.blockchain_timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">Timestamp</p>
              <p className="text-base text-foreground">{data.timestamp}</p>
            </div>
          </div>
        </div>

        {(data.qr_code || data.qrCode) && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card border border-border">
            <p className="text-sm font-medium text-muted-foreground">QR Code for Quick Verification</p>
            <div className="relative w-48 h-48 bg-white p-4 rounded-lg">
              <Image 
                src={data.qr_code || data.qrCode || "/placeholder.svg"} 
                alt="Invoice QR Code" 
                fill 
                className="object-contain" 
                unoptimized
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">Scan this code to quickly verify the invoice</p>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = data.qr_code || data.qrCode || '';
                link.download = `invoice-${data.invoiceId}-qr.png`;
                link.click();
              }}
              className="text-sm text-primary hover:underline"
            >
              Download QR Code
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}