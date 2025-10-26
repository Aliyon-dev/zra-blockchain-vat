'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, X, Upload } from 'lucide-react'

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [isScanning])

  const startScanning = async () => {
    try {
      setError(null)
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          onScan(decodedText)
          stopScanning()
        },
        (errorMessage) => {
          // Error callback (can be ignored for continuous scanning)
          console.log('Scanning...', errorMessage)
        }
      )

      setIsScanning(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start camera'
      setError(errorMsg)
      if (onError) onError(errorMsg)
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current = null
        setIsScanning(false)
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      const scanner = new Html5Qrcode('qr-reader')
      
      const result = await scanner.scanFile(file, false)
      onScan(result)
    } catch (err) {
      const errorMsg = 'Failed to read QR code from image'
      setError(errorMsg)
      if (onError) onError(errorMsg)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Scan QR Code</CardTitle>
        <CardDescription className="text-muted-foreground">
          Use your camera to scan an invoice QR code or upload an image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner Container */}
        <div id="qr-reader" className="w-full rounded-lg overflow-hidden bg-black" />

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {!isScanning ? (
            <>
              <Button
                onClick={startScanning}
                className="flex-1"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Camera
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Image
              </Button>
            </>
          ) : (
            <Button
              onClick={stopScanning}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <X className="mr-2 h-5 w-5" />
              Stop Scanning
            </Button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Instructions */}
        <div className="text-sm text-muted-foreground text-center space-y-2">
          <p>Position the QR code within the camera frame</p>
          <p>The scan will happen automatically when detected</p>
        </div>
      </CardContent>
    </Card>
  )
}

