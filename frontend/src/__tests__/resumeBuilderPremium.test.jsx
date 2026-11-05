import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ResumeBuilder from '../pages/ResumeBuilder'

describe('ResumeBuilder — Super-Premium Features', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('renders top toolbar with view mode switcher, ATS score badge, and import CTA', () => {
    render(
      <MemoryRouter initialEntries={['/resume-builder/build']}>
        <ResumeBuilder />
      </MemoryRouter>
    )

    expect(screen.getByText(/Resume Studio/i)).toBeTruthy()
    expect(screen.getByText(/ATS Score:/i)).toBeTruthy()
    expect(screen.getByText(/Split View/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Import/i })).toBeTruthy()
  })

  test('switches view mode when clicking Split View and Form', async () => {
    render(
      <MemoryRouter initialEntries={['/resume-builder/build']}>
        <ResumeBuilder />
      </MemoryRouter>
    )

    const splitBtn = screen.getByRole('button', { name: /Split View/i })
    fireEvent.click(splitBtn)

    // In Split View, the preview toolbar with PDF and .docx download should be mounted
    await waitFor(() => {
      expect(screen.getByTitle(/Download ATS-Friendly PDF/i)).toBeTruthy()
    })

    const formBtn = screen.getByRole('button', { name: /^Form$/i })
    fireEvent.click(formBtn)
    expect(screen.getByText(/Personal Information/i)).toBeTruthy()
  })

  test('restores draft from localStorage when present', () => {
    const savedDraft = {
      personal: { name: 'Ada Lovelace', email: 'ada@analytical.org', summary: 'Computing pioneer.' },
      targetRole: 'Algorithm Architect',
      education: [{ school: 'University of London', degree: 'Mathematics' }],
      savedAt: '10:45 AM',
    }
    localStorage.setItem('careerpilot_resume_builder_draft', JSON.stringify(savedDraft))

    render(
      <MemoryRouter initialEntries={['/resume-builder/build']}>
        <ResumeBuilder />
      </MemoryRouter>
    )

    expect(screen.getByText(/Restored your saved draft from 10:45 AM/i)).toBeTruthy()
    const nameInput = screen.getByLabelText(/Full Name/i)
    expect(nameInput.value).toBe('Ada Lovelace')
  })

  test('navigates to Certifications and Custom Sections steps', async () => {
    render(
      <MemoryRouter initialEntries={['/resume-builder/build']}>
        <ResumeBuilder />
      </MemoryRouter>
    )

    const certStepBtn = screen.getByRole('button', { name: /Certifications/i })
    fireEvent.click(certStepBtn)
    await waitFor(() => {
      expect(screen.getByText(/Certifications & Licenses/i)).toBeTruthy()
    })

    const customStepBtn = screen.getByRole('button', { name: /Custom Sections/i })
    fireEvent.click(customStepBtn)
    await waitFor(() => {
      expect(screen.getByText(/Add Custom Section/i)).toBeTruthy()
    })
  })
})
