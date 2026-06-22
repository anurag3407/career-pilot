import { useEffect, useMemo, useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { ResumeConsistencyChecker } from '../../../utils/resumeChecker'
import { analyzeResumeTone } from '../../../utils/toneAnalyzer'

/**
 * All the derived/"AI insight" state that used to live as a wall of
 * useEffects directly inside ResumeBuilder: readability, achievement
 * score, tone, ATS match %, consistency warnings, profile score,
 * recommended sections/skills/certifications, career goal progress,
 * and version history.
 *
 * Takes the wizard's core form state as input, returns everything
 * the ReviewStep (and a couple of other steps) need to render.
 */
export function useResumeInsights({ personal, targetRole, education, experience, projects, skills }) {
  const [readabilityScore, setReadabilityScore] = useState(0)
  const [claritySuggestions, setClaritySuggestions] = useState([])
  const [achievementScore, setAchievementScore] = useState(0)
  const [achievementSuggestions, setAchievementSuggestions] = useState([])
  const [toneScore, setToneScore] = useState(100)
  const [toneSuggestions, setToneSuggestions] = useState([])
  const [sectionSuggestions, setSectionSuggestions] = useState([])

  const [resumeScore, setResumeScore] = useState(0)
  const [recommendedSections, setRecommendedSections] = useState([])
  const [atsScore, setAtsScore] = useState(0)
  const [missingKeywords, setMissingKeywords] = useState([])
  const [resumeVersions, setResumeVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)

  const [recommendedSkills, setRecommendedSkills] = useState([])
  const [profileScore, setProfileScore] = useState(0)
  const [recommendedCertifications, setRecommendedCertifications] = useState([])
  const [profileIssues, setProfileIssues] = useState([])
  const [impactScores, setImpactScores] = useState({
    experience: 0,
    projects: 0,
    skills: 0,
    education: 0,
    achievements: 0
  })
  const [careerGoals, setCareerGoals] = useState([
    { title: "Complete Resume", completed: false },
    { title: "Add Projects", completed: false },
    { title: "Improve ATS Score", completed: false }
  ])
  const [goalProgress, setGoalProgress] = useState(0)

  // ── Normalized skills (handles skills as either a comma string or an array) ─
  // Moved above every effect that depends on it — several effects below
  // previously called .trim()/.toLowerCase() directly on the raw `skills`
  // prop, which crashes if `skills` is ever an array instead of a string.
  const normalizedSkills = useMemo(() => {
    if (typeof skills === "string") {
      return skills.split(",").map(skill => skill.trim()).filter(Boolean)
    }
    if (Array.isArray(skills)) {
      return skills.map(skill => String(skill).trim()).filter(Boolean)
    }
    return []
  }, [skills])

  // ── Achievement impact score ──────────────────────────────────────────────
  useEffect(() => {
    const suggestions = []
    let score = 100

    const descriptions = experience.map(exp => exp.description).join(" ")

    if (!/\d+%|\d+\+|\$\d+/g.test(descriptions)) {
      score -= 25
      suggestions.push("Add measurable metrics such as percentages, revenue, or growth numbers.")
    }

    if (!/(led|developed|implemented|created|optimized|improved)/i.test(descriptions)) {
      score -= 20
      suggestions.push("Use stronger action verbs to describe achievements.")
    }

    if (descriptions.length < 100) {
      score -= 15
      suggestions.push("Provide more detailed achievement descriptions.")
    }

    if (!/(resulted|increased|reduced|improved|achieved)/i.test(descriptions)) {
      score -= 20
      suggestions.push("Highlight outcomes and business impact.")
    }

    setAchievementScore(Math.max(score, 0))
    setAchievementSuggestions(suggestions)
  }, [experience])

  // ── Readability score ─────────────────────────────────────────────────────
  useEffect(() => {
    const content = [
      personal.summary,
      ...experience.map(e => e.description),
      ...projects.map(p => p.description)
    ].join(' ')

    let score = 100
    const suggestions = []

    if (content.length < 100) {
      score -= 20
      suggestions.push("Add more descriptive content.")
    }

    if (content.includes("was") || content.includes("were")) {
      score -= 10
      suggestions.push("Reduce passive voice usage.")
    }

    if (!content.match(/developed|built|created|led|implemented/i)) {
      score -= 15
      suggestions.push("Use stronger action verbs.")
    }

    setReadabilityScore(Math.max(score, 0))
    setClaritySuggestions(suggestions)
  }, [personal, experience, projects])

  // ── Tone analysis ─────────────────────────────────────────────────────────
  useEffect(() => {
    const content = [
      personal.summary,
      ...experience.map(e => e.description),
      ...projects.map(p => p.description)
    ].join(" ").toLowerCase()

    let score = 100
    const suggestions = []

    const weakPhrases = {
      "helped": "contributed to",
      "worked on": "developed",
      "stuff": "tasks",
      "things": "responsibilities",
      "awesome": "exceptional",
      "cool": "innovative"
    }

    Object.entries(weakPhrases).forEach(([weak, professional]) => {
      if (content.includes(weak)) {
        score -= 10
        suggestions.push(`Replace "${weak}" with "${professional}"`)
      }
    })

    if (!content.match(/developed|implemented|created|led|optimized|improved/i)) {
      score -= 15
      suggestions.push("Use stronger professional action verbs.")
    }

    setToneScore(Math.max(score, 0))
    setToneSuggestions(suggestions)
  }, [personal, experience, projects])

  // ── Per-section impact scores ─────────────────────────────────────────────
  useEffect(() => {
    setImpactScores({
      experience: experience.some(e => e.description && e.description.length > 50) ? 90 : 40,
      projects: projects.some(p => p.description && p.description.length > 50) ? 80 : 30,
      skills: normalizedSkills.join(' ').trim().length > 20 ? 75 : 25,
      education: education.some(e => e.school) ? 70 : 20,
      achievements: achievementScore
    })
  }, [experience, projects, normalizedSkills, education, achievementScore])

  // ── Career goal progress ──────────────────────────────────────────────────
  useEffect(() => {
    const updatedGoals = [
      { title: "Complete Resume", completed: resumeScore >= 100 },
      { title: "Add Projects", completed: projects.some(p => p.name.trim()) },
      { title: "Improve ATS Score", completed: atsScore >= 80 }
    ]

    setCareerGoals(updatedGoals)

    const completed = updatedGoals.filter(g => g.completed).length
    setGoalProgress(Math.round((completed / updatedGoals.length) * 100))
  }, [resumeScore, projects, atsScore])

  // ── Profile (LinkedIn/GitHub/Portfolio) score ─────────────────────────────
  useEffect(() => {
    let score = 100
    const issues = []

    if (!personal.linkedin) { score -= 30; issues.push("LinkedIn profile missing") }
    if (!personal.github) { score -= 30; issues.push("GitHub profile missing") }
    if (!personal.portfolio) { score -= 20; issues.push("Portfolio website missing") }
    if (personal.linkedin && !personal.linkedin.includes("linkedin.com")) { score -= 10; issues.push("Invalid LinkedIn URL") }
    if (personal.github && !personal.github.includes("github.com")) { score -= 10; issues.push("Invalid GitHub URL") }

    setProfileScore(Math.max(score, 0))
    setProfileIssues(issues)
  }, [personal])

  // ── Certification recommendations ─────────────────────────────────────────
  useEffect(() => {
    const certs = []
    const role = (targetRole || '').toLowerCase()
    const skillText = normalizedSkills.join(' ').toLowerCase()

    if (role.includes("frontend") || skillText.includes("react") || skillText.includes("javascript")) {
      certs.push("Meta Front-End Developer Professional Certificate")
    }
    if (role.includes("backend") || skillText.includes("node") || skillText.includes("express")) {
      certs.push("IBM Back-End Development Professional Certificate")
    }
    if (role.includes("full stack")) {
      certs.push("IBM Full Stack Software Developer Professional Certificate")
    }
    if (role.includes("data scientist") || role.includes("data analyst") || skillText.includes("python")) {
      certs.push("Google Data Analytics Professional Certificate")
      certs.push("IBM Data Science Professional Certificate")
    }
    if (role.includes("cloud") || skillText.includes("aws")) {
      certs.push("AWS Certified Cloud Practitioner")
    }
    if (role.includes("devops") || skillText.includes("docker")) {
      certs.push("Docker Certified Associate")
      certs.push("AWS DevOps Engineer")
    }
    if (role.includes("security") || role.includes("cyber")) {
      certs.push("CompTIA Security+")
    }

    setRecommendedCertifications([...new Set(certs)])
  }, [targetRole, normalizedSkills])

  // ── Consolidated ATS assessment ───────────────────────────────────────────
  useEffect(() => {
    const resumeText = `${personal?.summary || ''} ${normalizedSkills.join(' ')} ${
      projects?.map(p => `${p.name} ${p.description}`).join(' ') || ''
    } ${experience?.map(e => `${e.title} ${e.description}`).join(' ') || ''}`.toLowerCase()

    const baseKeywords = ["react", "node.js", "javascript", "typescript", "python", "docker", "aws", "git", "ci/cd", "rest api"]
    const prioritySkills = ["docker", "kubernetes", "ci/cd", "aws", "linux"]

    const found = baseKeywords.filter(keyword => resumeText.includes(keyword))
    const missing = baseKeywords.filter(keyword => !resumeText.includes(keyword))

    setMissingKeywords(missing)

    const recommendations = [
      ...prioritySkills.filter(sk => !found.includes(sk)),
      ...missing
    ].slice(0, 4)
    setRecommendedSkills(recommendations)

    const score = baseKeywords.length > 0 ? Math.round((found.length / baseKeywords.length) * 100) : 0
    setAtsScore(score)
  }, [personal, normalizedSkills, projects, experience])

  // ── Consistency checker (dates / tense / duplicates) ──────────────────────
  const activeConsistencyWarnings = useMemo(() => {
    const allExperienceDates = (experience || []).flatMap(exp => [exp.startDate, exp.endDate])
    const allEducationDates = (education || []).flatMap(edu => [edu.startDate, edu.endDate])
    const aggregatedTimelineDates = [...allExperienceDates, ...allEducationDates]

    const pastExperienceBullets = (experience || [])
      .filter(exp => !exp.current)
      .map(exp => exp.description || '')

    const projectDescriptions = (projects || []).map(p => p.description || '')
    const aggregatedTextDescriptions = [...pastExperienceBullets, ...projectDescriptions]

    const dateValidationErrors = ResumeConsistencyChecker.checkDateConsistency(aggregatedTimelineDates)
    const tenseValidationErrors = ResumeConsistencyChecker.checkTenseConsistency(pastExperienceBullets)
    const redundancyValidationErrors = ResumeConsistencyChecker.checkDuplicateContent(aggregatedTextDescriptions)

    return [...dateValidationErrors, ...tenseValidationErrors, ...redundancyValidationErrors]
  }, [experience, education, projects])

  const restoreVersion = useCallback((version) => {
    setSelectedVersion(version)
    if (typeof toast !== 'undefined') {
      toast.success(`Restored version from ${version.timestamp}`)
    }
  }, [])

  // ── Recommended sections to add ───────────────────────────────────────────
  useEffect(() => {
    const recommendations = []

    if (projects.every(p => !p.name.trim())) recommendations.push("Projects")
    if (normalizedSkills.length === 0) recommendations.push("Skills")
    if (education.every(e => !e.school?.trim())) recommendations.push("Certifications")
    if (experience.every(e => !e.title?.trim())) recommendations.push("Volunteer Experience")

    setRecommendedSections(recommendations)
  }, [projects, normalizedSkills, education, experience])

  // ── Overall completion score ──────────────────────────────────────────────
  useEffect(() => {
    let score = 0
    if (personal.name && personal.email) score += 20
    if (education.some(e => e.school.trim())) score += 20
    if (experience.some(e => e.title.trim())) score += 20
    if (projects.some(p => p.name.trim())) score += 20
    if (normalizedSkills.length > 0) score += 20
    setResumeScore(score)
  }, [personal, education, experience, projects, normalizedSkills])

  return {
    readabilityScore, claritySuggestions,
    achievementScore, achievementSuggestions,
    toneScore, toneSuggestions,
    sectionSuggestions,
    resumeScore, recommendedSections,
    atsScore, missingKeywords,
    resumeVersions, setResumeVersions, selectedVersion, restoreVersion,
    recommendedSkills,
    profileScore, recommendedCertifications, profileIssues,
    impactScores,
    careerGoals, goalProgress,
    activeConsistencyWarnings,
  }
}
