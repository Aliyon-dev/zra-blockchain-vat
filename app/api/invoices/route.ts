import { type NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

// Mock function to generate a simple hash
function generateHash(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(16, "0")
}

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supplierTpin, buyerTpin, amount, vat } = body

    // Validate input
    if (!supplierTpin || !buyerTpin || !amount || !vat) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate invoice data
    const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`
    const timestamp = new Date().toISOString()
    const dataToHash = `${invoiceId}${supplierTpin}${buyerTpin}${amount}${vat}${timestamp}`
    const hash = generateHash(dataToHash)

    // Generate QR code with invoice data
    const qrCode = await generateQRCode(invoiceId, supplierTpin, buyerTpin, amount, vat, hash)

    // In a real app, this would save to blockchain/database
    console.log("[v0] Invoice issued:", { invoiceId, supplierTpin, buyerTpin, amount, vat })

    return NextResponse.json({
      invoiceId,
      hash,
      timestamp: new Date(timestamp).toLocaleString(),
      qrCode,
      supplierTpin,
      buyerTpin,
      amount,
      vat
    })
  } catch (error) {
    console.error("[v0] Error in POST /api/invoices:", error)
    return NextResponse.json({ error: "Failed to issue invoice" }, { status: 500 })
  }
}
