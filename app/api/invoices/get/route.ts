import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

if (!BACKEND_URL) {
  throw new Error('BACKEND_URL environment variable is required')
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the request
    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Forward the request to the backend with the authorization header
    const response = await fetch(`${BACKEND_URL}/invoices`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend error' }))
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch invoices' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}