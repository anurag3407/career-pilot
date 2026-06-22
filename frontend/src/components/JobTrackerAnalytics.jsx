import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUS_COLORS = {
  Saved: 'bg-gray-200 text-gray-700',
  Applied: 'bg-blue-100 text-blue-700',
  Interviewing: 'bg-yellow-100 text-yellow-700',
  Offered: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function JobTrackerAnalytics({ token }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axios.get('/api/job-tracker-enhancements/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setAnalytics(r.data)).catch(() => {});
  }, [token]);

  if (!analytics) return null;

  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <h2 className="font-bold text-lg mb-4">Application Analytics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{analytics.total}</p>
          <p className="text-xs text-gray-500">Total Applications</p>
        </div>
        {Object.entries(analytics.statusCounts).map(([status, count]) => (
          <div key={status} className={`rounded-lg p-3 text-center ${STATUS_COLORS[status] || 'bg-gray-100'}`}>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs">{status}</p>
          </div>
        ))}
      </div>

      {analytics.upcomingReminders.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2">Upcoming Follow-ups</h3>
          <ul className="space-y-1">
            {analytics.upcomingReminders.map(r => (
              <li key={r.id} className="flex gap-3 text-sm text-gray-700 bg-yellow-50 rounded p-2">
                <span className="font-medium">{r.company}</span>
                <span className="text-gray-500">{r.role}</span>
                <span className="ml-auto text-xs text-yellow-700">{new Date(r.reminderDate).toLocaleDateString()}</span>
                {r.reminderNote && <span className="text-xs text-gray-500">{r.reminderNote}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
