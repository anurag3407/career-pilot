/**
 * Reusable validation helpers for ResumeBuilder.
 * Each function returns an error string, or '' if the value is valid.
 */

/** Full Name: at least 2 words, each ≥ 2 chars, no digits. */
export function validateFullName(name) {
  const trimmed = (name || '').trim()
  if (!trimmed) return 'Full name is required.'
  if (/\d/.test(trimmed)) return 'Name must not contain numbers.'
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length < 2) return 'Please enter at least a first and last name.'
  if (parts.some(p => p.length < 2)) return 'Each part of your name must be at least 2 characters.'
  return ''
}

/** Target Job Role: ≥ 2 chars, not numbers-only, not special-chars-only. */
export function validateJobRole(role) {
  const trimmed = (role || '').trim()
  if (!trimmed) return 'Target job role is required.'
  if (trimmed.length < 2) return 'Job role must be at least 2 characters.'
  if (/^\d+$/.test(trimmed)) return 'Job role cannot be numbers only.'
  if (/^[^a-zA-Z0-9]+$/.test(trimmed)) return 'Job role cannot be special characters only.'
  return ''
}

/** Email: standard format with @ and valid domain. */
export function validateEmail(email) {
  const trimmed = (email || '').trim()
  if (!trimmed) return 'Email address is required.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!emailRegex.test(trimmed)) return 'Please enter a valid email address (e.g. john@example.com).'
  return ''
}

/**
 * Phone: digits only, 7–12 digits.
 * Pass in the raw digit string (non-digits already stripped by PhoneInput).
 */
export function validatePhone(digits) {
  const stripped = (digits || '').replace(/\D/g, '')
  if (!stripped) return 'Phone number is required.'
  if (stripped.length < 7) return 'Phone number must be at least 7 digits.'
  if (stripped.length > 12) return 'Phone number must be at most 12 digits.'
  return ''
}

/** LinkedIn: must start with https://linkedin.com/in/ */
export function validateLinkedIn(url) {
  const trimmed = (url || '').trim()
  if (!trimmed) return '' // optional field
  if (!trimmed.startsWith('https://www.linkedin.com/in/')) {
    return 'LinkedIn URL must start with https://www.linkedin.com/in/'
  }
  const profile = trimmed.replace('https://www.linkedin.com/in/', '')
  if (!profile || profile.length < 2) return 'Please include a valid LinkedIn profile path.'
  return ''
}

/** GitHub: must start with https://github.com/ */
export function validateGitHub(url) {
  const trimmed = (url || '').trim()
  if (!trimmed) return '' // optional field
  if (!trimmed.startsWith('https://github.com/')) {
    return 'GitHub URL must start with https://github.com/'
  }
  const profile = trimmed.replace('https://github.com/', '')
  if (!profile || profile.length < 1) return 'Please include a valid GitHub username.'
  return ''
}

/**
 * Date range: both must be filled; start <= end.
 * Accepts YYYY-MM strings (from type="month" inputs).
 * Returns an object { startError, endError }.
 */
export function validateDateRange(startDate, endDate, isCurrent = false) {
  const result = { startError: '', endError: '' }
  if (!startDate) {
    result.startError = 'Start date is required.'
  }
  if (!isCurrent && !endDate) {
    result.endError = 'End date is required.'
  }
  if (startDate && endDate && !isCurrent) {
    if (startDate > endDate) {
      result.endError = 'End date must be after start date.'
    }
  }
  return result
}

/**
 * Validate entire Personal Info step.
 * Returns an errors object keyed by field name.
 */
export function validatePersonalStep(personal, targetRole, phoneDigits) {
  const errors = {}
  const nameErr = validateFullName(personal.name)
  if (nameErr) errors.name = nameErr
  const roleErr = validateJobRole(targetRole)
  if (roleErr) errors.targetRole = roleErr
  const emailErr = validateEmail(personal.email)
  if (emailErr) errors.email = emailErr
  const phoneErr = validatePhone(phoneDigits)
  if (phoneErr) errors.phone = phoneErr
  const liErr = validateLinkedIn(personal.linkedin)
  if (liErr) errors.linkedin = liErr
  const ghErr = validateGitHub(personal.github)
  if (ghErr) errors.github = ghErr
  return errors
}

/**
 * Validate Education step.
 * Returns an array of error objects, one per entry.
 */
export function validateEducationStep(education) {
  return education.map(edu => {
    const errs = {}
    if (!edu.school?.trim()) errs.school = 'School name is required.'
    if (!edu.degree?.trim()) errs.degree = 'Degree is required.'
    const { startError, endError } = validateDateRange(edu.startDate, edu.endDate, false)
    if (startError) errs.startDate = startError
    if (endError) errs.endDate = endError
    return errs
  })
}

/**
 * Validate Experience step.
 * Returns an array of error objects, one per entry.
 */
export function validateExperienceStep(experience) {
  return experience.map(exp => {
    const errs = {}
    if (!exp.title?.trim()) errs.title = 'Job title is required.'
    if (!exp.company?.trim()) errs.company = 'Company name is required.'
    const { startError, endError } = validateDateRange(exp.startDate, exp.endDate, exp.current)
    if (startError) errs.startDate = startError
    if (endError) errs.endDate = endError
    return errs
  })
}

/** Check whether an errors object (or array of objects) has any errors. */
export function hasErrors(errors) {
  if (Array.isArray(errors)) {
    return errors.some(e => Object.keys(e).length > 0)
  }
  return Object.keys(errors).length > 0
}
