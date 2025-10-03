import { type NextRequest, NextResponse } from "next/server"

// Mock database of invoices
const mockInvoices: Record<string, any> = {
  "INV-2024-001": {
    valid: true,
    invoiceId: "INV-2024-001",
    supplierTpin: "1234567890",
    buyerTpin: "0987654321",
    amount: 1000.0,
    vat: 16.0,
    hash: "a3f5d8c2e1b4f7a9",
    timestamp: new Date("2024-01-15").toLocaleString(),
  },
  "INV-2024-002": {
    valid: true,
    invoiceId: "INV-2024-002",
    supplierTpin: "2345678901",
    buyerTpin: "1098765432",
    amount: 2500.0,
    vat: 16.0,
    hash: "b4e6c9d3f2a5e8b1",
    timestamp: new Date("2024-01-16").toLocaleString(),
  },
  "INV-2024-003": {
    valid: true,
    invoiceId: "INV-2024-003",
    supplierTpin: "3456789012",
    buyerTpin: "2109876543",
    amount: 750.5,
    vat: 16.0,
    hash: "c5f7d1e4a3b6f9c2",
    timestamp: new Date("2024-01-17").toLocaleString(),
  },
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoiceId = params.id

    // Check if invoice exists in mock database
    const invoice = mockInvoices[invoiceId]

    if (invoice) {
      return NextResponse.json(invoice)
    } else {
      return NextResponse.json({ valid: false, error: "Invoice not found in registry" }, { status: 404 })
    }
  } catch (error) {
    console.error("[v0] Error in GET /api/invoices/[id]:", error)
    return NextResponse.json({ valid: false, error: "Failed to verify invoice" }, { status: 500 })
  }
}
