import { GoogleGenerativeAI } from '@google/generative-ai'

export async function analyzeFinancialData(
  companyName: string,
  year: string,
  financialData: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  // gemini-2.0-flash-exp 또는 gemini-1.5-flash-latest를 사용합니다
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = `다음은 ${companyName}의 ${year}년 재무 데이터입니다.
누구나 이해할 수 있도록 쉽고 명확하게 분석해주세요.

재무 데이터:
${financialData}

다음 항목에 대해 분석해주세요:
1. 📊 **재무 건전성 평가** - 자산, 부채, 자본 상태는 건강한지
2. 💰 **수익성 분석** - 매출액과 영업이익이 어떤 추세인지
3. 📈 **성장성 분석** - 연년간 성장 또는 감소 현황
4. ⚠️ **주요 특이사항** - 눈여겨볼 점이 있는지

각 항목을 일반인도 이해할 수 있는 쉬운 언어로 설명해주세요.`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return text
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // 할당량 초과 에러 감지
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Quota exceeded')) {
      throw new Error(
        'AI 분석 서비스의 일일 할당량을 초과했습니다. 내일 다시 시도해주세요. ' +
        '또는 Gemini API의 유료 플랜을 사용하시면 제한 없이 이용할 수 있습니다.'
      )
    }
    
    throw error
  }
}
