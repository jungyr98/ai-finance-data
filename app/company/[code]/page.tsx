'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import FinancialCharts from '@/components/FinancialCharts'
import AIAnalysis from '@/components/AIAnalysis'
import { OpenDartResponse } from '@/lib/types'
import { REPORT_CODES, YEARS } from '@/lib/utils'

export default function CompanyPage() {
  const params = useParams()
  const code = params.code as string

  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  )
  const [selectedReport, setSelectedReport] = useState<string>('11011')
  const [data, setData] = useState<OpenDartResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')

  useEffect(() => {
    const loadFinancialData = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/financial?corp_code=${code}&bsns_year=${selectedYear}&reprt_code=${selectedReport}`
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.message || errorData.error || 'Failed to load financial data'
          )
        }

        const financialData = await response.json()

        if (financialData.status !== '000') {
          throw new Error(
            financialData.message || 'Failed to fetch financial data from OpenDart'
          )
        }

        setData(financialData)

        // Extract company name from the first data item
        if (financialData.list && financialData.list.length > 0) {
          // Fetch company info
          const companiesRes = await fetch('/data/companies.json')
          const companies = await companiesRes.json()
          const company = companies.find(
            (c: any) => c.corp_code === code
          )
          if (company) {
            setCompanyName(company.corp_name)
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        console.error('Error loading financial data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      loadFinancialData()
    }
  }, [code, selectedYear, selectedReport])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← 뒤로가기
        </a>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {companyName || '회사 정보'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          고유번호: {code}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              사업연도
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              보고서 유형
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-white"
            >
              {Object.entries(REPORT_CODES).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
          <p className="font-semibold">오류 발생</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">
            다른 연도나 보고서를 선택해주세요.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin">
            <div className="text-5xl">⏳</div>
          </div>
          <p className="ml-4 text-slate-600 dark:text-slate-400">
            재무 데이터를 불러오는 중입니다...
          </p>
        </div>
      )}

      {/* Financial Charts */}
      {data && !loading && !error && (
        <>
          <FinancialCharts data={data.list} companyName={companyName} year={selectedYear} />
          <AIAnalysis
            companyName={companyName}
            year={selectedYear}
            financialData={data.list}
          />
        </>
      )}

      {/* Empty State */}
      {!loading && !data && !error && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            재무 데이터가 없습니다.
          </p>
        </div>
      )}
    </div>
  )
}
