'use client'

import { useState, useEffect } from 'react'
import { FinancialData } from '@/lib/types'
import { analyzeFinancialDataLocally } from '@/lib/local-analysis'
import ReactMarkdown from 'react-markdown'

interface AIAnalysisProps {
  companyName: string
  year: string
  financialData: FinancialData[]
}

export default function AIAnalysis({
  companyName,
  year,
  financialData,
}: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>('')
  const [localAnalysis, setLocalAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showLocalAnalysis, setShowLocalAnalysis] = useState(true)
  const [analysisMode, setAnalysisMode] = useState<'local' | 'ai'>('local')

  // 로컬 분석 자동 실행
  useEffect(() => {
    try {
      const result = analyzeFinancialDataLocally(financialData)
      setLocalAnalysis(result.analysis)
      setShowLocalAnalysis(true)
    } catch (err) {
      console.error('Local analysis error:', err)
    }
  }, [financialData])

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          year,
          financialData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.message || errorData.error || 'Failed to analyze'
        
        // 할당량 초과 에러 처리
        if (response.status === 429 || errorData.code === 'QUOTA_EXCEEDED') {
          throw new Error(
            `할당량 초과: ${errorMessage}\n\n` +
            '해결 방법:\n' +
            '1. 내일 다시 시도\n' +
            '2. Google AI Studio에서 유료 플랜으로 업그레이드\n' +
            '3. 다른 회사의 분석을 시도'
          )
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      setAnalysis(result.analysis)
      setShowAnalysis(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error analyzing data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        📊 재무 분석
      </h2>

      {/* 분석 모드 선택 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setAnalysisMode('local')
            setShowLocalAnalysis(true)
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            analysisMode === 'local'
              ? 'bg-green-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          📈 자동 분석 (무료)
        </button>
        <button
          onClick={() => setAnalysisMode('ai')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            analysisMode === 'ai'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          🤖 AI 분석 (Gemini)
        </button>
      </div>

      {/* 로컬 분석 모드 */}
      {analysisMode === 'local' && showLocalAnalysis && localAnalysis && (
        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✨ 기본 재무 지표 기반의 자동 분석입니다. 복잡한 계산 없이 빠르게 회사의 재무 건강 상태를 파악할 수 있습니다.
            </p>
          </div>

          <div className="space-y-4 text-slate-800 dark:text-slate-200">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mt-6 mb-4" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-3 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-3 space-y-1" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="mb-1" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-slate-900 dark:text-white" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
              }}
            >
              {localAnalysis}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* AI 분석 모드 */}
      {analysisMode === 'ai' && (
        <>
          {!showAnalysis && !loading && !error && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                🤖 <strong>Gemini AI</strong>가 더 깊이 있는 분석을 제공합니다.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'AI 분석 중...' : 'AI 분석 받기'}
              </button>
            </div>
          )}

          {error && (
            <div className={`border rounded-lg p-4 mb-4 ${
              error.includes('할당량')
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
              <p className="font-semibold">
                {error.includes('할당량') ? '⚠️ AI 분석 서비스 일시 불가' : '❌ 분석 오류'}
              </p>
              <p className="text-sm mt-1 whitespace-pre-wrap">{error}</p>
              {error.includes('할당량') && (
                <div className="mt-3 pt-3 border-t border-current opacity-75">
                  <p className="text-sm font-medium">해결 방법:</p>
                  <ul className="text-sm mt-2 list-disc list-inside space-y-1">
                    <li>내일 다시 시도해주세요</li>
                    <li><a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-75">Google AI Studio에서 유료 플랜 업그레이드</a></li>
                    <li><strong>"자동 분석"</strong> 탭에서 기본 분석을 사용</li>
                  </ul>
                  <p className="text-xs mt-2">
                    자세한 정보는 프로젝트의 <code className="bg-black bg-opacity-20 px-1 rounded">GEMINI_API_GUIDE.md</code> 참고
                  </p>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin mr-4">
                <div className="text-4xl">✨</div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Gemini AI가 {companyName}의 재무 데이터를 분석 중입니다...
              </p>
            </div>
          )}

          {showAnalysis && analysis && !loading && (
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  ℹ️ 다음 분석은 {companyName}의 {year}년 재무 데이터를 기반으로 Gemini AI가 생성한 결과입니다.
                  투자 판단의 참고자료로만 활용해주세요.
                </p>
              </div>

              <div className="space-y-4 text-slate-800 dark:text-slate-200">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl font-bold mt-6 mb-4" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-3 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-3 space-y-1" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-slate-900 dark:text-white" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>

              <button
                onClick={() => {
                  setShowAnalysis(false)
                  setAnalysis('')
                }}
                className="mt-6 px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                분석 다시 받기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
