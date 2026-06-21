import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import {
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  ExternalLink,
  Sparkles,
  StickyNote,
  Send,
  X,
} from "lucide-react";
import Card from "../Card";
import Button from "../Button";

export function KanbanColumn({ status, columnJobs, handleDelete, setResearchCompany, noteEditing, setNoteEditing, noteText, setNoteText, updateLoading, handleSaveNote, formatDate }) {
  return (
    <div key={status.value} className="shrink-0 w-80 bg-muted/20 rounded-2xl p-4 flex flex-col snap-start border border-border/40 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold flex items-center gap-2 text-foreground text-sm uppercase tracking-wider">
          <span>{status.icon}</span> {status.label}
        </h3>
        <span className="bg-background px-2.5 py-0.5 rounded-full text-xs font-black border border-border text-muted-foreground">
          {columnJobs.length}
        </span>
      </div>

                      <Droppable droppableId={status.value}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 flex flex-col gap-3 min-h-[150px] transition-colors rounded-xl p-1.5 ${snapshot.isDraggingOver ? 'bg-primary/5 border border-primary/20 border-dashed' : 'border border-transparent'}`}
                          >
                            {columnJobs.map((job, index) => (
                              <Draggable key={job.id} draggableId={job.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <Card className={`p-4 bg-card hover:border-primary/40 transition-all ${snapshot.isDragging ? 'shadow-2xl shadow-primary/20 scale-105 rotate-2 z-50 border-primary ring-2 ring-primary/20' : 'border-border/60 shadow-sm hover:-translate-y-0.5'}`}>
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-foreground text-sm line-clamp-2 leading-tight pr-4">
                                          {job.title}
                                        </h4>
                                        <button
                                          onClick={() => handleDelete(job.id)}
                                          className="text-muted-foreground/50 hover:text-red-500 transition-colors absolute top-4 right-4"
                                          title="Remove Job"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <p className="text-primary font-black text-xs mb-3 tracking-wide">
                                        {job.company}
                                      </p>
                                      
                                      <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-muted-foreground mb-4">
                                        {job.location && (
                                          <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-foreground/40" /> {job.location}
                                          </div>
                                        )}
                                        {job.salary && (
                                          <div className="flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5 text-foreground/40" /> {job.salary}
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                          <Calendar className="w-3.5 h-3.5 text-foreground/40" /> 
                                          Added {formatDate(job.createdAt)}
                                        </div>
                                      </div>

                                      <div className="flex gap-2 mt-auto pt-3 border-t border-border/50">
                                        {job.applyLink && (
                                          <a
                                            href={job.applyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-primary text-background hover:bg-primary/90 py-1.5 rounded-md text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
                                          >
                                            <ExternalLink className="w-3 h-3" /> Apply
                                          </a>
                                        )}
                                        <button
                                          onClick={() =>
                                            setResearchCompany({
                                              name: job.company,
                                              industry: job.industry || "",
                                            })
                                          }
                                          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary py-1.5 rounded-md text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1"
                                        >
                                          <Sparkles className="w-3 h-3" /> AI Research
                                        </button>
                                        {/* Notes toggle button */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (noteEditing === job.id) {
                                              setNoteEditing(null);
                                              setNoteText("");
                                            } else {
                                              setNoteEditing(job.id);
                                              setNoteText("");
                                            }
                                          }}
                                          title={noteEditing === job.id ? "Close notes" : "Add a note"}
                                          className={`relative shrink-0 p-1.5 rounded-md text-[11px] font-bold transition-colors flex items-center justify-center gap-1 ${
                                            noteEditing === job.id
                                              ? "bg-amber-500/20 text-amber-500"
                                              : (job.notes?.length > 0)
                                              ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                                          }`}
                                        >
                                          <StickyNote className="w-3.5 h-3.5" />
                                          {job.notes?.length > 0 && noteEditing !== job.id && (
                                            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
                                              {job.notes.length}
                                            </span>
                                          )}
                                        </button>
                                      </div>

                                      {/* Inline notes panel */}
                                      {noteEditing === job.id && (
                                        <div
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onClick={(e) => e.stopPropagation()}
                                          className="mt-3 pt-3 border-t border-amber-500/20"
                                        >
                                          {/* Previous notes list */}
                                          {job.notes?.length > 0 && (
                                            <div className="mb-2 space-y-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                              {[...job.notes].reverse().map((note, ni) => (
                                                <div
                                                  key={ni}
                                                  className="text-[11px] bg-amber-500/5 border border-amber-500/15 rounded-lg px-2.5 py-1.5"
                                                >
                                                  <p className="text-foreground/80 leading-relaxed">{note.content}</p>
                                                  <p className="text-muted-foreground/50 mt-0.5">
                                                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                                                      month: "short",
                                                      day: "numeric",
                                                    })}
                                                  </p>
                                                </div>
                                              ))}
                                            </div>
                                          )}

                                          {/* New note input */}
                                          <div className="flex gap-1.5">
                                            <textarea
                                              autoFocus
                                              rows={2}
                                              value={noteText}
                                              onChange={(e) => setNoteText(e.target.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                                  e.preventDefault();
                                                  handleSaveNote(job.id, noteText).then(() => {
                                                    setNoteEditing(null);
                                                    setNoteText("");
                                                  });
                                                }
                                                if (e.key === "Escape") {
                                                  setNoteEditing(null);
                                                  setNoteText("");
                                                }
                                              }}
                                              placeholder="Add a note... (⌘↵ to save)"
                                              className="flex-1 text-[11px] bg-background border border-amber-500/30 focus:border-amber-500/60 rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/40 resize-none outline-none transition-colors"
                                            />
                                            <div className="flex flex-col gap-1">
                                              <button
                                                onClick={() => {
                                                  handleSaveNote(job.id, noteText).then(() => {
                                                    setNoteEditing(null);
                                                    setNoteText("");
                                                  });
                                                }}
                                                disabled={!noteText.trim()}
                                                title="Save note (⌘↵)"
                                                className="p-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center justify-center"
                                              >
                                                <Send className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={() => { setNoteEditing(null); setNoteText(""); }}
                                                title="Cancel"
                                                className="p-1.5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors flex items-center justify-center"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
  );
}

export function JobTrackerStats({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card className="p-6 bg-background/50 border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Total</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="text-3xl">??</div>
        </div>
      </Card>
      <Card className="p-6 bg-background/50 border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Saved</p>
            <p className="text-3xl font-bold text-foreground">{stats.saved}</p>
          </div>
          <div className="text-3xl">??</div>
        </div>
      </Card>
      <Card className="p-6 bg-background/50 border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Applied</p>
            <p className="text-3xl font-bold text-foreground">{stats.applied}</p>
          </div>
          <div className="text-3xl">??</div>
        </div>
      </Card>
      <Card className="p-6 bg-background/50 border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Interviewing</p>
            <p className="text-3xl font-bold text-foreground">{stats.interviewing}</p>
          </div>
          <div className="text-3xl">??</div>
        </div>
      </Card>
      <Card className="p-6 bg-background/50 border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Offered</p>
            <p className="text-3xl font-bold text-foreground">{stats.offered}</p>
          </div>
          <div className="text-3xl">??</div>
        </div>
      </Card>
    </div>
  );
}
