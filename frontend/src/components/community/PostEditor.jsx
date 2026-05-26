import { useState } from 'react';
import { X, Image as ImageIcon, Link, Hash, Send, Clock } from 'lucide-react';
import { format } from 'date-fns';
import SchedulePost from './SchedulePost';

const CATEGORIES = [
  { value: 'discussion', label: '💬 Discussion' },
  { value: 'experience', label: '💼 Experience' },
  { value: 'interview', label: '🎤 Interview' },
  { value: 'tips', label: '💡 Tips & Tricks' },
  { value: 'question', label: '❓ Question' },
  { value: 'success-story', label: '🎉 Success Story' },
  { value: 'resource', label: '📚 Resource' },
];

export default function PostEditor({ onClose, onSubmit, editPost = null }) {
  const [title, setTitle] = useState(editPost?.title || '');
  const [content, setContent] = useState(editPost?.content || '');
  const [category, setCategory] = useState(editPost?.category || 'discussion');
  const [tags, setTags] = useState(editPost?.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(null);
  const [showPoll, setShowPoll] = useState(false);

const [pollQuestion, setPollQuestion] = useState('');

const [pollOptions, setPollOptions] = useState([
  '',
  ''
]);

  const buildPostData = () => {
 const buildPostData = () => {
  const normalizedOptions = pollOptions
    .map(option => option.trim())
    .filter(Boolean);

  const trimmedQuestion = pollQuestion.trim();

  const isValidPoll =
    trimmedQuestion.length > 0 &&
    normalizedOptions.length >= 2;

  return {
    title: title.trim(),
    content: content.trim(),
    category,
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),

    ...(showPoll && isValidPoll && {
      poll: {
        question: trimmedQuestion,
        options: normalizedOptions
      }
    }),

    ...(scheduledAt && { scheduledAt })
  };
};

  return {
    title: title.trim(),
    content: content.trim(),
    category,
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),

    ...(showPoll && {
      poll: {
        question: pollQuestion.trim(),
        options: validOptions
      }
    }),

    ...(scheduledAt && { scheduledAt })
  };
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError('');
    try {
      await onSubmit(buildPostData());
    } catch (err) {
      console.error('Failed to submit post:', err);
      setError(err.message || 'Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleConfirm = (isoString) => {
    setScheduledAt(isoString);
    setShowScheduler(false);
  };

  const clearSchedule = () => setScheduledAt(null);
const addPollOption = () => {
  if (pollOptions.length < 6) {
    setPollOptions([...pollOptions, '']);
  }
};

const updatePollOption = (index, value) => {
  const updated = [...pollOptions];
  updated[index] = value;
  setPollOptions(updated);
};

const removePollOption = (index) => {
  if (pollOptions.length > 2) {
    const updated = pollOptions.filter((_, i) => i !== index);
    setPollOptions(updated);
  }
};
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                required
                maxLength={200}
              />
              <p className="mt-1 text-xs text-muted-foreground text-right">
                {title.length}/200
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      category === cat.value
                        ? 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-1 ring-offset-background'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, experience, or ask a question... (Markdown supported)"
                rows={8}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                required
                maxLength={10000}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  Supports Markdown formatting
                </p>
                <p className="text-xs text-muted-foreground">
                  {content.length}/10000
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                <Hash className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags separated by commas (e.g., react, frontend, tips)"
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Tags help others find your post
              </p>
            </div>

            {/* Preview of tags */}
            {showPoll && (
  <div className="space-y-4 border border-border rounded-xl p-4 bg-muted/30">

    <div>
      <label className="block text-sm font-medium mb-2">
        Poll Question
      </label>

      <input
        type="text"
        value={pollQuestion}
        onChange={(e) => setPollQuestion(e.target.value)}
        placeholder="Ask your poll question..."
        className="w-full px-4 py-2 rounded-lg bg-muted border border-border"
      />
    </div>

    <div className="space-y-2">
      {pollOptions.map((option, index) => (
        <div key={index} className="flex gap-2">

          <input
            type="text"
            value={option}
            onChange={(e) =>
              updatePollOption(index, e.target.value)
            }
            placeholder={`Option ${index + 1}`}
            className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border"
          />

          {pollOptions.length > 2 && (
            <button
  type="button"
  onClick={() => removePollOption(index)}
  aria-label={`Remove poll option ${index + 1}`}
  className="px-3 py-2 bg-red-500 text-white rounded-lg"
>
  X
</button>
          )}
        </div>
      ))}
    </div>

    {pollOptions.length < 6 && (
      <button
        type="button"
        onClick={addPollOption}
        className="px-4 py-2 bg-primary text-white rounded-lg"
      >
        Add Option
      </button>
    )}
  </div>
)}
            {tags && (
              <div className="flex flex-wrap gap-1.5">
                {tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="px-6 pb-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Scheduled time indicator */}
          {scheduledAt && (
            <div className="mx-6 mb-3 flex items-center justify-between px-3 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-indigo-300">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  Scheduled for{' '}
                  <span className="font-medium">
                    {format(new Date(scheduledAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={clearSchedule}
                className="text-xs text-neutral-500 hover:text-white ml-3"
              >
                Remove
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between">
            <div className="flex gap-2">
  <button
    type="button"
    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
    title="Add image"
  >
    <ImageIcon className="w-5 h-5" />
  </button>

  <button
    type="button"
    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
    title="Add link"
  >
    <Link className="w-5 h-5" />
  </button>

  <button
    type="button"
    onClick={() => setShowPoll(!showPoll)}
    aria-label={showPoll ? 'Remove poll' : 'Add poll'}
    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
    title="Add Poll"
  >
    📊
  </button>
</div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted text-sm"
              >
                Cancel
              </button>
              {!editPost && (
                <button
                  type="button"
                  onClick={() => setShowScheduler(true)}
                  disabled={loading || !title.trim() || !content.trim()}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${scheduledAt
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 hover:bg-indigo-500/30'
                      : 'border-neutral-600 text-neutral-300 hover:bg-neutral-800'
                    }
                  `}
                >
                  <Clock className="w-4 h-4" />
                  {scheduledAt ? 'Change time' : 'Schedule'}
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !title.trim() || !content.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    {scheduledAt ? 'Scheduling...' : 'Publishing...'}
                  </>
                ) : (
                  <>
                    {scheduledAt ? <Clock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {editPost ? 'Update Post' : scheduledAt ? 'Confirm Schedule' : 'Publish Post'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showScheduler && (
        <SchedulePost
          onClose={() => setShowScheduler(false)}
          onSchedule={handleScheduleConfirm}
        />
      )}
    </div>
  );
}
