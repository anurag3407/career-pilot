import { useState, useRef } from "react";
import logger from '../utils/logger';
const TONES = ["formal", "conversational", "enthusiastic"];
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CoverLetter = () => {
  const fileInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [tone, setTone] = useState("formal");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState(1); // 1=upload, 2=details, 3=result

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".txt")) {
      setError("Please upload a PDF or TXT file.");
      return;
    }
    setError("");
    setResumeFile(file);
    setExtracting(true);

    try {
      let text = "";

      if (file.name.endsWith(".txt")) {
        text = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsText(file);
        });
      } else {
        // PDF → base64 → Groq extracts text
        const base64PDF = await toBase64(file);
        const res = await fetch(`${API_URL}/api/cover-letter/extract-resume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64PDF }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Extraction failed");
        text = data.resumeText || "";
      }

      if (!text || text.trim().length < 20) {
        throw new Error("Could not extract enough text from the file.");
      }

      setResumeText(text);
      setStep(2); // ← advance only after successful extraction
    } catch (err) {
      logger.error('cover letter generation failed:', err);
      setError(err.message || "Failed to read resume. Please try a .txt file.");
      setResumeFile(null);
      setResumeText("");
    } finally {
      setExtracting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please fill in the job description.");
      return;
    }
    setError("");
    setLoading(true);
    setCoverLetter("");

    try {
      const res = await fetch(`${API_URL}/api/cover-letter/generate-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          companyName,
          hiringManager,
          tone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCoverLetter(data.coverLetter);
      setStep(3);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cover-letter/download-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cover-letter.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download PDF.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatLetter = (text) =>
    text
      .split(/\n+/)
      .filter((p) => p.trim())
      .map((para, i) => (
        <p
          key={i}
          className={`leading-relaxed ${para.startsWith("Re:") || para.startsWith("Subject:") ? "font-semibold" : ""} ${i > 0 ? "mt-4" : ""}`}
        >
          {para}
        </p>
      ));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-600/8 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-gray-400 mb-6">
            <span className="text-blue-400">✦</span> AI-Powered Cover Letter
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent leading-tight">
            Generate Your
            <br />
            Cover Letter
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload your resume PDF, paste a job description, and get a
            professionally formatted cover letter in seconds.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {["Upload Resume", "Job Details", "Cover Letter"].map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  step === i + 1
                    ? "bg-blue-600 text-white"
                    : step > i + 1
                      ? "bg-green-600/20 text-green-400 border border-green-500/30"
                      : "bg-white/5 text-gray-500 border border-white/10"
                }`}
              >
                <span>{step > i + 1 ? "✓" : i + 1}</span> {label}
              </div>
              {i < 2 && (
                <div
                  className={`w-8 h-px ${step > i + 1 ? "bg-green-500/50" : "bg-white/10"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
              dragOver
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
            }`}
            onClick={() => !extracting && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
            {extracting ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-blue-400 font-medium">
                  Extracting resume with AI...
                </p>
                <p className="text-gray-500 text-sm">
                  Groq is reading your PDF
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
                  📄
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    Drop your resume here
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    PDF or TXT · Click to browse
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                    PDF
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs">
                    TXT
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Resume confirmed */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-green-500/20 bg-green-500/5">
              <span className="text-green-400 text-xl">✓</span>
              <div>
                <p className="text-green-400 font-medium text-sm">
                  {resumeFile?.name}
                </p>
                <p className="text-gray-500 text-xs">
                  Resume extracted successfully
                </p>
              </div>
              <button
                onClick={() => {
                  setStep(1);
                  setResumeFile(null);
                  setResumeText("");
                }}
                className="ml-auto text-gray-600 hover:text-gray-400 text-xs"
              >
                Replace
              </button>
            </div>

            {/* Job Description */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1 focus-within:border-blue-500/50 transition-colors">
              <label className="block text-xs font-medium text-gray-500 px-4 pt-3 uppercase tracking-wider">
                Job Description *
              </label>
              <textarea
                rows={7}
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-transparent text-white px-4 py-3 focus:outline-none resize-none placeholder:text-gray-600 text-sm"
              />
            </div>

            {/* Optional fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1 focus-within:border-blue-500/50 transition-colors">
                <label className="block text-xs font-medium text-gray-500 px-4 pt-3 uppercase tracking-wider">
                  Company Name{" "}
                  <span className="normal-case text-gray-600">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder:text-gray-600 text-sm"
                />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-1 focus-within:border-blue-500/50 transition-colors">
                <label className="block text-xs font-medium text-gray-500 px-4 pt-3 uppercase tracking-wider">
                  Hiring Manager{" "}
                  <span className="normal-case text-gray-600">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Johnson"
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder:text-gray-600 text-sm"
                />
              </div>
            </div>

            {/* Tone */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Tone
              </p>
              <div className="flex gap-3">
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                      tone === t
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm px-1">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-white text-base transition-all duration-200 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                boxShadow: "0 0 40px rgba(99,102,241,0.3)",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>✨ Generate Cover Letter</>
                )}
              </span>
            </button>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && coverLetter && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Cover Letter
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-sm rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  ← Edit
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 text-sm rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 text-sm rounded-xl font-medium text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #059669, #10b981)",
                  }}
                >
                  ↓ Download PDF
                </button>
              </div>
            </div>

            {/* Formatted letter */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-gray-600">
                  cover-letter.pdf
                </span>
              </div>
              <div className="px-10 py-10 text-gray-200 text-[15px] leading-relaxed max-w-2xl">
                {formatLetter(coverLetter)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetter;
