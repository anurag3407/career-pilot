import { useState } from 'react'
import { X, Calendar } from 'lucide-react'

export default function SchedulePost({ onSchedule, onClose }) {
  const [scheduledTime, setScheduledTime] = useState('')

  const handleSchedule = () => {
    if (!scheduledTime) return
    onSchedule(new Date(scheduledTime))
    onClose()
  }

  const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
    .toISOString()
    .slice(0, 16)

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
            <label className="block text-sm font-medium text-foreground mb-2">
              Schedule for
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              min={minDateTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
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