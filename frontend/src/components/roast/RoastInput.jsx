import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadApi } from '../../services/api';
import { cn } from '../../lib/utils';

const MAX_TEXT = 50_000;

/**
 * Resume Roast input — accepts either pasted text OR a PDF upload.
 * PDF is auto-extracted via the existing /api/upload/extract-text endpoint.
 */
export default function RoastInput({
  value,
  onChange,
  jobRole,
  onJobRoleChange,
  onSubmit,
  isLoading,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState(null);

  const charCount = value?.length || 0;
  const tooLong = charCount > MAX_TEXT;
  const tooShort = charCount < 50;

  const handlePdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setUploading(true);
    setFileName(file.name);
    try {
      const res = await uploadApi.extractText(file);
      const text = res?.data?.text || res?.text;
      if (!text) throw new Error('No text extracted');
      onChange(text);
      toast.success(`Extracted ${text.length.toLocaleString()} chars from ${file.name}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to extract PDF text');
      setFileName(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      <div>
        <label className="text-sm font-medium text-foreground">
          Target role <span className="text-muted-foreground font-normal">(optional — sharper roast)</span>
        </label>
        <input
          type="text"
          value={jobRole}
          onChange={(e) => onJobRoleChange(e.target.value)}
          placeholder="e.g. Senior Backend Engineer"
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          maxLength={120}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Paste your resume
          </label>
          <span
            className={cn(
              'text-xs tabular-nums',
              tooLong
                ? 'text-destructive font-semibold'
                : 'text-muted-foreground'
            )}
          >
            {charCount.toLocaleString()} / {MAX_TEXT.toLocaleString()}
          </span>
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your resume text here… or upload a PDF below."
          className="min-h-[280px] font-mono text-sm resize-y"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handlePdf}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isLoading}
          className="gap-2"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Extracting…' : 'Upload PDF'}
        </Button>

        {fileName && !uploading && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            {fileName}
            <button type="button"
              onClick={() => {
                setFileName(null);
                onChange('');
              }}
              className="ml-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        )}
      </div>

      <Button
        onClick={onSubmit}
        disabled={tooShort || tooLong || isLoading || uploading}
        size="lg"
        className="w-full gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Roasting… (this takes 10–30 seconds)
          </>
        ) : (
          <>🔥 Roast my resume</>
        )}
      </Button>

      {tooShort && charCount > 0 && (
        <p className="text-xs text-muted-foreground">
          Add at least 50 characters so the AI has something to work with.
        </p>
      )}
    </motion.div>
  );
}