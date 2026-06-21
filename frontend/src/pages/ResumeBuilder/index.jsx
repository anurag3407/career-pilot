import { lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Save, FileText, User, Briefcase, GraduationCap, Code, Star, Layers, LayoutTemplate } from 'lucide-react'
import { resumeApi } from '../../services/api'
import { toast } from 'react-hot-toast'
import ConsistencyPanel from '../../utils/ConsistencyPanel'

import { useResumeWizard } from './hooks/useResumeWizard'
import { useResumeInsights } from './hooks/useResumeInsights'
import { useResumeAutosave } from './hooks/useResumeAutosave'
import { createOnDragEnd } from './utils/sectionReorder'
import { generateMarkdown } from './utils/generateMarkdown'
import { makeInputCls } from './utils/uiHelpers'
import { buildTemplateData } from './utils/buildTemplateData'
import WizardStepper from './components/WizardStepper'
import DraftBanner from './components/DraftBanner'

const PersonalStep = lazy(() => import('./steps/PersonalStep'))
const EducationStep = lazy(() => import('./steps/EducationStep'))
const ExperienceStep = lazy(() => import('./steps/ExperienceStep'))
const ProjectsStep = lazy(() => import('./steps/ProjectsStep'))
const SkillsStep = lazy(() => import('./steps/SkillsStep'))
const CustomSectionsStep = lazy(() => import('./steps/CustomSectionsStep'))
const ReviewStep = lazy(() => import('./steps/ReviewStep'))

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User, Component: PersonalStep },
  { id: 'education', title: 'Education', icon: GraduationCap, Component: EducationStep },
  { id: 'experience', title: 'Experience', icon: Briefcase, Component: ExperienceStep },
  { id: 'projects', title: 'Projects', icon: Code, Component: ProjectsStep },
  { id: 'skills', title: 'Skills', icon: Star, Component: SkillsStep },
  { id: 'custom', title: 'Custom Sections', icon: Layers, Component: CustomSectionsStep },
  { id: 'preview', title: 'Preview', icon: FileText, Component: ReviewStep },
]

export default function ResumeBuilder() {
  const wizard = useResumeWizard()
  const insights = useResumeInsights({
    personal: wizard.personal, targetRole: wizard.targetRole, education: wizard.education,
    experience: wizard.experience, projects: wizard.projects, skills: wizard.skills,
  })
  const {
    navigate, currentStep, isSubmitting, setIsSubmitting,
    targetRole, setTargetRole, personal, setPersonal, updatePersonal,
    phoneCode, setPhoneCode, phoneDigits, setPhoneDigits,
    education, setEducation, updateEdu, addEducation, removeEducation,
    experience, setExperience, updateExp, addExperience, removeExperience,
    projects, setProjects, addProject, removeProject,
    skills, setSkills, sectionOrder, setSectionOrder,
    customSections, setCustomSections, addCustomSection, removeCustomSection, updateCustomSection,
    personalErrors, setPersonalErrors, educationErrors, setEducationErrors, experienceErrors, setExperienceErrors,
    handleNext, handlePrev,
  } = wizard
  const autosave = useResumeAutosave({
    targetRole, personal, phoneCode, phoneDigits, education, experience, projects, skills, sectionOrder, customSections,
  })
  const handleRestoreDraft = () => autosave.restoreDraft((draft) => {
    if (draft.targetRole !== undefined) setTargetRole(draft.targetRole)
    if (draft.personal) setPersonal(draft.personal)
    if (draft.phoneCode) setPhoneCode(draft.phoneCode)
    if (draft.phoneDigits !== undefined) setPhoneDigits(draft.phoneDigits)
    if (draft.education) setEducation(draft.education)
    if (draft.experience) setExperience(draft.experience)
    if (draft.projects) setProjects(draft.projects)
    if (draft.skills !== undefined) setSkills(draft.skills)
    if (draft.sectionOrder) setSectionOrder(draft.sectionOrder)
    if (draft.customSections) setCustomSections(draft.customSections)
    toast.success('Draft restored from your last session')
  })
  const onDragEnd = createOnDragEnd({
    sectionOrder, setSectionOrder, education, setEducation, educationErrors, setEducationErrors,
    experience, setExperience, experienceErrors, setExperienceErrors, projects, setProjects,
  })
  const buildMarkdown = () => generateMarkdown({
    personal, phoneCode, phoneDigits, education, experience, projects, skills, sectionOrder, customSections,
  })
  const saveVersion = () => {
    insights.setResumeVersions(prev => [
      { id: Date.now(), timestamp: new Date().toLocaleString(), content: buildMarkdown() },
      ...prev,
    ])
    toast.success("Resume version layout tracked successfully!")
  }
  const handleGenerate = async () => {
    try {
      setIsSubmitting(true)
      const response = await resumeApi.create({
        originalText: buildMarkdown(),
        jobRole: targetRole || 'Software Engineer',
        title: `${personal.name || 'My'} Resume - ${new Date().toLocaleDateString()}`,
        sectionOrder,
      })
      toast.success('Resume created successfully!')
      autosave.clearDraft()
      navigate(`/enhance/${response.data.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to create resume')
    } finally {
      setIsSubmitting(false)
    }
  }
  const stepProps = {
    personal, updatePersonal, personalErrors, setPersonalErrors,
    targetRole, setTargetRole, phoneCode, setPhoneCode, phoneDigits, setPhoneDigits,
    inputCls: makeInputCls(personalErrors),
    education, educationErrors, updateEdu, addEducation, removeEducation,
    experience, experienceErrors, updateExp, addExperience, removeExperience,
    setProjects, addProject, removeProject,
    skills, setSkills,
    customSections, addCustomSection, removeCustomSection, updateCustomSection,
    projects, onDragEnd,
    sectionOrder, saveVersion, generateMarkdown: buildMarkdown,
    ...insights,
  }
  const ActiveStep = STEPS[currentStep].Component
  const isLastStep = currentStep === STEPS.length - 1
  return (
    <div className="min-h-screen pt-20 pb-12 bg-background flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Resume Builder</h1>
          <p className="text-muted-foreground mt-2">Build a professional resume from scratch.</p>
        </div>

        {autosave.restoreAvailable && (
          <DraftBanner onRestore={handleRestoreDraft} onDismiss={autosave.dismissDraft} />
        )}

        <WizardStepper steps={STEPS} currentStep={currentStep} />

        <div className="flex-1 bg-card backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} className="relative z-10"
            >
              <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading…</div>}>
                <ActiveStep {...stepProps} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {!isLastStep && <ConsistencyPanel errors={insights.activeConsistencyWarnings} />}
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={handlePrev} disabled={currentStep === 0}
            className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {isLastStep ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/resume-templates', {
                  state: { builderData: buildTemplateData({ personal, experience, education, projects, skills }) }
                })}
                className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all flex items-center gap-2 font-medium border border-border"
              >
                <LayoutTemplate className="w-4 h-4" /> Choose Resume Template
              </button>
              <button
                onClick={handleGenerate} disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Generate &amp; Enhance
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 font-medium"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
