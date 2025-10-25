import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id

    if (!BACKEND_URL) {
      return NextResponse.json({ valid: false, error: "Backend URL not configured" }, { status: 500 })
    }

    // Call the new verification endpoint
    const response = await fetch(`${BACKEND_URL}/invoices/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ invoice_id: parseInt(invoiceId) }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ valid: false, error: errorData.error || "Failed to verify invoice" }, { status: response.status })
    }

    const data = await response.json()
    
    // Map backend response to frontend expected format
    if (data.valid && data.invoice) {
      return NextResponse.json({
        valid: true,
        invoiceId: data.invoice.invoiceId,
        supplierTpin: data.invoice.supplier_tpin,
        buyerTpin: data.invoice.buyer_tpin,
        amount: data.invoice.amount,
        vat: data.invoice.vat,
        hash: data.invoice.blockchain_hash,
        timestamp: data.invoice.timestamp,
        status: data.invoice.status,
      })
    } else {
      return NextResponse.json({ valid: false, error: data.error || "Invoice verification failed" })
    }
  } catch (error) {
    console.error(`Error in GET /api/invoices/[id]:`, error)
    return NextResponse.json({ valid: false, error: "Failed to verify invoice" }, { status: 500 })
  }
}