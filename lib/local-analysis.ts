import { FinancialData } from '@/lib/types'

export interface LocalAnalysis {
  healthScore: number // 0-100
  profitTrend: 'improving' | 'declining' | 'stable'
  growthRate: number // percentage
  analysis: string
  warnings: string[]
}

export function analyzeFinancialDataLocally(
  data: FinancialData[]
): LocalAnalysis {
  const balanceSheetData = data.filter(
    (item) => item.sj_div === 'BS' && item.fs_div === 'CFS'
  )
  const incomeStatementData = data.filter(
    (item) => item.sj_div === 'IS' && item.fs_div === 'CFS'
  )

  // 주요 지표 추출
  const currentAssets = parseAmount(
    balanceSheetData.find((d) => d.account_nm === '유동자산')?.thstrm_amount || '0'
  )
  const currentLiabilities = parseAmount(
    balanceSheetData.find((d) => d.account_nm === '유동부채')?.thstrm_amount || '0'
  )
  const totalAssets = parseAmount(
    balanceSheetData.find((d) => d.account_nm === '자산총계')?.thstrm_amount || '0'
  )
  const totalLiabilities = parseAmount(
    balanceSheetData.find((d) => d.account_nm === '부채총계')?.thstrm_amount || '0'
  )
  const equity = parseAmount(
    balanceSheetData.find((d) => d.account_nm === '자본총계')?.thstrm_amount || '0'
  )

  const currentRevenue = parseAmount(
    incomeStatementData.find((d) => d.account_nm === '매출액')?.thstrm_amount || '0'
  )
  const previousRevenue = parseAmount(
    incomeStatementData.find((d) => d.account_nm === '매출액')?.frmtrm_amount || '0'
  )
  const currentProfit = parseAmount(
    incomeStatementData.find((d) => d.account_nm === '당기순이익(손실)')?.thstrm_amount || '0'
  )
  const previousProfit = parseAmount(
    incomeStatementData.find((d) => d.account_nm === '당기순이익(손실)')?.frmtrm_amount || '0'
  )

  // 분석 계산
  const warnings: string[] = []
  let healthScore = 100

  // 1. 유동성 분석 (유동비율)
  const currentRatio = currentAssets / currentLiabilities
  if (currentRatio < 1.0) {
    warnings.push('유동비율이 1.0 이하입니다. 단기 유동성이 약할 수 있습니다.')
    healthScore -= 25
  } else if (currentRatio < 1.5) {
    warnings.push('유동비율이 낮습니다. 단기 지급 능력이 제한적일 수 있습니다.')
    healthScore -= 10
  }

  // 2. 부채 비율 분석
  const debtRatio = totalLiabilities / totalAssets
  if (debtRatio > 0.7) {
    warnings.push('부채 비율이 높습니다. 재무 위험이 증가할 수 있습니다.')
    healthScore -= 20
  } else if (debtRatio > 0.5) {
    warnings.push('부채 비율이 중간 수준입니다.')
    healthScore -= 5
  }

  // 3. 수익성 분석
  let profitTrend: 'improving' | 'declining' | 'stable' = 'stable'
  const profitGrowth = previousProfit !== 0 ? ((currentProfit - previousProfit) / Math.abs(previousProfit)) * 100 : 0

  if (profitGrowth > 10) {
    profitTrend = 'improving'
  } else if (profitGrowth < -10) {
    profitTrend = 'declining'
    healthScore -= 15
    if (currentProfit < 0) {
      warnings.push('순이익이 음수입니다. 적자 상태입니다.')
      healthScore -= 30
    }
  }

  // 4. 성장성 분석
  const growthRate = previousRevenue !== 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0

  if (growthRate < -5) {
    warnings.push('매출액이 감소했습니다. 사업 성장이 부진합니다.')
    healthScore -= 15
  }

  // 5. 수익성 마진
  const profitMargin = currentRevenue !== 0 ? (currentProfit / currentRevenue) * 100 : 0
  if (profitMargin < 5 && profitMargin > 0) {
    warnings.push('순이익률이 낮습니다. 가격 경쟁이 심할 수 있습니다.')
    healthScore -= 10
  }

  // 건강도 점수 범위 조정
  healthScore = Math.max(0, Math.min(100, healthScore))

  // 종합 분석 문구 생성
  const analysis = generateAnalysisSummary(
    healthScore,
    currentRatio,
    debtRatio,
    profitTrend,
    growthRate,
    profitMargin
  )

  return {
    healthScore,
    profitTrend,
    growthRate: Math.round(growthRate * 100) / 100,
    analysis,
    warnings,
  }
}

