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
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex gap-2 mb-2">
                    <button
                        className={`text-sm px-3 py-1 rounded ${!showPreview ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setShowPreview(false)}
                    >
                        Write
                    </button>
                    <button
                        className={`text-sm px-3 py-1 rounded ${showPreview ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setShowPreview(true)}
                    >
                        Preview
                    </button>
                </div>

                {!showPreview ? (
                    <textarea
                        className="w-full border border-gray-200 rounded p-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-black"
                        rows={5}
                        placeholder="Add a note… Markdown supported"
                        value={content}
                        
                        onChange={(e) => setContent(e.target.value)}
                    />
                ) : (
                    <div className="min-h-[220px] p-3 border border-gray-200 rounded text-sm prose prose-sm max-w-none bg-white text-black overflow-auto">
                        {content.trim()
                            ? <ReactMarkdown>{content}</ReactMarkdown>
                            : <span className="text-gray-400">Nothing to preview yet…</span>
                        }
                    </div>
                )}

                <button
                    className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                >
                    Save Note
                </button>
            </div>

            {/* Notes history */}
            {notes.length > 0 ? (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-600">Note History</h4>
                    {[...notes].reverse().map((note) => (
                        <div
                            key={note._id || note.createdAt}
                            className="border border-gray-200 rounded-lg p-3 bg-white"
                        >
                            <div className="text-sm prose prose-sm max-w-none">
                                <ReactMarkdown>{note.content}</ReactMarkdown>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(note.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                    No notes yet. Add your first note above!
                </p>
            )}
        </div>
    );
}
