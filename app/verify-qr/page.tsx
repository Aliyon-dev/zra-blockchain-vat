'use client'

import { useState } from 'react'
import QRScanner from '@/components/qr-scanner'
import VerifyResult from '@/components/verify-result'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyQRPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleScan = async (qrData: string) => {
    setLoading(true)
    //setResult(null)

    try {
      const response = await fetch('/api/invoices/verify-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qr_data: qrData }),
      })

      const data = await response.json()
      setResult(data)
      console.log(data)
    } catch (error) {
      console.error('Error verifying QR code:', error)
      setResult({ 
        valid: false, 
        error: 'Failed to verify QR code. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleError = (error: string) => {
    setResult({ 
      valid: false, 
      error: error 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50/30 to-indigo-50/20">
      <header className="border-b border-blue-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                VAT Manager
              </h1>
              <p className="text-xs text-blue-600 font-medium">QR Verification</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/issue">
              <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-700">
                Issue Invoice
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-700">
                Verify by ID
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-4">
              Verify Invoice with QR Code
            </h1>
            <p className="text-lg text-blue-700">
              Scan the QR code on your invoice to instantly verify its authenticity
            </p>
          </div>

          {/* Scanner */}
          {!result && !loading && (
            <QRScanner onScan={handleScan} onError={handleError} />
          )}

          {/* Loading State */}
          {loading && (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <p className="text-lg font-medium text-foreground">Verifying invoice...</p>
                <p className="text-sm text-muted-foreground">Checking blockchain records</p>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              <VerifyResult data={result.invoice || null} />
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setResult(null)
                    setLoading(false)
                  }}
                  variant="outline"
                  size="lg"
                >
                  Scan Another QR Code
                </Button>
              </div>
            </div>
          )}

          {/* Info Card */}
          {!result && !loading && (
            <Card className="border-blue-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-900">How it Works</CardTitle>
                <CardDescription className="text-blue-700">
                  QR code verification provides instant authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">1</span>
                  </div>
                  <p>Click "Start Camera" to activate your device's camera</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">2</span>
                  </div>
                  <p>Position the QR code within the camera frame</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">3</span>
                  </div>
                  <p>The system will automatically scan and verify the invoice</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs">4</span>
                  </div>
                  <p>View the verification results and invoice details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

