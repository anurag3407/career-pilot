import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { analyzeResume } from '../utils/resumeAnalyzer';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
};

/**
 * Extract plain text from a PDF file using pdfjs-dist.
 * @param {File} file
 * @returns {Promise<string>}
 */
async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    pages.push(pageText);
  }

  return pages.join('\n');
}

/**
 * Extract plain text from a TXT file.
 * @param {File} file
 * @returns {Promise<string>}
 */
function extractTextFromTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = () => reject(new Error('Failed to read text file.'));
    reader.readAsText(file);
  });
}

/**
 * Hook for resume upload, text extraction, and local scoring analysis.
 */
export function useResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState(null);

  const clearFile = useCallback(() => {
    setFile(null);
    setResumeText('');
    setAnalysis(null);
    setError(null);
  }, []);

  const selectFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf');
    const isTxt =
      selectedFile.type === 'text/plain' || selectedFile.name.toLowerCase().endsWith('.txt');

    if (!isPdf && !isTxt) {
      setError('Unsupported file format. Please upload a .pdf or .txt file.');
      return;
    }

    setFile(selectedFile);
    setAnalysis(null);
    setError(null);
    setExtracting(true);

    try {
      let text = '';
      if (isPdf) {
        text = await extractTextFromPdf(selectedFile);
      } else {
        text = await extractTextFromTxt(selectedFile);
      }

      if (!text || text.trim().length < 20) {
        setError('Could not extract enough text. Try a text-based PDF or paste content into a .txt file.');
        setResumeText('');
      } else {
        setResumeText(text);
      }
    } catch {
      setError('Failed to read the file. Ensure it is not password-protected or corrupted.');
      setResumeText('');
    } finally {
      setExtracting(false);
    }
  }, []);

  const runAnalysis = useCallback(() => {
    if (!resumeText || resumeText.trim().length < 20) {
      setError('Please upload a resume with readable text before analyzing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isPdf = file?.type === 'application/pdf' || file?.name?.endsWith('.pdf');
      const result = analyzeResume(resumeText, { isPdf });
      setAnalysis(result);
      if (result.error) {
        setError(result.error);
      }
    } catch {
      setError('Analysis failed. Please try again with a different file.');
    } finally {
      setLoading(false);
    }
  }, [resumeText, file]);

  return {
    file,
    resumeText,
    analysis,
    loading,
    extracting,
    error,
    acceptedTypes: ACCEPTED_TYPES,
    selectFile,
    clearFile,
    runAnalysis,
    setError,
  };
}
