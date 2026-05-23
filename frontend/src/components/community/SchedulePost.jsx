import { useState } from 'react'
import { X, Calendar } from 'lucide-react'

export default function SchedulePost({ onSchedule, onClose }) {
  const [scheduledTime, setScheduledTime] = useState('')
  const [error, setError] = useState('')

  const getLocalMinDateTime = () => {
    const now = new Date(Date.now() + 5 * 60 * 1000)
    const pad = (n) => String(n).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
  }

  const handleSchedule = () => {
    if (!scheduledTime) {
      setError('Please select a time.')
      return
    }
    const selected = new Date(scheduledTime)
    const minAllowed = new Date(Date.now() + 5 * 60 * 1000)
    if (selected < minAllowed) {
      setError('Please schedule at least 5 minutes in the future.')
      return
    }
    onSchedule(selected)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Schedule Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label
              htmlFor="schedule-time"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Schedule for
            </label>
            <input
              id="schedule-time"
              type="datetime-local"
              value={scheduledTime}
              min={getLocalMinDateTime()}
              onChange={(e) => {
                setScheduledTime(e.target.value)
                setError('')
              }}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSchedule}
              disabled={!scheduledTime}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}