import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '재무 데이터 시각화 분석 서비스',
  description: '한국 상장회사의 재무 데이터를 쉽게 분석하고 시각화해보세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📊 AI Finance
            </a>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-600 dark:text-slate-400">
            <p>© 2024 AI Finance. 데이터 출처: 금융감독원 OpenDart</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
