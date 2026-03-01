'use client'

import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { FinancialData } from '@/lib/types'
import { formatCurrency, formatNumberShort, parseFinancialAmount } from '@/lib/utils'

interface FinancialChartsProps {
  data: FinancialData[]
  companyName: string
  year: string
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

export default function FinancialCharts({
  data,
  year,
}: FinancialChartsProps) {
  const [fsDiv, setFsDiv] = useState<'CFS' | 'OFS'>('CFS')

  // Organize data by category
  const balanceSheetData = useMemo(() => {
    const filtered = data.filter(
      (item) => item.sj_div === 'BS' && item.fs_div === fsDiv
    )

    const categories = [
      '유동자산',
      '비유동자산',
      '자산총계',
      '유동부채',
      '비유동부채',
      '부채총계',
      '자본금',
      '이익잉여금',
      '자본총계',
    ]

    return categories
      .map((category) => {
        const item = filtered.find((d) => d.account_nm === category)
        if (!item) return null

        return {
          category,
          current: parseFinancialAmount(item.thstrm_amount),
          previous: parseFinancialAmount(item.frmtrm_amount),
          previous2: item.bfefrmtrm_amount
            ? parseFinancialAmount(item.bfefrmtrm_amount)
            : 0,
        }
      })
      .filter(Boolean)
  }, [data, fsDiv])

  const incomeStatementData = useMemo(() => {
    const filtered = data.filter(
      (item) => item.sj_div === 'IS' && item.fs_div === fsDiv
    )

    const categories = [
      '매출액',
      '영업이익',
      '법인세차감전 순이익',
      '당기순이익(손실)',
    ]

    return categories
      .map((category) => {
        const item = filtered.find((d) => d.account_nm === category)
        if (!item) return null

        return {
          category: category.replace(/\(손실\)/, ''),
          current: parseFinancialAmount(item.thstrm_amount),
          previous: parseFinancialAmount(item.frmtrm_amount),
          previous2: item.bfefrmtrm_amount
            ? parseFinancialAmount(item.bfefrmtrm_amount)
            : 0,
        }
      })
      .filter(Boolean)
  }, [data, fsDiv])

  const assetComposition = useMemo(() => {
    const filtered = data.filter(
      (item) => item.sj_div === 'BS' && item.fs_div === fsDiv
    )

    const currentAssets = filtered.find((d) => d.account_nm === '유동자산')
    const nonCurrentAssets = filtered.find((d) => d.account_nm === '비유동자산')

    if (!currentAssets || !nonCurrentAssets) return []

    return [
      {
        name: '유동자산',
        value: parseFinancialAmount(currentAssets.thstrm_amount),
      },
      {
        name: '비유동자산',
        value: parseFinancialAmount(nonCurrentAssets.thstrm_amount),
      },
    ]
  }, [data, fsDiv])

  const liabilityComposition = useMemo(() => {
    const filtered = data.filter(
      (item) => item.sj_div === 'BS' && item.fs_div === fsDiv
    )

    const currentLiability = filtered.find((d) => d.account_nm === '유동부채')
    const nonCurrentLiability = filtered.find((d) => d.account_nm === '비유동부채')
    const capital = filtered.find((d) => d.account_nm === '자본총계')

    if (!currentLiability || !nonCurrentLiability || !capital) return []

    return [
      {
        name: '유동부채',
        value: parseFinancialAmount(currentLiability.thstrm_amount),
      },
      {
        name: '비유동부채',
        value: parseFinancialAmount(nonCurrentLiability.thstrm_amount),
      },
      {
        name: '자본',
        value: parseFinancialAmount(capital.thstrm_amount),
      },
    ]
  }, [data, fsDiv])

  const formatCurrencyForChart = (value: number) => {
    return formatNumberShort(value)
  }

  if (balanceSheetData.length === 0 && incomeStatementData.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-200">
        해당 연도의 재무 데이터를 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Financial Statement Type Toggle */}
      <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md">
        <button
          onClick={() => setFsDiv('CFS')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            fsDiv === 'CFS'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          연결재무제표
        </button>
        <button
          onClick={() => setFsDiv('OFS')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            fsDiv === 'OFS'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
        >
          개별재무제표
        </button>
      </div>

      {/* Balance Sheet - Bar Chart */}
      {balanceSheetData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            📊 재무상태표 (자산/부채/자본)
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={balanceSheetData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatCurrencyForChart}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name={`${year}년`} />
              <Bar dataKey="previous" fill="#8b5cf6" name={`${Number(year) - 1}년`} />
              <Bar
                dataKey="previous2"
                fill="#ec4899"
                name={`${Number(year) - 2}년`}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Asset Composition - Pie Chart */}
      {assetComposition.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            🥧 자산 구성
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetComposition}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} ${formatNumberShort(entry.value)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {assetComposition.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Liability & Capital Composition - Pie Chart */}
      {liabilityComposition.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            🥧 부채 & 자본 구성
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={liabilityComposition}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} ${formatNumberShort(entry.value)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {liabilityComposition.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Income Statement - Line Chart */}
      {incomeStatementData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            📈 손익계산서 추이
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={incomeStatementData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatCurrencyForChart}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Line type="monotone" dataKey="current" stroke="#3b82f6" name={`${year}년`} />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#8b5cf6"
                name={`${Number(year) - 1}년`}
              />
              <Line
                type="monotone"
                dataKey="previous2"
                stroke="#ec4899"
                name={`${Number(year) - 2}년`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
