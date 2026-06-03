/**
 * MobileUpload.test.jsx
 *
 * Unit tests for the MobileUpload component.
 * Uses Vitest + React Testing Library (already in the project).
 *
 * @file frontend/src/components/__tests__/MobileUpload.test.jsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileUpload from '../components/MobileUpload';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Creates a fake File object for testing.
 * @param {string} name   - e.g. 'resume.pdf'
 * @param {string} type   - MIME type e.g. 'application/pdf'
 * @param {number} sizeMB - File size in MB
 * @returns {File}
 */
function makeFile(name, type, sizeMB = 1) {
  const bytes = new Uint8Array(sizeMB * 1024 * 1024);
  return new File([bytes], name, { type });
}

const PDF_FILE  = makeFile('resume.pdf', 'application/pdf', 1);
const DOCX_FILE = makeFile('resume.docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1);
const BIG_FILE  = makeFile('huge.pdf', 'application/pdf', 10);  // 10MB — over limit
const BAD_FILE  = makeFile('photo.png', 'image/png', 1);         // wrong type

// ═══════════════════════════════════════════════════════════════════════════
// Rendering
// ═══════════════════════════════════════════════════════════════════════════
describe('MobileUpload — rendering', () => {

  it('renders the upload box and title', () => {
    render(<MobileUpload />);
    expect(screen.getByText('Upload Your Resume')).toBeInTheDocument();
    expect(screen.getByTestId('upload-dropzone')).toBeInTheDocument();
  });

  it('shows tap-to-choose text when no file is selected', () => {
    render(<MobileUpload />);
    expect(screen.getByText('Tap to choose a file')).toBeInTheDocument();
  });

  it('does not show Upload or Remove buttons before a file is chosen', () => {
    render(<MobileUpload />);
    expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('remove-button')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Valid File Selection
// ═══════════════════════════════════════════════════════════════════════════
describe('MobileUpload — valid file selection', () => {

  it('accepts a PDF and shows its filename', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByTestId('upload-button')).toBeInTheDocument();
  });

  it('accepts a DOCX file', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), DOCX_FILE);
    expect(screen.getByText('resume.docx')).toBeInTheDocument();
  });

  it('calls onFileSelect with the File object for a valid file', async () => {
    const onFileSelect = vi.fn();
    render(<MobileUpload onFileSelect={onFileSelect} />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    expect(onFileSelect).toHaveBeenCalledWith(PDF_FILE);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Invalid File Rejection
// ═══════════════════════════════════════════════════════════════════════════
describe('MobileUpload — invalid file rejection', () => {

  it('shows an error when file exceeds 5MB', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), BIG_FILE);
    expect(screen.getByTestId('error-message')).toHaveTextContent('too large');
  });

  it('shows an error for a disallowed file type', async () => {
  render(<MobileUpload />);
  const dropzone = screen.getByTestId('upload-dropzone');

  // Use drop instead of upload to bypass the accept attribute filter
  fireEvent.drop(dropzone, { dataTransfer: { files: [BAD_FILE] } });

  await waitFor(() => {
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Only PDF and Word documents'
    );
  });
});
  it('does NOT call onFileSelect for an invalid file', async () => {
    const onFileSelect = vi.fn();
    render(<MobileUpload onFileSelect={onFileSelect} />);
    await userEvent.upload(screen.getByTestId('file-input'), BAD_FILE);
    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('does not show the Upload button after an invalid file', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), BAD_FILE);
    expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Remove File
// ═══════════════════════════════════════════════════════════════════════════
describe('MobileUpload — remove file', () => {

  it('resets to initial state when Remove is clicked', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('remove-button'));

    expect(screen.queryByText('resume.pdf')).not.toBeInTheDocument();
    expect(screen.getByText('Tap to choose a file')).toBeInTheDocument();
  });

  it('calls onFileSelect(null) when file is removed', async () => {
    const onFileSelect = vi.fn();
    render(<MobileUpload onFileSelect={onFileSelect} />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    fireEvent.click(screen.getByTestId('remove-button'));
    expect(onFileSelect).toHaveBeenLastCalledWith(null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Drag and Drop
// ═══════════════════════════════════════════════════════════════════════════
describe('MobileUpload — drag and drop', () => {

  it('accepts a valid file dropped onto the box', async () => {
    render(<MobileUpload />);
    const dropzone = screen.getByTestId('upload-dropzone');

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [PDF_FILE] } });

    await waitFor(() => {
      expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });
  });

  it('shows an error when an invalid file is dropped', async () => {
    render(<MobileUpload />);
    const dropzone = screen.getByTestId('upload-dropzone');

    fireEvent.drop(dropzone, { dataTransfer: { files: [BAD_FILE] } });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Disabled State
// ═══════════════════════════════════════════════════════════════════════════
describe('MobileUpload — disabled state', () => {

  it('marks the dropzone as aria-disabled', () => {
    render(<MobileUpload disabled />);
    expect(screen.getByTestId('upload-dropzone'))
      .toHaveAttribute('aria-disabled', 'true');
  });

  it('disables the hidden file input', () => {
    render(<MobileUpload disabled />);
    expect(screen.getByTestId('file-input')).toBeDisabled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Accessibility
// ═══════════════════════════════════════════════════════════════════════════
describe('MobileUpload — accessibility', () => {

  it('drop zone has role=button and a descriptive aria-label', () => {
    render(<MobileUpload />);
    expect(
      screen.getByRole('button', { name: /upload resume file/i })
    ).toBeInTheDocument();
  });

  it('error is announced via role="alert" for screen readers', async () => {
  render(<MobileUpload />);
  const dropzone = screen.getByTestId('upload-dropzone');

  fireEvent.drop(dropzone, { dataTransfer: { files: [BAD_FILE] } });

  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
});