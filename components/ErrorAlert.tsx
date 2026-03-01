interface ErrorAlertProps {
  title?: string
  message: string
  details?: string
  onDismiss?: () => void
}

export default function ErrorAlert({
  title = '오류 발생',
  message,
  details,
  onDismiss,
}: ErrorAlertProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm mt-1">{message}</p>
          {details && (
            <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">
              {details}
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 ml-4"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
