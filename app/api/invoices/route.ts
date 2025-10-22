import { type NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

const BACKEND_URL = process.env.BACKEND_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supplier_tpin, buyer_tpin, amount, vat } = body

    // Validate input
    if (!supplier_tpin || !buyer_tpin || !amount || !vat) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const response = await fetch(`${BACKEND_URL}/invoices/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supplier_tpin,
        buyer_tpin,
        amount,
        vat,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.detail || "Failed to issue invoice" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/invoices:", error)
    return NextResponse.json({ error: "Failed to issue invoice" }, { status: 500 })
  }
}