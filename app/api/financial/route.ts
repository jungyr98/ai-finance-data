import { NextRequest, NextResponse } from 'next/server'
import { fetchFinancialData } from '@/lib/opendart'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const corp_code = searchParams.get('corp_code')
    const bsns_year = searchParams.get('bsns_year')
    const reprt_code = searchParams.get('reprt_code')

    // Validate parameters
    if (!corp_code || !bsns_year || !reprt_code) {
      return NextResponse.json(
        {
          error: 'Missing required parameters',
          message: 'corp_code, bsns_year, reprt_code are required',
        },
        { status: 400 }
      )
    }

    // Validate parameter formats
    if (corp_code.length !== 8 || !/^\d+$/.test(corp_code)) {
      return NextResponse.json(
        { error: 'Invalid corp_code format' },
        { status: 400 }
      )
    }

    if (bsns_year.length !== 4 || !/^\d+$/.test(bsns_year)) {
      return NextResponse.json(
        { error: 'Invalid bsns_year format' },
        { status: 400 }
      )
    }

    if (!/^1101[1-4]$/.test(reprt_code)) {
      return NextResponse.json(
        { error: 'Invalid reprt_code format' },
        { status: 400 }
      )
    }

    // Fetch from OpenDart API
    const data = await fetchFinancialData(corp_code, bsns_year, reprt_code)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Financial API error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Check if it's an OpenDart API error
    if (errorMessage.includes('OpenDart API error')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch financial data', message: errorMessage },
      { status: 500 }
    )
  }
}
