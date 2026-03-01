export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
      <div className="h-96 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  )
}
