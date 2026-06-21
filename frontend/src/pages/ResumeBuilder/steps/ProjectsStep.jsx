import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Trash2, GripVertical } from 'lucide-react'

export default function ProjectsStep({
  projects,
  setProjects,
  addProject,
  removeProject,
  onDragEnd,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Projects</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="projects" type="projects">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {projects.map((proj, index) => (
                <Draggable key={`proj-${index}`} draggableId={`proj-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-background/30 p-5 rounded-xl border border-border relative"
                    >
                      <div {...provided.dragHandleProps} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button
                        onClick={() => removeProject(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">Project Name</label>
                          <input
                            type="text"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                            value={proj.name}
                            onChange={e => { const n = [...projects]; n[index].name = e.target.value; setProjects(n) }}
                            placeholder="E-commerce App"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Technologies Used</label>
                          <input
                            type="text"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                            value={proj.tech}
                            onChange={e => { const n = [...projects]; n[index].tech = e.target.value; setProjects(n) }}
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                          <input
                            type="url"
                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                            value={proj.link}
                            onChange={e => { const n = [...projects]; n[index].link = e.target.value; setProjects(n) }}
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Description (Bullet points)</label>
                          <textarea
                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                            value={proj.description}
                            onChange={e => { const n = [...projects]; n[index].description = e.target.value; setProjects(n) }}
                            placeholder="- Built a full-stack application..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={addProject} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  )
}
