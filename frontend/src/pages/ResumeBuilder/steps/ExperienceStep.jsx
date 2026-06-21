import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import AchievementEnhancer from '../../../components/resume/AchievementEnhancer'
import { FieldError, inputClsArr } from '../utils/uiHelpers'

export default function ExperienceStep({
  experience,
  experienceErrors,
  updateExp,
  addExperience,
  removeExperience,
  onDragEnd,
  targetRole,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Experience</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="experience" type="experience">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {experience.map((exp, index) => {
                const errs = experienceErrors[index] || {}
                const ic = inputClsArr(errs)
                return (
                  <Draggable key={`exp-${index}`} draggableId={`exp-${index}`} index={index}>
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
                          onClick={() => removeExperience(index)}
                          className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label="Remove experience entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={ic('title')}
                              value={exp.title}
                              onChange={e => updateExp(index, 'title', e.target.value)}
                              placeholder="Software Engineer"
                              aria-invalid={!!errs.title}
                            />
                            <FieldError msg={errs.title} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Company <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={ic('company')}
                              value={exp.company}
                              onChange={e => updateExp(index, 'company', e.target.value)}
                              placeholder="Tech Corp"
                              aria-invalid={!!errs.company}
                            />
                            <FieldError msg={errs.company} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                              type="text"
                              className={ic('location')}
                              value={exp.location}
                              onChange={e => updateExp(index, 'location', e.target.value)}
                              placeholder="San Francisco, CA"
                            />
                          </div>
                          <div className="flex items-start gap-4 md:col-span-2">
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">
                                Start Date <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="month"
                                className={ic('startDate')}
                                value={exp.startDate}
                                onChange={e => updateExp(index, 'startDate', e.target.value)}
                                aria-invalid={!!errs.startDate}
                              />
                              <FieldError msg={errs.startDate} />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">End Date</label>
                              <input
                                type="month"
                                disabled={exp.current}
                                className={cn(ic('endDate'), 'disabled:opacity-50 disabled:cursor-not-allowed')}
                                value={exp.current ? '' : exp.endDate}
                                onChange={e => updateExp(index, 'endDate', e.target.value)}
                                aria-invalid={!!errs.endDate}
                              />
                              <FieldError msg={errs.endDate} />
                            </div>
                          </div>
                          <div className="md:col-span-2 flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`current-${index}`}
                              checked={exp.current}
                              onChange={e => {
                                updateExp(index, 'current', e.target.checked)
                                if (e.target.checked) updateExp(index, 'endDate', '')
                              }}
                              className="rounded border-border accent-primary"
                            />
                            <label htmlFor={`current-${index}`} className="text-sm">I currently work here</label>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                              Description (Bullet points)
                            </label>
                            <textarea
                              className="w-full bg-muted border border-border rounded-lg px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                              value={exp.description}
                              onChange={e => updateExp(index, 'description', e.target.value)}
                              placeholder={`- Developed feature X resulting in Y% improvement\n- Led a team of...`}
                            />
                            <AchievementEnhancer
                              value={exp.description}
                              jobRole={targetRole}
                              onApply={(text) =>
                                updateExp(index, "description", text)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={addExperience} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  )
}
