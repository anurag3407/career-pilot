import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FileUpload({ onFileSelect, disabled = false, maxSizeMB = 5 }) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      rejectedFiles.forEach((file) => {
        if (file.file.size > maxSizeBytes) {
          const fileSizeMB = (file.file.size / (1024 * 1024)).toFixed(2)
          toast.error(
            `File "${file.file.name}" (${fileSizeMB}MB) exceeds the maximum limit of ${maxSizeMB}MB`
          )
        }
      })
      return
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect, maxSizeBytes, maxSizeMB])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: maxSizeBytes,
    disabled
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-all duration-300
        ${isDragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-border hover:border-primary/50 bg-card hover:bg-muted'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
          isDragActive ? 'bg-primary/20' : 'bg-muted'
        }`}>
          {isDragActive ? (
            <FileText className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        {isDragActive ? (
          <p className="text-lg font-medium text-primary">Drop the PDF file here...</p>
        ) : (
          <>
            <p className="text-lg font-medium text-foreground mb-1">Drag & drop your resume PDF here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">PDF files only • Max {maxSizeMB}MB</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
