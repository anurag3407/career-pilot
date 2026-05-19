import { useEffect, useRef } from 'react'

const LOG_COLORS = {
  info: 'text-white',
  warning: 'text-yellow-400',
  error: 'text-red-500',
  success: 'text-green-400',
}

export default function DeployLogs({ logs = [] }) {
  const logsEndRef = useRef(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [logs])

  const copyLogs = () => {
    const text = logs
      .map((log) => `[${log.type.toUpperCase()}] ${log.message}`)
      .join('\n')

    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-black border border-gray-800 rounded-xl p-4 h-80 overflow-y-auto font-mono text-sm">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">
          Deployment Logs
        </h2>

        <button
          onClick={copyLogs}
          className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white text-xs transition"
        >
          Copy Logs
        </button>
      </div>

      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className={LOG_COLORS[log.type] || 'text-white'}
          >
            [{log.type.toUpperCase()}] {log.message}
          </div>
        ))}

        <div ref={logsEndRef} />
      </div>
    </div>
  )
}