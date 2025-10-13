"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search, Camera, CameraOff, QrCode } from "lucide-react"
import VerifyResult from "@/components/verify-result"
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library"

export default function VerifyForm() {
  const [invoiceId, setInvoiceId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReader = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader()

    return () => {
      if (codeReader.current) {
        codeReader.current.reset()
      }
    }
  }, [])

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

  const startScanning = async () => {
    if (!codeReader.current) return

    setIsScanning(true)
    setScanError("")

    try {
      const videoInputDevices = await codeReader.current.listVideoInputDevices()

      if (videoInputDevices.length === 0) {
        throw new Error("No camera found")
      }

      const selectedDeviceId = videoInputDevices[0].deviceId

      await codeReader.current.decodeFromVideoDevice(selectedDeviceId, videoRef.current!, (result, error) => {
        if (result) {
          try {
            const qrData = JSON.parse(result.getText())
            if (qrData.invoiceId) {
              setInvoiceId(qrData.invoiceId)
              stopScanning()
            } else {
              setScanError("Invalid QR code format")
            }
          } catch (parseError) {
            setScanError("Could not parse QR code data")
          }
        }
        if (error && !(error instanceof NotFoundException)) {
          console.error("QR scan error:", error)
          setScanError("Scanning error occurred")
        }
      })
    } catch (error) {
      console.error("Camera access error:", error)
      setScanError("Could not access camera. Please check permissions.")
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset()
    }
    setIsScanning(false)
    setScanError("")
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Verify Invoice
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter invoice ID manually or scan QR code for quick verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceId" className="text-foreground">
                Invoice ID
              </Label>
              <div className="flex gap-2">
                <Input
                  id="invoiceId"
                  name="invoiceId"
                  placeholder="e.g., INV-2024-001"
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  required
                  className="bg-background border-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={isScanning ? stopScanning : startScanning}
                  className="px-3"
                >
                  {isScanning ? (
                    <CameraOff className="h-4 w-4" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              </div>
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

          {isScanning && (
            <div className="mt-4 p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Scanning for QR Code</span>
                <Button variant="ghost" size="sm" onClick={stopScanning}>
                  <CameraOff className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </div>
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded border"
                playsInline
                muted
              />
              {scanError && (
                <p className="text-sm text-destructive mt-2">{scanError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Position a QR code within the camera view to scan automatically
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && <VerifyResult data={result} />}
    </div>
  )
}
