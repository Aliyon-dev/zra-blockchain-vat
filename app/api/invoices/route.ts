import { type NextRequest, NextResponse } from "next/server"

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

// Mock function to generate QR code URL
function generateQRCode(invoiceId: string): string {
  return `/placeholder.svg?height=200&width=200&query=QR code for invoice ${invoiceId}`
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
    const qrCode = generateQRCode(invoiceId)

    // In a real app, this would save to blockchain/database
    console.log("[v0] Invoice issued:", { invoiceId, supplierTpin, buyerTpin, amount, vat })

    return NextResponse.json({
      invoiceId,
      hash,
      timestamp: new Date(timestamp).toLocaleString(),
      qrCode,
    })
  } catch (error) {
    console.error("[v0] Error in POST /api/invoices:", error)
    return NextResponse.json({ error: "Failed to issue invoice" }, { status: 500 })
  }
}
