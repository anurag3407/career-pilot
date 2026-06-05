/**
 * MobileUpload.jsx
 *
 * A mobile-optimized resume upload component for Career Pilot.
 * Designed with a professional mobile-first UI matching the design spec.
 *
 * Screens:
 * 1. Default  — tap/drag to select a file
 * 2. Preview  — file selected, shows Upload + Cancel buttons
 * 3. Uploading — progress bar while uploading
 * 4. Success  — upload complete
 *
 * @file frontend/src/components/MobileUpload.jsx
 * @tech React 19, TailwindCSS 4
 */

import { useState, useRef, useCallback } from "react";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * Validates a file before uploading.
 * @param {File} file
 * @returns {string|null} error code or null if valid
 */
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return "invalid_type";
  if (file.size > MAX_SIZE_BYTES) return "too_large";
  return null;
}

/**
 * MobileUpload Component
 * @param {Object}   props
 * @param {Function} [props.onFileSelect] - Called with File or null
 * @param {boolean}  [props.disabled]
 */
export default function MobileUpload({ onFileSelect, disabled = false }) {
  const [file, setFile]                 = useState(null);
  const [error, setError]               = useState(null);
  const [isDragging, setIsDragging]     = useState(false);
  const [isUploading, setIsUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone]     = useState(false);
  const inputRef = useRef(null);

  /** Handle any selected file — validate then show preview */
  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return;
    const err = validateFile(selectedFile);
    if (err) {
      setError(err);
      setFile(null);
      setUploadDone(false);
      onFileSelect?.(null);
      return;
    }
    setError(null);
    setFile(selectedFile);
    setUploadProgress(0);
    setUploadDone(false);
    onFileSelect?.(selectedFile);
  }, [onFileSelect]);

  const handleInputChange = (e) => { handleFile(e.target.files?.[0]); e.target.value = ""; };
  const handleBoxClick    = () => { if (!disabled) inputRef.current?.click(); };
  const handleKeyDown     = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleBoxClick(); } };
  const handleDragOver    = (e) => { e.preventDefault(); if (!disabled) setIsDragging(true); };
  const handleDragLeave   = () => setIsDragging(false);
  const handleDrop        = (e) => { e.preventDefault(); setIsDragging(false); if (!disabled) handleFile(e.dataTransfer.files?.[0]); };

  /** Start the upload (simulated progress) */
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    let cancelled = false;
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 120));
      if (cancelled) return;
      setUploadProgress(i);
    }
    if (!cancelled) { setIsUploading(false); setUploadDone(true); }
    return () => { cancelled = true; };
  };

  /** Reset everything */
  const handleRemove = () => {
    setFile(null); setError(null);
    setUploadProgress(0); setUploadDone(false);
    onFileSelect?.(null);
  };

  const handleUploadAnother = () => { handleRemove(); setTimeout(() => inputRef.current?.click(), 100); };
  const formatSize = (b) => b >= 1024*1024 ? `${(b/(1024*1024)).toFixed(1)} MB` : `${Math.round(b/1024)} KB`;
  const getFileExt = (name) => name?.split(".").pop()?.toUpperCase() || "FILE";

  // ── Screen 4: Success ─────────────────────────────────────────────────────
  if (uploadDone && file) {
    return (
      <div className="w-full max-w-sm mx-auto px-5 py-8 font-sans flex flex-col items-center text-center" data-testid="success-screen">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Uploaded!</h2>
        <p className="text-sm text-gray-500 mb-6">Your resume has been uploaded successfully.</p>
        <div className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-red-600">{getFileExt(file.name)}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <button data-testid="view-resume-button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-2xl mb-3 transition-colors">
          View Resume
        </button>
        <button onClick={handleUploadAnother} data-testid="remove-button" className="w-full border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors">
          Upload Another
        </button>
        <p className="text-xs text-gray-400 mt-6 px-4">We will use your resume to find the best job matches for you.</p>
        <p data-testid="success-message" className="sr-only">Resume uploaded successfully!</p>
      </div>
    );
  }

  // ── Screen 3: Uploading ───────────────────────────────────────────────────
  if (isUploading && file) {
    return (
      <div className="w-full max-w-sm mx-auto px-5 py-8 font-sans flex flex-col items-center text-center" data-testid="uploading-screen">
        <div className="relative w-24 h-24 mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{file.name}</h2>
        <p className="text-sm text-gray-400 mb-6">{formatSize(file.size)}</p>
        <div className="w-full mb-2" data-testid="progress-bar">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }}
              role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100} />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{uploadProgress}%</p>
        </div>
        <p className="text-sm text-gray-500 mb-1">Uploading your resume...</p>
        <p className="text-xs text-gray-400 mb-8">Please don't close this screen.</p>
        <button onClick={handleRemove} data-testid="cancel-button"
          className="w-full border border-gray-300 text-gray-600 font-medium py-3.5 rounded-2xl hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    );
  }

  // ── Screen 2: File Selected (Preview) ─────────────────────────────────────
  if (file) {
    return (
      <div className="w-full max-w-sm mx-auto px-5 py-8 font-sans" data-testid="preview-screen">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Upload Your Resume</h2>
          <p className="text-sm text-gray-500">Ready to upload</p>
        </div>
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-4 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-red-600">{getFileExt(file.name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatSize(file.size)}</p>
          </div>
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <button onClick={handleUpload} data-testid="upload-button"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-2xl mb-3 transition-colors">
          Upload Resume
        </button>
        <button onClick={handleRemove} data-testid="remove-button"
          className="w-full border border-gray-300 text-gray-600 font-medium py-3.5 rounded-2xl hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    );
  }

  // ── Screen 1: Default ─────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-sm mx-auto px-5 py-8 font-sans">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Upload Your Resume</h2>
        <p className="text-sm text-gray-500">Upload your resume to get better job matches</p>
      </div>

      {/* Drop Zone */}
      <div role="button" tabIndex={disabled ? -1 : 0} aria-label="Upload resume file" aria-disabled={disabled}
        onClick={handleBoxClick} onKeyDown={handleKeyDown}
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        data-testid="upload-dropzone"
        className={["flex flex-col items-center justify-center min-h-[160px] rounded-2xl border-2 border-dashed transition-all duration-200 select-none mb-4",
          isDragging ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
            : error ? "border-red-300 bg-red-50"
            : "border-indigo-300 bg-indigo-50 hover:border-indigo-500 hover:bg-indigo-100",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}>
        <input ref={inputRef} type="file" accept=".pdf,.doc,.docx"
          onChange={handleInputChange} disabled={disabled}
          aria-hidden="true" className="sr-only" data-testid="file-input" />
        <div className="flex flex-col items-center px-4 py-6">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="font-semibold text-gray-700 text-sm mb-1">{isDragging ? "Drop it here!" : "Tap to choose a file"}</p>
          <p className="text-xs text-gray-400">or drag and drop</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div role="alert" data-testid="error-message" className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-600">
            {error === "invalid_type"
              ? "Please upload a file in PDF, DOC or DOCX format."
              : "File size exceeds 5MB. Please upload a smaller file."}
          </p>
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-xs text-gray-400">Supported formats: PDF, DOC, DOCX</p>
        <p className="text-xs text-gray-400">Maximum file size: 5MB</p>
      </div>
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs text-gray-500">Your resume is secure and will never be shared.</p>
      </div>
    </div>
  );
}