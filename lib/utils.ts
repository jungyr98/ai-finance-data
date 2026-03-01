export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value, 10) : value

  if (Number.isNaN(num)) return '0원'

  if (Math.abs(num) >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(1)}조원`
  } else if (Math.abs(num) >= 100_000_000) {
    return `${(num / 100_000_000).toFixed(0)}억원`
  } else if (Math.abs(num) >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(0)}백만원`
  }

  return `${num}원`
}

export function formatNumberShort(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value, 10) : value

  if (Number.isNaN(num)) return '0'

  if (Math.abs(num) >= 1_000_000_000_000) {
    return `${(num / 1_000_000_000_000).toFixed(1)}조`
  } else if (Math.abs(num) >= 100_000_000) {
    return `${(num / 100_000_000).toFixed(0)}억`
  } else if (Math.abs(num) >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(0)}백만`
  }

  return num.toString()
}

export function parseFinancialAmount(value: string): number {
  return parseInt(value.replace(/,/g, ''), 10) || 0
}

export const REPORT_CODES = {
  '11011': '사업보고서 (Full Year)',
  '11012': '반기보고서 (Mid-Year)',
  '11013': '1분기보고서 (Q1)',
  '11014': '3분기보고서 (Q3)',
} as const

export const YEARS = Array.from({ length: 11 }, (_, i) => {
  const year = new Date().getFullYear() - i
  return year.toString()
})
