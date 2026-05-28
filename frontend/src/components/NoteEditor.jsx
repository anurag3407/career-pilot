import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function NoteEditor({ notes = [], onAddNote }) {
    const [content, setContent] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    function handleSubmit() {
        const trimmed = content.trim();
        if (!trimmed) return;
        onAddNote(trimmed);
        setContent("");
        setShowPreview(false);
    }

    return (
        <div className="space-y-4">
            {/* Editor */}
            <div className="border border-border rounded-lg p-4 bg-card shadow-sm transition-colors duration-300">
                <div className="flex gap-2 mb-2">
                    <button
                        className={`text-sm px-3 py-1 rounded transition-colors ${!showPreview ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setShowPreview(false)}
                    >
                        Write
                    </button>
                    <button
                        className={`text-sm px-3 py-1 rounded transition-colors ${showPreview ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setShowPreview(true)}
                    >
                        Preview
                    </button>
                </div>

                {!showPreview ? (
                    <textarea
                        className="w-full border border-border rounded p-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground transition-colors duration-300 placeholder:text-muted-foreground"
                        rows={5}
                        placeholder="Add a note… Markdown supported"
                        value={content}
                        
                        onChange={(e) => setContent(e.target.value)}
                    />
                ) : (
                    <div className="min-h-[220px] p-3 border border-border rounded text-sm prose prose-sm max-w-none bg-background text-foreground overflow-auto transition-colors duration-300 prose-invert dark:prose-invert">
                        {content.trim()
                            ? <ReactMarkdown>{content}</ReactMarkdown>
                            : <span className="text-muted-foreground">Nothing to preview yet…</span>
                        }
                    </div>
                )}

                <button
                    className="mt-4 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                >
                    Save Note
                </button>
            </div>

            {/* Notes history */}
            {notes.length > 0 ? (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground">Note History</h4>
                    {[...notes].reverse().map((note) => (
                        <div
                            key={note._id || note.createdAt}
                            className="border border-border rounded-lg p-3 bg-card shadow-sm transition-colors duration-300"
                        >
                            <div className="text-sm prose prose-sm max-w-none text-foreground prose-invert dark:prose-invert">
                                <ReactMarkdown>{note.content}</ReactMarkdown>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {new Date(note.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                    No notes yet. Add your first note above!
                </p>
            )}
        </div>
    );
}
