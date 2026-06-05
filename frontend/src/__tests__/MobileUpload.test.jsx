/**
 * MobileUpload.test.jsx
 * @file frontend/src/__tests__/MobileUpload.test.jsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileUpload from '../components/MobileUpload';

function makeFile(name, type, sizeMB = 1) {
  const bytes = new Uint8Array(sizeMB * 1024 * 1024);
  return new File([bytes], name, { type });
}

const PDF_FILE  = makeFile('John_Doe_Resume.pdf', 'application/pdf', 1);
const DOCX_FILE = makeFile('resume.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1);
const BIG_FILE  = makeFile('huge.pdf', 'application/pdf', 10);
const BAD_FILE  = makeFile('photo.png', 'image/png', 1);

// ═══════════════════════════════════════════════════
// Rendering — default screen
// ═══════════════════════════════════════════════════
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

  it('shows security note', () => {
    render(<MobileUpload />);
    expect(screen.getByText(/secure and will never be shared/i)).toBeInTheDocument();
  });

  it('shows supported formats info', () => {
    render(<MobileUpload />);
    expect(screen.getByText(/PDF, DOC, DOCX/i)).toBeInTheDocument();
  });

  it('does not show upload or remove buttons on default screen', () => {
    render(<MobileUpload />);
    expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('remove-button')).not.toBeInTheDocument();
  });

});

// ═══════════════════════════════════════════════════
// Valid File Selection → Preview Screen
// ═══════════════════════════════════════════════════
describe('MobileUpload — valid file selection', () => {

  it('accepts a PDF and shows preview screen with filename', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    expect(screen.getByTestId('preview-screen')).toBeInTheDocument();
    expect(screen.getByText('John_Doe_Resume.pdf')).toBeInTheDocument();
  });

  it('accepts a DOCX file and shows its name', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), DOCX_FILE);
    expect(screen.getByText('resume.docx')).toBeInTheDocument();
  });

  it('shows Upload Resume and Cancel buttons after file selection', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    expect(screen.getByTestId('remove-button')).toBeInTheDocument();
  });

  it('calls onFileSelect with the File object for a valid file', async () => {
    const onFileSelect = vi.fn();
    render(<MobileUpload onFileSelect={onFileSelect} />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    expect(onFileSelect).toHaveBeenCalledWith(PDF_FILE);
  });

});

// ═══════════════════════════════════════════════════
// Invalid File Rejection
// ═══════════════════════════════════════════════════
describe('MobileUpload — invalid file rejection', () => {

  it('shows an error when file exceeds 5MB', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), BIG_FILE);
    expect(screen.getByTestId('error-message')).toHaveTextContent(/5MB/i);
  });

  it('shows an error for a disallowed file type', async () => {
    render(<MobileUpload />);
    const dropzone = screen.getByTestId('upload-dropzone');
    fireEvent.drop(dropzone, { dataTransfer: { files: [BAD_FILE] } });
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(/PDF, DOC or DOCX/i);
    });
  });

  it('calls onFileSelect(null) when validation rejects a file', async () => {
    const onFileSelect = vi.fn();
    render(<MobileUpload onFileSelect={onFileSelect} />);
    const dropzone = screen.getByTestId('upload-dropzone');
    fireEvent.drop(dropzone, { dataTransfer: { files: [BAD_FILE] } });
    await waitFor(() => {
      expect(onFileSelect).toHaveBeenCalledWith(null);
    });
  });

  it('does not show upload button after invalid file', async () => {
    render(<MobileUpload />);
    const dropzone = screen.getByTestId('upload-dropzone');
    fireEvent.drop(dropzone, { dataTransfer: { files: [BAD_FILE] } });
    await waitFor(() => {
      expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument();
    });
  });

  it('error is announced via role="alert"', async () => {
    render(<MobileUpload />);
    const dropzone = screen.getByTestId('upload-dropzone');
    fireEvent.drop(dropzone, { dataTransfer: { files: [BAD_FILE] } });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

});

// ═══════════════════════════════════════════════════
// Uploading Screen
// ═══════════════════════════════════════════════════
describe('MobileUpload — uploading screen', () => {

  it('shows uploading screen with progress bar after clicking Upload', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    fireEvent.click(screen.getByTestId('upload-button'));
    await waitFor(() => {
      expect(screen.getByTestId('uploading-screen')).toBeInTheDocument();
      expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });
  });

  it('shows cancel button during upload', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    fireEvent.click(screen.getByTestId('upload-button'));
    await waitFor(() => {
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });
  });

});

// ═══════════════════════════════════════════════════
// Cancel / Remove
// ═══════════════════════════════════════════════════
describe('MobileUpload — cancel and remove', () => {

  it('goes back to default state when Cancel is clicked on preview screen', async () => {
    render(<MobileUpload />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    fireEvent.click(screen.getByTestId('remove-button'));
    await waitFor(() => {
      expect(screen.getByText('Tap to choose a file')).toBeInTheDocument();
    });
  });

  it('calls onFileSelect(null) when Cancel is clicked', async () => {
    const onFileSelect = vi.fn();
    render(<MobileUpload onFileSelect={onFileSelect} />);
    await userEvent.upload(screen.getByTestId('file-input'), PDF_FILE);
    fireEvent.click(screen.getByTestId('remove-button'));
    expect(onFileSelect).toHaveBeenLastCalledWith(null);
  });

});

// ═══════════════════════════════════════════════════
// Drag and Drop
// ═══════════════════════════════════════════════════
describe('MobileUpload — drag and drop', () => {

  it('accepts a valid file dropped onto the box', async () => {
    render(<MobileUpload />);
    const dropzone = screen.getByTestId('upload-dropzone');
    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [PDF_FILE] } });
    await waitFor(() => {
      expect(screen.getByText('John_Doe_Resume.pdf')).toBeInTheDocument();
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

// ═══════════════════════════════════════════════════
// Disabled State
// ═══════════════════════════════════════════════════
describe('MobileUpload — disabled state', () => {

  it('marks the dropzone as aria-disabled', () => {
    render(<MobileUpload disabled />);
    expect(screen.getByTestId('upload-dropzone')).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables the hidden file input', () => {
    render(<MobileUpload disabled />);
    expect(screen.getByTestId('file-input')).toBeDisabled();
  });

});

// ═══════════════════════════════════════════════════
// Accessibility
// ═══════════════════════════════════════════════════
describe('MobileUpload — accessibility', () => {

  it('drop zone has role=button and aria-label', () => {
    render(<MobileUpload />);
    expect(screen.getByRole('button', { name: /upload resume file/i })).toBeInTheDocument();
  });

});