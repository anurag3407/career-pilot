import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

function getRejectionMessage(code) {
  switch (code) {
    case 'too-many-files':
      return 'Please upload only one file at a time.';
    case 'file-too-large':
      return 'File exceeds 10MB limit. Please upload a smaller file.';
    case 'file-invalid-type':
      return 'Unsupported format. Please upload a .pdf or .txt file.';
    default:
      return 'File rejected. Please upload a valid .pdf or .txt file under 10MB.';
  }
}

export default function ResumeUploader({
  file,
  onFileSelect,
  onClear,
  onAnalyze,
  onError,
  loading,
  extracting,
  error,
  acceptedTypes,
}) {
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        const code = fileRejections[0].errors[0]?.code;
        onError?.(getRejectionMessage(code));
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, onError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: loading || extracting,
  });

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer
            transition-all duration-300
            ${isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50 bg-card hover:bg-muted/50'}
            ${loading || extracting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragActive ? 'bg-primary/20' : 'bg-muted'
              }`}
            >
              {isDragActive ? (
                <FileText className="w-8 h-8 text-primary" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            {isDragActive ? (
              <p className="text-lg font-medium text-primary">Drop your resume here…</p>
            ) : (
              <>
                <p className="text-lg font-medium text-foreground mb-1">
                  Drag & drop your resume
                </p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">PDF or TXT • Max 10MB</span>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
              {extracting && (
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Extracting text…
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onClear}
              disabled={loading || extracting}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading || extracting || !file}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
    </div>
  );
}
