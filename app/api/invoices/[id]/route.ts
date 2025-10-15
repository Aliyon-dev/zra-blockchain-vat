import { type NextRequest, NextResponse } from "next/server"

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