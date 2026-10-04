import { useState } from 'react';
import axios from 'axios';

const PRIORITIES = ['low', 'medium', 'high'];
const INTERVIEW_STAGES = ['phone', 'technical', 'hr', 'final', 'offer'];

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export default function JobTrackerEnhancements({ job, token, onUpdate }) {
  const [reminderDate, setReminderDate] = useState(job.reminderDate?.slice(0, 10) || '');
  const [reminderNote, setReminderNote] = useState(job.reminderNote || '');
  const [timelineNote, setTimelineNote] = useState('');
  const [saving, setSaving] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const setPriority = async (priority) => {
    setSaving('priority');
    const { data } = await axios.patch(`/api/job-tracker-enhancements/${job._id}/priority`, { priority }, { headers });
    onUpdate(data);
    setSaving('');
  };

  const setInterviewStage = async (interviewStage) => {
    setSaving('stage');
    const { data } = await axios.patch(`/api/job-tracker-enhancements/${job._id}/interview-stage`, { interviewStage }, { headers });
    onUpdate(data);
    setSaving('');
  };

  const saveReminder = async () => {
    setSaving('reminder');
    const { data } = await axios.post(`/api/job-tracker-enhancements/${job._id}/reminder`, { reminderDate, reminderNote }, { headers });
    onUpdate(data);
    setSaving('');
  };

  const addTimeline = async () => {
    if (!timelineNote) return;
    setSaving('timeline');
    const { data } = await axios.post(`/api/job-tracker-enhancements/${job._id}/timeline`, { status: job.status, note: timelineNote }, { headers });
    onUpdate(data);
    setTimelineNote('');
    setSaving('');
  };

  return (
    <div className="mt-4 border-t pt-4 space-y-4 text-sm">

      {/* Priority */}
      <div>
        <p className="font-medium mb-1">Priority</p>
        <div className="flex gap-2">
          {PRIORITIES.map(p => (
            <button key={p} onClick={() => setPriority(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition
                ${job.priority === p ? PRIORITY_COLORS[p] + ' border-transparent' : 'border-gray-300 text-gray-500'}`}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Interview Stage (only if status is Interviewing) */}
      {job.status === 'Interviewing' && (
        <div>
          <p className="font-medium mb-1">Interview Stage</p>
          <div className="flex flex-wrap gap-2">
            {INTERVIEW_STAGES.map(s => (
              <button key={s} onClick={() => setInterviewStage(s)}
                className={`px-3 py-1 rounded-full text-xs border transition
                  ${job.interviewStage === s ? 'bg-blue-100 text-blue-700 border-transparent' : 'border-gray-300 text-gray-500'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up Reminder */}
      <div>
        <p className="font-medium mb-1">Follow-up Reminder</p>
        <input type="date" className="border rounded p-1 text-sm mr-2"
          value={reminderDate} onChange={e => setReminderDate(e.target.value)} />
        <input type="text" placeholder="Note (optional)" className="border rounded p-1 text-sm w-40 mr-2"
          value={reminderNote} onChange={e => setReminderNote(e.target.value)} />
        <button onClick={saveReminder} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
          {saving === 'reminder' ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Timeline */}
      <div>
        <p className="font-medium mb-1">Add Timeline Note</p>
        <div className="flex gap-2">
          <input type="text" placeholder="What happened?" className="border rounded p-1 text-sm flex-1"
            value={timelineNote} onChange={e => setTimelineNote(e.target.value)} />
          <button onClick={addTimeline} className="bg-gray-700 text-white px-3 py-1 rounded text-xs">
            {saving === 'timeline' ? '...' : 'Add'}
          </button>
        </div>
        {job.timeline?.length > 0 && (
          <ul className="mt-2 space-y-1">
            {[...job.timeline].reverse().map((t, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-600">
                <span className="text-gray-400">{new Date(t.date).toLocaleDateString()}</span>
                <span className="bg-gray-100 px-1 rounded">{t.status}</span>
                <span>{t.note}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
