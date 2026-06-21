import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  validatePersonalStep,
  validateEducationStep,
  validateExperienceStep,
  hasErrors,
} from '../../../utils/resumeValidation'

export const STEP_COUNT = 7

/**
 * Owns all the raw form state for the resume wizard, plus the
 * add/remove/update helpers and step navigation/validation.
 * Score & AI-insight state lives in useResumeInsights instead.
 */
export function useResumeWizard() {
  const navigate = useNavigate()
  const firstErrRef = useRef(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [targetRole, setTargetRole] = useState('')

  const [personal, setPersonal] = useState({
    name: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', summary: '',
  })
  const [phoneCode, setPhoneCode] = useState('+91')
  const [phoneDigits, setPhoneDigits] = useState('')

  const [education, setEducation] = useState([
    { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }
  ])
  const [experience, setExperience] = useState([
    { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
  ])
  const [projects, setProjects] = useState([
    { name: '', tech: '', link: '', description: '' }
  ])
  const [skills, setSkills] = useState('')
  const [sectionOrder, setSectionOrder] = useState(['education', 'experience', 'projects', 'skills'])
  const [customSections, setCustomSections] = useState([])

  const [personalErrors, setPersonalErrors] = useState({})
  const [educationErrors, setEducationErrors] = useState([])
  const [experienceErrors, setExperienceErrors] = useState([])

  function updateEdu(index, key, value) {
    setEducation(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: value }
      return next
    })
    setEducationErrors(prev => {
      const next = [...prev]
      if (next[index]) { next[index] = { ...next[index], [key]: '' } }
      return next
    })
  }

  function updateExp(index, key, value) {
    setExperience(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: value }
      return next
    })
    setExperienceErrors(prev => {
      const next = [...prev]
      if (next[index]) { next[index] = { ...next[index], [key]: '' } }
      return next
    })
  }

  function updatePersonal(key, value) {
    setPersonal(prev => ({ ...prev, [key]: value }))
    if (personalErrors[key]) {
      setPersonalErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const addEducation = () => setEducation(p => [...p, { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }])
  const removeEducation = i => { setEducation(p => p.filter((_, idx) => idx !== i)); setEducationErrors(p => p.filter((_, idx) => idx !== i)) }

  const addExperience = () => setExperience(p => [...p, { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }])
  const removeExperience = i => { setExperience(p => p.filter((_, idx) => idx !== i)); setExperienceErrors(p => p.filter((_, idx) => idx !== i)) }

  const addProject = () => setProjects(p => [...p, { name: '', tech: '', link: '', description: '' }])
  const removeProject = i => setProjects(p => p.filter((_, idx) => idx !== i))

  const addCustomSection = () => setCustomSections(p => [...p, { title: '', content: '' }])
  const removeCustomSection = i => setCustomSections(p => p.filter((_, idx) => idx !== i))
  const updateCustomSection = (i, key, value) => setCustomSections(prev => {
    const next = [...prev]
    next[i] = { ...next[i], [key]: value }
    return next
  })

  function validateCurrentStep() {
    switch (currentStep) {
      case 0: {
        const errs = validatePersonalStep(personal, targetRole, phoneDigits)
        setPersonalErrors(errs)
        return !hasErrors(errs)
      }
      case 1: {
        const errs = validateEducationStep(education)
        setEducationErrors(errs)
        return !hasErrors(errs)
      }
      case 2: {
        const errs = validateExperienceStep(experience)
        setExperienceErrors(errs)
        return !hasErrors(errs)
      }
      default:
        return true
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) {
      setTimeout(() => {
        const el = document.querySelector('[aria-invalid="true"], .border-red-500')
        el?.focus()
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }
    setCurrentStep(s => Math.min(s + 1, STEP_COUNT - 1))
  }

  const handlePrev = () => setCurrentStep(s => Math.max(s - 1, 0))

  return {
    navigate, firstErrRef,
    currentStep, setCurrentStep,
    isSubmitting, setIsSubmitting,
    targetRole, setTargetRole,
    personal, setPersonal, updatePersonal,
    phoneCode, setPhoneCode, phoneDigits, setPhoneDigits,
    education, setEducation, updateEdu, addEducation, removeEducation,
    experience, setExperience, updateExp, addExperience, removeExperience,
    projects, setProjects, addProject, removeProject,
    skills, setSkills,
    sectionOrder, setSectionOrder,
    customSections, setCustomSections, addCustomSection, removeCustomSection, updateCustomSection,
    personalErrors, setPersonalErrors,
    educationErrors, setEducationErrors,
    experienceErrors, setExperienceErrors,
    validateCurrentStep, handleNext, handlePrev,
  }
}
