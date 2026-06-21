/**
 * Builds the onDragEnd handler for @hello-pangea/dnd used across the
 * sections/education/experience/projects drag lists.
 *
 * Pass in the pieces of wizard state it needs to mutate.
 */
export function createOnDragEnd({
  sectionOrder, setSectionOrder,
  education, setEducation, educationErrors, setEducationErrors,
  experience, setExperience, experienceErrors, setExperienceErrors,
  projects, setProjects,
}) {
  return function onDragEnd(result) {
    if (!result.destination) return
    const { source, destination, type } = result

    if (type === 'sections') {
      const newOrder = Array.from(sectionOrder)
      const [removed] = newOrder.splice(source.index, 1)
      newOrder.splice(destination.index, 0, removed)
      setSectionOrder(newOrder)
      return
    }

    if (type === 'education') {
      const newEdu = Array.from(education)
      const [removed] = newEdu.splice(source.index, 1)
      newEdu.splice(destination.index, 0, removed)
      setEducation(newEdu)
      const newErrors = Array.from(educationErrors)
      const [removedErr] = newErrors.splice(source.index, 1)
      newErrors.splice(destination.index, 0, removedErr)
      setEducationErrors(newErrors)
      return
    }

    if (type === 'experience') {
      const newExp = Array.from(experience)
      const [removed] = newExp.splice(source.index, 1)
      newExp.splice(destination.index, 0, removed)
      setExperience(newExp)
      const newErrors = Array.from(experienceErrors)
      const [removedErr] = newErrors.splice(source.index, 1)
      newErrors.splice(destination.index, 0, removedErr)
      setExperienceErrors(newErrors)
      return
    }

    if (type === 'projects') {
      const newProj = Array.from(projects)
      const [removed] = newProj.splice(source.index, 1)
      newProj.splice(destination.index, 0, removed)
      setProjects(newProj)
      return
    }
  }
}
