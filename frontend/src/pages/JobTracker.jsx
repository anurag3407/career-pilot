import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  WifiOff,
  StickyNote,
  Send,
  X,
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              All Columns
            </button>
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {status.icon} {status.label}
              </button>
            ))}
          </div>

          {/* Kanban Board */}
          {trackedJobs.length === 0 ? (
            <Card className="p-12 text-center bg-background/50 border-border">
              <div className="max-w-md mx-auto">
                <Briefcase className="w-16 h-16 text-muted-foreground/80 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Tracked Jobs Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start tracking jobs from the job search page
                </p>
                <Button
                  onClick={() => (window.location.href = "/jobs")}
                  className="mx-auto"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Find Jobs
                </Button>
              </div>
            </Card>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 overflow-x-auto pb-8 min-h-[60vh] snap-x scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {statusOptions
                  .filter((status) => filterStatus === "all" || status.value === filterStatus)
                  .map((status) => {
                  const columnJobs = trackedJobs.filter((j) => j.status === status.value);

                  return (
                    <KanbanColumn
                      key={status.value}
                      status={status}
                      columnJobs={columnJobs}
                      handleDelete={handleDelete}
                      setResearchCompany={setResearchCompany}
                      noteEditing={noteEditing}
                      setNoteEditing={setNoteEditing}
                      noteText={noteText}
                      setNoteText={setNoteText}
                      updateLoading={updateLoading}
                      handleSaveNote={handleSaveNote}
                      formatDate={formatDate}
                    />
                  );
                })}
              </div>
            </DragDropContext>
          )}
        </div>
      </div>

      {researchCompany && (
        <CompanyResearch
          companyName={researchCompany.name}
          industry={researchCompany.industry}
          onClose={() => setResearchCompany(null)}
        />
      )}
    </Layout>
  );
};

export default JobTracker;
