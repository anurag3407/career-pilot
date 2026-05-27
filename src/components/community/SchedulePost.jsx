import { useState } from 'react';
import { X, Clock, Calendar, AlertCircle } from 'lucide-react';
import { format, addMinutes } from 'date-fns';

/**
 * Modal for picking a future date/time to schedule a community post.
 * Calls onSchedule(isoString) when the user confirms.
 */
export default function SchedulePost({ onClose, onSchedule }) {
  // Default to 1 hour from now, rounded to the next 15-minute mark
  const getDefaultTime = () => {
    const now = new Date();
    const oneHourLater = addMinutes(now, 60);
    const minutes = oneHourLater.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    oneHourLater.setMinutes(roundedMinutes, 0, 0);
    return oneHourLater;
  };

  const defaultTime = getDefaultTime();

  // datetime-local input requires "YYYY-MM-DDTHH:mm" format
  const toInputValue = (date) => format(date, "yyyy-MM-dd'T'HH:mm");

  // Minimum allowed time: 5 minutes from now
  const minTime = toInputValue(addMinutes(new Date(), 5));

  const [value, setValue] = useState(toInputValue(defaultTime));
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const chosen = new Date(value);

    if (isNaN(chosen.getTime())) {
      setError('Please enter a valid date and time.');
      return;
    }

    // Round comparison to minutes to match UI/input precision
    const nowRounded = new Date();
    nowRounded.setSeconds(0, 0);

    if (chosen.getTime() <= nowRounded.getTime() + 5 * 60 * 1000) {
      setError('Please schedule at least 5 minutes into the future.');
      return;
    }


    onSchedule(chosen.toISOString());
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedPreview = value
    ? format(new Date(value), "EEEE, MMMM d, yyyy 'at' h:mm a")
    : '';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Schedule Post</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close schedule picker"
            className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Publish date &amp; time
            </label>
            <input
              type="datetime-local"
              value={value}
              min={minTime}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
              }}
              className={`
                w-full px-3 py-2.5 bg-neutral-800 border rounded-lg text-white text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                [color-scheme:dark]
                ${error ? 'border-red-500' : 'border-neutral-700'}
              `}
            />
            {error && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          {/* Preview */}
          {value && !error && (
            <div className="bg-neutral-800 rounded-lg px-3 py-2.5 space-y-1">
              <p className="text-xs text-neutral-500">Your post will go live on</p>
              <p className="text-sm font-medium text-indigo-300">{formattedPreview}</p>
              <p className="text-xs text-neutral-500">Timezone: {userTimezone}</p>
            </div>
          )}

          <p className="text-xs text-neutral-500 leading-relaxed">
            Your post will be saved as a draft and automatically published at the chosen time.
            You can cancel it any time before it goes live.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!value}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Clock className="w-4 h-4" />
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
