import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('BACKEND_URL environment variable is required');
}


export async function POST(request: NextRequest) {
  try {
    // --- FIX: Use the headers() function to get the headers ---
    const requestHeaders = headers();
    const authorization = requestHeaders.get('authorization');
    // --- END FIX ---

    if (!authorization) {
      console.log(`Authorization header required`);
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { supplier_tpin, buyer_tpin, amount, vat } = body;

    // Validate input
    if (!supplier_tpin || !buyer_tpin || !amount || !vat) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Forward the request to the backend with the authorization header
    // Added a trailing slash to /invoices/ for FastAPI compatibility
    const response = await fetch(`${BACKEND_URL}/invoices`, {
      method: "POST",
      headers: {
        "Authorization": authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supplier_tpin,
        buyer_tpin,
        amount,
        vat,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.detail || "Failed to issue invoice" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/invoices:", error);
    return NextResponse.json({ error: "Failed to issue invoice" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // --- FIX: Use the headers() function to get the headers ---
    const requestHeaders = headers();
    const authorization = requestHeaders.get('authorization');
    // --- END FIX ---

    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Forward the request to the backend with the authorization header
    // Added a trailing slash to /invoices/ for FastAPI compatibility
    const response = await fetch(`${BACKEND_URL}/invoices`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    });
    console.log(BACKEND_URL)

    if (!response.ok) {
      const data = await response.text();
      console.log("Error fetching invoices:", data);
      return NextResponse.json(
        { error: data || 'Failed to fetch invoices' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}