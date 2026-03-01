const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY is not set')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)

// 시도할 모델 목록
const modelsToTry = [
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
]

async function testModels() {
  console.log('🔍 테스트할 모델:')
  console.log('=' .repeat(50))

  for (const modelName of modelsToTry) {
    try {
      console.log(`\n테스트 중: ${modelName}...`)
      const model = genAI.getGenerativeModel({ model: modelName })

      const result = await model.generateContent('안녕하세요')
      console.log(`✅ ${modelName} - 작동함!`)
      console.log(`   응답: ${result.response.text().substring(0, 50)}...`)
    } catch (error) {
      const errorMsg = error.message
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        console.log(`❌ ${modelName} - 모델을 찾을 수 없음`)
      } else if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        console.log(`⚠️  ${modelName} - 할당량 초과`)
      } else if (errorMsg.includes('403') || errorMsg.includes('permission')) {
        console.log(`🔒 ${modelName} - 권한 없음`)
      } else {
        console.log(`❌ ${modelName} - 오류: ${errorMsg.substring(0, 50)}...`)
      }
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('✨ 테스트 완료')
  console.log(
    '첫 번째로 작동하는 모델을 lib/gemini.ts에서 사용하세요.'
  )
}

testModels()
