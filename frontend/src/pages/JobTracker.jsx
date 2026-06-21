import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Plus, Briefcase } from "lucide-react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import CompanyResearch from "../components/CompanyResearch";
import { useJobBoard } from "../hooks/useJobBoard";
import { KanbanColumn, JobTrackerStats } from "../components/jobs/JobTrackerComponents";

const JobTracker = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [researchCompany, setResearchCompany] = useState(null);

  const {
    jobs,
    loading,
    onDragEnd,
    deleteJob,
    updateJobNote,
    noteEditing,
    setNoteEditing,
    noteText,
    setNoteText,
    updateLoading,
    stats,
    formatDate,
    statusOptions
  } = useJobBoard();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your job applications
          </p>
        </div>

        <JobTrackerStats stats={stats} />

        <div className="flex flex-col gap-6">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
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
                <span className="flex items-center gap-1">
                  {status.icon} {status.label}
                </span>
              </button>
            ))}
          </div>

          {/* Kanban Board */}
          {jobs.length === 0 ? (
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
                  const columnJobs = jobs.filter((j) => j.status === status.value);

                  return (
                    <KanbanColumn
                      key={status.value}
                      status={status}
                      columnJobs={columnJobs}
                      handleDelete={deleteJob}
                      setResearchCompany={setResearchCompany}
                      noteEditing={noteEditing}
                      setNoteEditing={setNoteEditing}
                      noteText={noteText}
                      setNoteText={setNoteText}
                      updateLoading={updateLoading}
                      handleSaveNote={updateJobNote}
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
