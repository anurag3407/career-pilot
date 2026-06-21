import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { FieldError, inputClsArr } from '../utils/uiHelpers'

export default function EducationStep({
  education,
  educationErrors,
  updateEdu,
  addEducation,
  removeEducation,
  onDragEnd,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Education</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="education" type="education">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {education.map((edu, index) => {
                const errs = educationErrors[index] || {}
                const ic = inputClsArr(errs)
                return (
                  <Draggable key={`edu-${index}`} draggableId={`edu-${index}`} index={index}>
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
                          onClick={() => removeEducation(index)}
                          className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                          aria-label="Remove education entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              School <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={ic('school')}
                              value={edu.school}
                              onChange={e => updateEdu(index, 'school', e.target.value)}
                              placeholder="University Name"
                              aria-invalid={!!errs.school}
                            />
                            <FieldError msg={errs.school} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Degree <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              className={ic('degree')}
                              value={edu.degree}
                              onChange={e => updateEdu(index, 'degree', e.target.value)}
                              placeholder="B.S., M.S., etc."
                              aria-invalid={!!errs.degree}
                            />
                            <FieldError msg={errs.degree} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Field of Study</label>
                            <input
                              type="text"
                              className={ic('field')}
                              value={edu.field}
                              onChange={e => updateEdu(index, 'field', e.target.value)}
                              placeholder="Computer Science"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
                            <input
                              type="text"
                              className={ic('gpa')}
                              value={edu.gpa}
                              onChange={e => updateEdu(index, 'gpa', e.target.value)}
                              placeholder="3.8/4.0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="month"
                              className={ic('startDate')}
                              value={edu.startDate}
                              onChange={e => updateEdu(index, 'startDate', e.target.value)}
                              aria-invalid={!!errs.startDate}
                            />
                            <FieldError msg={errs.startDate} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="month"
                              className={ic('endDate')}
                              value={edu.endDate}
                              onChange={e => updateEdu(index, 'endDate', e.target.value)}
                              aria-invalid={!!errs.endDate}
                            />
                            <FieldError msg={errs.endDate} />
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
      <button onClick={addEducation} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  )
}
