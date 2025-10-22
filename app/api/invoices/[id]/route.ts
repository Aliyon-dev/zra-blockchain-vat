import { type NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

// Function to generate QR code data URL
async function generateQRCode(invoiceId: string, supplierTpin: string, buyerTpin: string, amount: number, vat: number, hash: string): Promise<string> {
  const qrData = {
    invoiceId,
    supplierTpin,
    buyerTpin,
    amount,
    vat,
    hash,
    timestamp: new Date().toISOString()
  }

  try {
    // Generate QR code as data URL (base64)
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrCodeDataURL
  } catch (error) {
    console.error("Error generating QR code:", error)
    // Fallback to placeholder if QR generation fails
    return `/placeholder.svg?height=200&width=200&query=QR code for invoice ${invoiceId}`
  }
}

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id

    const response = await fetch(`${BACKEND_URL}/invoices/${invoiceId}`)

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ valid: false, error: errorData.detail || "Failed to verify invoice" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ valid: true, ...data })
  } catch (error) {
    console.error(`Error in GET /api/invoices/[id]:`, error)
    return NextResponse.json({ valid: false, error: "Failed to verify invoice" }, { status: 500 })
  }
}