function parseAmount(value: string): number {
  return parseInt(value.replace(/,/g, ''), 10) || 0
}

function generateAnalysisSummary(
  healthScore: number,
  currentRatio: number,
  debtRatio: number,
  profitTrend: string,
  growthRate: number,
  profitMargin: number
): string {
  let summary = ''

  // 종합 평가
  if (healthScore >= 80) {
    summary += '### 📈 종합 평가\n\n재무 상태가 **양호**합니다. '
  } else if (healthScore >= 60) {
    summary += '### 📊 종합 평가\n\n재무 상태가 **보통** 수준입니다. '
  } else if (healthScore >= 40) {
    summary += '### ⚠️ 종합 평가\n\n재무 상태가 **약간 취약**합니다. '
  } else {
    summary += '### 🔴 종합 평가\n\n재무 상태가 **취약**합니다. '
  }

  summary += `현재 건강도 점수는 **${healthScore}점**/100입니다.\n\n`

  // 유동성 분석
  summary += '### 💧 유동성 분석\n\n'
  if (currentRatio >= 2.0) {
    summary += `유동비율이 **${currentRatio.toFixed(2)}**로 매우 양호합니다. 단기 지급 능력이 충분합니다.\n\n`
  } else if (currentRatio >= 1.0) {
    summary += `유동비율이 **${currentRatio.toFixed(2)}**로 양호합니다. 단기 지급 능력이 적절합니다.\n\n`
  } else {
    summary += `유동비율이 **${currentRatio.toFixed(2)}**로 낮습니다. 단기 지급에 주의가 필요합니다.\n\n`
  }

  // 부채 분석
  summary += '### 💳 부채 현황\n\n'
  const debtPercentage = (debtRatio * 100).toFixed(1)
  if (debtRatio < 0.4) {
    summary += `부채비율이 **${debtPercentage}%**로 매우 낮습니다. 재무 위험이 적습니다.\n\n`
  } else if (debtRatio < 0.6) {
    summary += `부채비율이 **${debtPercentage}%**로 적절한 수준입니다.\n\n`
  } else {
    summary += `부채비율이 **${debtPercentage}%**로 높습니다. 부채 감소가 필요합니다.\n\n`
  }

  // 수익성 분석
  summary += '### 💰 수익성\n\n'
  const marginPercentage = profitMargin.toFixed(2)
  if (profitMargin > 10) {
    summary += `순이익률이 **${marginPercentage}%**로 매우 높습니다. 사업이 효율적입니다.\n\n`
  } else if (profitMargin > 5) {
    summary += `순이익률이 **${marginPercentage}%**로 양호합니다.\n\n`
  } else if (profitMargin > 0) {
    summary += `순이익률이 **${marginPercentage}%**로 낮습니다. 비용 절감이 필요할 수 있습니다.\n\n`
  } else {
    summary += `순이익이 음수입니다. 긴급 개선이 필요합니다.\n\n`
  }

  // 성장성 분석
  summary += '### 📈 성장성\n\n'
  const growthPercentage = growthRate.toFixed(2)
  if (growthRate > 10) {
    summary += `매출이 **${growthPercentage}%** 증가했습니다. 사업이 성장하고 있습니다.\n\n`
  } else if (growthRate > 0) {
    summary += `매출이 **${growthPercentage}%** 증가했습니다. 점진적 성장 중입니다.\n\n`
  } else if (growthRate > -5) {
    summary += `매출이 **${growthPercentage}%** 변화했습니다. 성장이 정체 중입니다.\n\n`
  } else {
    summary += `매출이 **${growthPercentage}%** 감소했습니다. 사업 활성화가 필요합니다.\n\n`
  }

  // 추세
  summary += '### 📊 수익 추세\n\n'
  if (profitTrend === 'improving') {
    summary += '순이익이 **증가 추세**입니다. 긍정적인 신호입니다.\n\n'
  } else if (profitTrend === 'declining') {
    summary += '순이익이 **감소 추세**입니다. 주의 깊은 관찰이 필요합니다.\n\n'
  } else {
    summary += '순이익이 **안정적**입니다.\n\n'
  }

  // 결론
  summary += '---\n\n'
  summary += `**주의**: 이 분석은 기본 재무 지표에 기반한 자동 분석입니다. `
  summary += `더 정확한 분석을 위해서는 전문가 상담이나 AI 분석을 권장합니다.`

  return summary
}
