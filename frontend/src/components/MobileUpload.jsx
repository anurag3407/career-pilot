/**
 * MobileUpload.jsx
 *
 * A mobile-optimized resume upload component for Career Pilot.
 * Supports tap-to-upload, drag & drop, file type validation,
 * size limits, and clear error feedback — all in a touch-friendly UI.
 *
 * @file frontend/src/components/MobileUpload.jsx
 * @tech React 19, TailwindCSS 4
 */

import { useState, useRef, useCallback } from "react";

// Allowed file types and max size (5MB)
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * Validates a file before uploading.
 * Checks file type and size.
 *
 * @param {File} file - The file selected by the user
 * @returns {string|null} Error message string, or null if file is valid
 */
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only PDF and Word documents (.pdf, .doc, .docx) are allowed.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
  }
  return null;
}

/**
 * MobileUpload Component
 *
 * A touch-friendly file upload box. Users can:
 * - Tap the box to open the file picker
 * - Drag and drop a file onto the box
 * - See a preview of the selected file name and size
 * - See clear error messages for invalid files
 * - Remove a selected file and start over
 *
 * @param {Object}   props
 * @param {Function} props.onFileSelect - Called with the valid File object when a file is chosen
 * @param {boolean}  [props.disabled]  - Disables the upload box when true
 * @returns {JSX.Element}
 */
export default function MobileUpload({ onFileSelect, disabled = false }) {
  /** @type {[File|null, Function]} Currently selected file */
  const [file, setFile] = useState(null);

  /** @type {[string|null, Function]} Validation error message */
  const [error, setError] = useState(null);

  /** @type {[boolean, Function]} Whether user is dragging a file over the box */
  const [isDragging, setIsDragging] = useState(false);

  /** @type {[boolean, Function]} Whether upload is in progress */
  const [isUploading, setIsUploading] = useState(false);

  /** @type {[number, Function]} Upload progress percentage (0-100) */
  const [uploadProgress, setUploadProgress] = useState(0);

  /** Ref to the hidden file input element */
  const inputRef = useRef(null);

  /**
   * Handles a file being chosen (from picker or drag-and-drop).
   * Validates the file, updates state, and calls onFileSelect if valid.
   *
   * @param {File} selectedFile - The file the user picked
   */
  const handleFile = useCallback(
    (selectedFile) => {
      if (!selectedFile) return;

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        setFile(null);
        onFileSelect?.(null); // Fix 3: notify parent of invalid file
        return;
      }

      setError(null);
      setFile(selectedFile);
      setUploadProgress(0); // Fix 4: reset progress for new file
      onFileSelect?.(selectedFile);
    },
    [onFileSelect],
  );

  /**
   * Fired when user picks a file from the OS file picker.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);
    // Reset input so same file can be re-selected if removed
    e.target.value = "";
  };

  /** Opens the file picker when the upload box is tapped/clicked. */
  const handleBoxClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  /**
   * Handles keyboard activation (Enter or Space) for accessibility.
   * @param {React.KeyboardEvent} e
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBoxClick();
    }
  };

  // ── Drag & Drop handlers ──────────────────────────────────────────────────

  /** Highlights the drop zone when user drags a file over it. */
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  /** Removes the highlight when the drag leaves the box. */
  const handleDragLeave = () => setIsDragging(false);

  /**
   * Handles a file being dropped onto the upload box.
   * @param {React.DragEvent} e
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFile(e.dataTransfer.files?.[0]);
  };

  /**
   * Simulates an upload with a progress bar.
   * In a real app, replace this with your actual API call.
   */
  const handleUpload = async () => {
  if (!file) return;
  setIsUploading(true);
  setUploadProgress(0);

  // Fix 5: track if component is still mounted before setting state
  let cancelled = false;

  for (let i = 0; i <= 100; i += 10) {
    await new Promise((r) => setTimeout(r, 80));
    if (cancelled) return;
    setUploadProgress(i);
  }

  if (!cancelled) setIsUploading(false);

  return () => { cancelled = true; };
};

  /** Removes the selected file and resets the component. */
  const handleRemove = () => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
    onFileSelect?.(null);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Formats a byte count into a human-readable string.
   * @param {number} bytes
   * @returns {string} e.g. "2.3 MB" or "450 KB"
   */
  const formatSize = (bytes) =>
    bytes >= 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 font-sans">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Upload Your Resume
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        PDF or Word document · Max {MAX_SIZE_MB}MB
      </p>

      {/* Drop Zone / Upload Box */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload resume file"
        aria-disabled={disabled}
        onClick={handleBoxClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="upload-dropzone"
        className={[
          "relative flex flex-col items-center justify-center",
          "min-h-[160px] rounded-2xl border-2 border-dashed",
          "transition-all duration-200 select-none",
          "active:scale-[0.98]",
          isDragging
            ? "border-blue-500 bg-blue-50 scale-[1.01]"
            : file
              ? "border-green-400 bg-green-50"
              : error
                ? "border-red-400 bg-red-50"
                : "border-gray-300 bg-gray-50",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-blue-400 hover:bg-blue-50",
        ].join(" ")}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleInputChange}
          disabled={disabled}
          aria-hidden="true"
          className="sr-only"
          data-testid="file-input"
        />

        {/* Icon */}
        <div className="text-4xl mb-2" aria-hidden="true">
          {file ? "✅" : isDragging ? "📂" : error ? "❌" : "📄"}
        </div>

        {/* Text */}
        {file ? (
          <div className="text-center px-4">
            <p className="font-medium text-green-700 text-sm truncate max-w-[240px]">
              {file.name}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {formatSize(file.size)}
            </p>
          </div>
        ) : (
          <div className="text-center px-4">
            <p className="font-medium text-gray-700 text-sm">
              {isDragging ? "Drop it here!" : "Tap to choose a file"}
            </p>
            <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          role="alert"
          data-testid="error-message"
          className="mt-3 text-sm text-red-600 flex items-start gap-1"
        >
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="mt-4" data-testid="progress-bar">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Uploading…</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Action Buttons — shown only when a file is selected */}
      {file && !isUploading && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleUpload}
            data-testid="upload-button"
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white text-sm font-medium py-3 rounded-xl
                       transition-colors duration-150 focus:outline-none
                       focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Upload Resume
          </button>
          <button
            onClick={handleRemove}
            data-testid="remove-button"
            className="px-4 py-3 rounded-xl border border-gray-300 text-gray-600
                       text-sm hover:bg-gray-100 active:bg-gray-200
                       transition-colors duration-150 focus:outline-none
                       focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            aria-label="Remove selected file"
          >
            Remove
          </button>
        </div>
      )}

      {/* Success state after upload */}
      {!isUploading && uploadProgress === 100 && (
        <p
          data-testid="success-message"
          className="mt-3 text-sm text-green-600 font-medium text-center"
        >
          ✅ Resume uploaded successfully!
        </p>
      )}
    </div>
  );
}
