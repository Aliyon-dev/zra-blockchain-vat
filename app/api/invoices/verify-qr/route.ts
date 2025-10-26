// In app/api/invoices/verify-qr/route.ts
import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { qr_data } = body // qr_data is now a JSON string: "{\"invoice_id\": ...}"

    // --- FIX ---
    // 1. Parse the JSON string from the QR code
    let parsedData
    let invoice_id: string
    
    try {
      parsedData = JSON.parse(qr_data)
      invoice_id = parsedData.invoice_id
      
      if (!invoice_id) {
        throw new Error('QR Code missing invoice_id')
      }
      
    } catch (e) {
      console.error("Invalid QR format:", e)
      return NextResponse.json({ valid: false, error: 'Invalid QR Code format.' }, { status: 400 })
    }
    
    // 2. Call your Python backend with the extracted ID
    const pyResponse = await fetch(`${BACKEND_URL}/invoices/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_id: invoice_id }), // Send the extracted ID
    })

    const pyResult = await pyResponse.json()
    return NextResponse.json(pyResult)

  } catch (error) {
    console.error('Error in /verify-qr:', error)
    return NextResponse.json({ valid: false, error: 'An internal server error occurred.' }, { status: 500 })
  }
}