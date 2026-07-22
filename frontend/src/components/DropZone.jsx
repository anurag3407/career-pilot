import { useCallback, useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DropZone({
  onFileSelect,
  disabled = false,
  maxSizeMB = 5,
  multiple = false,
}) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  const [previews, setPreviews] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const intervalsRef = useRef([])

  const simulateProgress = (fileName) => {
    let progress = 0
    setUploadProgress((prev) => ({ ...prev, [fileName]: 0 }))
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      setUploadProgress((prev) => ({ ...prev, [fileName]: progress }))
    }, 150)
    intervalsRef.current.push(interval)
  }

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        rejectedFiles.forEach((file) => {
          if (file.errors?.[0]?.code === 'file-too-large') {
            const sizeMB = (file.file.size / (1024 * 1024)).toFixed(2)
            toast.error(`"${file.file.name}" (${sizeMB}MB) exceeds ${maxSizeMB}MB limit`)
          } else if (file.errors?.[0]?.code === 'file-invalid-type') {
            toast.error(`"${file.file.name}" is not a PDF file`)
          } else {
            toast.error(`"${file.file.name}" could not be added`)
          }
        })
        return
      }

      if (acceptedFiles.length === 0) return

      const newPreviews = acceptedFiles.map((file) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        file,
      }))

      setPreviews((prev) => (multiple ? [...prev, ...newPreviews] : newPreviews))

      acceptedFiles.forEach((file) => simulateProgress(file.name))

      if (multiple) {
        acceptedFiles.forEach((file) => onFileSelect(file))
      } else {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect, maxSizeMB, maxSizeBytes, multiple]
  )

  const removeFile = (fileName) => {
    setPreviews((prev) => prev.filter((p) => p.name !== fileName))
    setUploadProgress((prev) => {
      const updated = { ...prev }
      delete updated[fileName]
      return updated
    })
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: multiple ? 10 : 1,
    maxSize: maxSizeBytes,
    multiple,
    disabled,
  })

  useEffect(() => {
  return () => {
    intervalsRef.current.forEach((id) => clearInterval(id))
    intervalsRef.current = []
  }
}, [])

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-all duration-300 group
          ${isDragReject
            ? 'border-red-500 bg-red-500/10'
            : isDragActive
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-border hover:border-primary/50 bg-card hover:bg-muted/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
              ${isDragReject
                ? 'bg-red-500/20'
                : isDragActive
                ? 'bg-primary/20 scale-110'
                : 'bg-muted group-hover:bg-primary/10'}
            `}
          >
            {isDragReject ? (
              <AlertCircle className="w-8 h-8 text-red-500" />
            ) : isDragActive ? (
              <FileText className="w-8 h-8 text-primary animate-bounce" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>

          {isDragReject ? (
            <p className="text-red-500 font-medium">Only PDF files are accepted</p>
          ) : isDragActive ? (
            <p className="text-primary font-medium text-lg">Drop {multiple ? 'files' : 'file'} here...</p>
          ) : (
            <>
              <div>
                <p className="text-foreground font-medium text-lg">
                  Drag & drop {multiple ? 'PDF files' : 'your resume PDF'} here
                </p>
                <p className="text-muted-foreground text-sm mt-1">or click to browse</p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg mt-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  PDF only • Max {maxSizeMB}MB{multiple ? ' • Multiple files supported' : ''}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="space-y-3">
          {previews.map((preview) => {
            const progress = uploadProgress[preview.name] ?? 0
            const isDone = progress === 100

            return (
              <div
                key={preview.name}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>

                {/* Info + Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{preview.name}</p>
                    <span className="text-xs text-muted-foreground ml-2 shrink-0">
                      {preview.size} MB
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        isDone ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isDone ? 'Ready to upload' : `Preparing... ${progress}%`}
                  </p>
                </div>

                {/* Status / Remove */}
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(preview.name)
                      }}
                      className="p-1 rounded-md hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
