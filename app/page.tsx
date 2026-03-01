import CompanySearch from '@/components/CompanySearch'
import { Company } from '@/lib/types'
import { readFileSync } from 'fs'
import { join } from 'path'

async function getCompanies(): Promise<Company[]> {
  try {
    const filePath = join(process.cwd(), 'public/data/companies.json')
    const fileContents = readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error loading companies:', error)
    return []
  }
}

export default async function Home() {
  const companies = await getCompanies()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-8">
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          재무 데이터 시각화 분석
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          한국 상장회사의 재무정보를 쉽고 명확하게 분석하세요.
          <br />
          OpenDart API와 AI가 함께 제공하는 깊이 있는 통찰력
        </p>
      </section>

      {/* Search Section */}
      <section className="max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
            회사 검색
          </h2>
          <CompanySearch companies={companies} />
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
            빠른 검색
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            회사명, 종목코드로 빠르게 원하는 회사의 재무정보를 찾아보세요.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
            시각화 분석
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            복잡한 재무제표를 보기 좋은 차트로 한눈에 파악할 수 있습니다.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
            AI 분석
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Gemini AI가 재무 데이터를 누구나 이해할 수 있게 쉽게 분석합니다.
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-blue-50 dark:bg-slate-800 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          데이터 정보
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          모든 재무 데이터는 금융감독원의 전자공시 시스템(OpenDart)에서 제공합니다.
          최신의 실제 데이터를 기반으로 정확한 분석을 제공합니다.
        </p>
      </section>
    </div>
  )
}
