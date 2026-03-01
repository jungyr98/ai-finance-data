import { NextRequest, NextResponse } from 'next/server'
import { analyzeFinancialData } from '@/lib/gemini'
import { FinancialData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, year, financialData } = body

    // Validate input
    if (!companyName || !year || !financialData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format financial data for analysis
    const financialSummary = formatFinancialSummary(financialData)

    // Call Gemini API
    const analysis = await analyzeFinancialData(companyName, year, financialSummary)

    return NextResponse.json({ analysis }, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Analysis API error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // 할당량 초과 에러인 경우 429 상태 코드 반환
    if (errorMessage.includes('할당량') || errorMessage.includes('quota')) {
      return NextResponse.json(
        { 
          error: 'API 할당량 초과',
          message: errorMessage,
          code: 'QUOTA_EXCEEDED'
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to analyze financial data', message: errorMessage },
      { status: 500 }
    )
  }
}

function formatFinancialSummary(data: FinancialData[]): string {
  const balanceSheet = data.filter((d) => d.sj_div === 'BS')
  const incomeStatement = data.filter((d) => d.sj_div === 'IS')

  let summary = '## 재무상태표 (Balance Sheet)\n\n'

  // Current year data
  summary += '### 당기 (현재 해)\n'
  balanceSheet
    .filter((d) => d.fs_div === 'CFS' && d.thstrm_amount)
    .slice(0, 5)
    .forEach((d) => {
      summary += `- ${d.account_nm}: ${formatAmount(d.thstrm_amount)}\n`
    })

  summary += '\n### 전기 (지난 해)\n'
  balanceSheet
    .filter((d) => d.fs_div === 'CFS' && d.frmtrm_amount)
    .slice(0, 5)
    .forEach((d) => {
      summary += `- ${d.account_nm}: ${formatAmount(d.frmtrm_amount)}\n`
    })

  summary += '\n## 손익계산서 (Income Statement)\n\n'
  summary += '### 당기 (현재 해)\n'
  incomeStatement
    .filter((d) => d.fs_div === 'CFS' && d.thstrm_amount)
    .slice(0, 4)
    .forEach((d) => {
      summary += `- ${d.account_nm}: ${formatAmount(d.thstrm_amount)}\n`
    })

  summary += '\n### 전기 (지난 해)\n'
  incomeStatement
    .filter((d) => d.fs_div === 'CFS' && d.frmtrm_amount)
    .slice(0, 4)
    .forEach((d) => {
      summary += `- ${d.account_nm}: ${formatAmount(d.frmtrm_amount)}\n`
    })

  return summary
}

function formatAmount(value: string): string {
  const num = parseInt(value.replace(/,/g, ''), 10)
  if (Number.isNaN(num)) return value

  if (num >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(2)}조원`
  } else if (num >= 100_000_000) {
    return `${(num / 100_000_000).toFixed(0)}억원`
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(0)}백만원`
  }

  return `${num}원`
}
