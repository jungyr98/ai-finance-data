'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { Company } from '@/lib/types'

interface CompanySearchProps {
  companies: Company[]
}

export default function CompanySearch({ companies }: CompanySearchProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Company[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const fuseIndex = useMemo(() => {
    const fuse = new Fuse(companies, {
      keys: ['corp_name', 'stock_code', 'corp_code'],
      threshold: 0.3,
      minMatchCharLength: 1,
      includeScore: true,
      useExtendedSearch: false,
    })
    return fuse
  }, [companies])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchResults = fuseIndex.search(searchQuery).map((result) => result.item)
    setResults(searchResults.slice(0, 10))
    setIsOpen(true)
    setHighlightedIndex(0)
  }, [searchQuery, fuseIndex])

  const handleSelectCompany = (company: Company) => {
    router.push(`/company/${company.corp_code}`)
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        handleSelectCompany(results[highlightedIndex])
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="회사명, 종목코드로 검색 (예: 삼성, 005930)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (searchQuery.trim() !== '') {
                setIsOpen(true)
              }
            }}
            className="w-full px-6 py-4 text-lg border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-white transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
            {results.map((company, index) => (
              <button
                key={company.corp_code}
                onClick={() => handleSelectCompany(company)}
                className={`w-full px-6 py-3 text-left transition-colors ${
                  index === highlightedIndex
                    ? 'bg-blue-50 dark:bg-slate-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white">
                  {company.corp_name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  종목코드: {company.stock_code} | 고유번호: {company.corp_code}
                </div>
              </button>
            ))}
          </div>
        )}

        {isOpen && searchQuery.trim() !== '' && results.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 text-center text-slate-600 dark:text-slate-400">
            검색 결과가 없습니다
          </div>
        )}
      </div>

      {companies.length > 0 && (
        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          현재 {companies.length.toLocaleString()}개의 회사 정보를 보유 중입니다
        </div>
      )}
    </div>
  )
}
