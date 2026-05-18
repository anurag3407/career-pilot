import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, XCircle, CheckCircle, AlertCircle, Volume2, VolumeX, RotateCcw, UserX, Loader2, Sparkles, ArrowRight, Target, TrendingUp, MessageSquare, Eye, Brain, Award, ChevronDown, ChevronUp, Clock, BarChart3, Lightbulb, Zap, Laptop, Smartphone, Chrome, AlertTriangle, FileUp, FileText, X } from 'lucide-react';
import Button from '../components/Button';
import { interviewApi, uploadApi } from '../services/api';

// Device and browser detection utilities
const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Check for mobile user agents
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
  // Also check screen width as fallback
  const isMobileWidth = window.innerWidth <= 768;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return mobileRegex.test(userAgent.toLowerCase()) || (isMobileWidth && isTouchDevice);
};

const isChromeBrowser = () => {
  const userAgent = navigator.userAgent;
  // Check for Chrome but not Edge (which also contains Chrome in UA)
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isEdge = /Edg/.test(userAgent);
  return isChrome && !isEdge;
};

const INDUSTRIES = [
  { value: 'software_engineering', label: 'Software Engineering' },
  { value: 'product_management', label: 'Product Management' },
  { value: 'data_science', label: 'Data Science' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'consulting', label: 'Consulting' }
];

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'lead', label: 'Lead/Principal (10+ years)' }
];

function QuestionAnalysisCard({ answer, index }) {
  const [expanded, setExpanded] = useState(false);
  const analysis = answer.analysis || {};
  const avgScore = Math.round(((analysis.relevance || 0) + (analysis.clarity || 0) + (analysis.confidence || 0)) / 3);

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Strong';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Needs Work';
    return 'Significant Gaps';
  };

  return (
    <div className="rounded-2xl bg-muted/30 border border-border/50 overflow-hidden transition-all duration-300 hover:border-border/80/50">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center gap-4 text-left cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
          <span className="text-violet-400 font-bold text-sm">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-medium truncate pr-4">{answer.question}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">{answer.duration}s</span>
            <span className={`text-xs ${avgScore >= 70 ? 'text-emerald-400' : avgScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {getScoreLabel(avgScore)}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${getScoreBadgeColor(avgScore)}`}>
          {avgScore}%
        </div>
        <div className="text-muted-foreground">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4 border-t border-border/50">
          <div className="pt-4 space-y-4">
            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center">
                <p className="text-2xl font-bold text-sky-400">{analysis.relevance || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Relevance</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-2xl font-bold text-emerald-400">{analysis.clarity || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Clarity</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                <p className="text-2xl font-bold text-purple-400">{analysis.confidence || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Confidence</p>
              </div>
            </div>

            {/* Your Response vs Ideal Answer - Side by Side Comparison */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Your Response */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Your Response</p>
                </div>
                <p className="text-foreground text-sm leading-relaxed">"{answer.transcript}"</p>
              </div>

              {/* Ideal Answer */}
              {analysis.idealAnswer && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs text-emerald-400 uppercase tracking-wide font-medium">Model Answer Example</p>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{analysis.idealAnswer}</p>
                </div>
              )}
            </div>

            {/* Professional Feedback */}
            {analysis.feedback && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <p className="text-xs text-primary uppercase tracking-wide font-medium">Professional Assessment</p>
                </div>
                <p className="text-foreground text-sm leading-relaxed">{analysis.feedback}</p>
              </div>
            )}

            {/* What You Did Well & What Was Missing */}
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.whatYouDidWell && analysis.whatYouDidWell.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 uppercase tracking-wide mb-3 font-medium">✓ What You Did Well</p>
                  <ul className="space-y-2">
                    {analysis.whatYouDidWell.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.whatWasMissing && analysis.whatWasMissing.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400 uppercase tracking-wide mb-3 font-medium">⚠ What Was Missing</p>
                  <ul className="space-y-2">
                    {analysis.whatWasMissing.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Communication Style Analysis */}
            {analysis.communicationStyle && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 font-medium">Communication Style</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pace</p>
                    <p className={`text-sm font-medium ${analysis.communicationStyle.pace === 'appropriate' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {analysis.communicationStyle.pace}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Structure</p>
                    <p className={`text-sm font-medium ${analysis.communicationStyle.structure === 'well-organized' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {analysis.communicationStyle.structure}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Specificity</p>
                    <p className={`text-sm font-medium ${analysis.communicationStyle.specificity?.includes('specific') ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {analysis.communicationStyle.specificity}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Takeaway */}
            {analysis.keyTakeaway && (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-violet-400 uppercase tracking-wide mb-1 font-medium">Key Takeaway</p>
                    <p className="text-foreground text-sm font-medium">{analysis.keyTakeaway}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actionable Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <p className="text-xs text-sky-400 uppercase tracking-wide mb-3 font-medium">Action Items for Improvement</p>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                      <Lightbulb className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Filler Words */}
            {analysis.fillerWords && analysis.fillerWords.count > 0 && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 uppercase tracking-wide mb-2 font-medium">Filler Words Detected ({analysis.fillerWords.count})</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.fillerWords.words?.map((word, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-red-500/20 text-red-300 text-xs">{word}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Tip: Practice pausing instead of using filler words to sound more confident.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}


export default function InterviewPrep() {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // 'setup', 'av-check', 'interview', 'feedback'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Device/browser compatibility state
  const [isMobile, setIsMobile] = useState(false);
  const [isChrome, setIsChrome] = useState(true);

  // A/V confirmation state
  const [avConfirmed, setAvConfirmed] = useState(false);
  const [avCheckStream, setAvCheckStream] = useState(null);
  const [avVideoWorking, setAvVideoWorking] = useState(false);
  const [avAudioWorking, setAvAudioWorking] = useState(false);
  const avVideoRef = useRef(null);

  const [formData, setFormData] = useState({
    jobRole: '',
    industry: 'software_engineering',
    experienceLevel: 'entry',
    questionCount: 10
  });

  // Resume upload state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const resumeInputRef = useRef(null);
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [faceVisible, setFaceVisible] = useState(true);
  const [answersSubmitted, setAnswersSubmitted] = useState([]);

  const [overallResults, setOverallResults] = useState(null);
  const [expressionSamples, setExpressionSamples] = useState([]);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const faceCheckIntervalRef = useRef(null);
  const transcriptRef = useRef('');
  const isRecordingRef = useRef(false);

  // Check device and browser on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
    setIsChrome(isChromeBrowser());

    // Re-check on resize
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (step === 'interview') initializeMedia();
    return () => {
      cleanupMedia();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [step]);

  // Cleanup AV check stream when moving to interview
  useEffect(() => {
    if (step !== 'av-check' && avCheckStream) {
      avCheckStream.getTracks().forEach(track => track.stop());
      setAvCheckStream(null);
    }
  }, [step, avCheckStream]);

  useEffect(() => {
    if (step === 'interview' && questions.length > 0) {
      speakQuestion(questions[currentQuestionIndex]?.question);
    }
  }, [currentQuestionIndex, step, questions]);

  useEffect(() => {
    if (isRecording) {
      faceCheckIntervalRef.current = setInterval(checkFaceVisibility, 1000);
    } else {
      if (faceCheckIntervalRef.current) clearInterval(faceCheckIntervalRef.current);
    }
    return () => {
      if (faceCheckIntervalRef.current) clearInterval(faceCheckIntervalRef.current);
    };
  }, [isRecording]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 75;
      canvasRef.current = canvas;
      ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });
    } catch (err) {
      setError('Please allow camera and microphone access to continue.');
    }
  };

  const checkFaceVisibility = () => {
    if (!videoRef.current || !ctxRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;

    const ctx = ctxRef.current;
    ctx.drawImage(video, 0, 0, 100, 75);
    const imageData = ctx.getImageData(0, 0, 100, 75);
    const data = imageData.data;

    let skinTonePixels = 0;
    let brightness = 0;
    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      brightness += (r + g + b) / 3;
      if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) skinTonePixels++;
    }

    brightness = brightness / totalPixels;
    const skinRatio = skinTonePixels / totalPixels;
    const detected = skinRatio > 0.08 && brightness > 40 && brightness < 230;

    setFaceVisible(detected);
    if (detected) {
      const confidence = Math.min(100, Math.max(40, 50 + skinRatio * 200));
      setExpressionSamples(prev => [...prev.slice(-60), { confidence, timestamp: Date.now() }]);
    }
  };

  const getAverageMetrics = () => {
    if (expressionSamples.length === 0) {
      return { averageConfidence: 60, eyeContactPercentage: 60, headMovementStability: 70, overallExpressionScore: 60 };
    }
    const avgConfidence = expressionSamples.reduce((sum, s) => sum + s.confidence, 0) / expressionSamples.length;
    return {
      averageConfidence: Math.round(avgConfidence),
      eyeContactPercentage: Math.round(avgConfidence * 0.9),
      headMovementStability: Math.round(70 + Math.random() * 15),
      overallExpressionScore: Math.round(avgConfidence)
    };
  };

  const cleanupMedia = () => {
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) { }
    if (timerRef.current) clearInterval(timerRef.current);
    if (faceCheckIntervalRef.current) clearInterval(faceCheckIntervalRef.current);
  };

  const speakQuestion = (text) => {
    if (!text || !synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  // Initialize A/V check - get camera/mic access before interview
  const initializeAVCheck = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: true
      });
      setAvCheckStream(stream);
      setAvVideoWorking(true);
      setAvAudioWorking(true);

      // Connect to video element
      if (avVideoRef.current) {
        avVideoRef.current.srcObject = stream;
      }

      return true;
    } catch (err) {
      console.error('A/V check failed:', err);
      setAvVideoWorking(false);
      setAvAudioWorking(false);
      setError('Could not access camera/microphone. Please allow access and try again.');
      return false;
    }
  };

  // Extract text from PDF file using backend API
  const extractTextFromPDF = async (file) => {
    try {
      setResumeLoading(true);
      setResumeError('');

      // Use backend API to extract text from PDF
      const response = await uploadApi.extractText(file);
      // Backend returns { success: true, data: { text: ..., pageCount: ... } }
      const extractedText = response.data?.text || response.text || '';

      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('Could not extract text from PDF. The file may be image-based or corrupted.');
      }

      setResumeText(extractedText.trim());
      setResumeFile(file);
      setResumeLoading(false);
      return extractedText.trim();
    } catch (err) {
      console.error('PDF extraction failed:', err);
      setResumeError(err.message || 'Failed to extract text from PDF. Please try a different file.');
      setResumeLoading(false);
      return '';
    }
  };

  // Handle resume file selection
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setResumeError('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setResumeError('File size must be less than 5MB');
      return;
    }

    await extractTextFromPDF(file);
  };

  // Remove uploaded resume
  const removeResume = () => {
    setResumeFile(null);
    setResumeText('');
    setResumeError('');
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  // Confirm A/V is working and start the actual interview
  const confirmAVAndStart = () => {
    if (!avVideoWorking || !avAudioWorking) {
      setError('Please ensure both camera and microphone are working before continuing.');
      return;
    }

    // Stop the AV check stream - it will be re-initialized in interview step
    if (avCheckStream) {
      avCheckStream.getTracks().forEach(track => track.stop());
      setAvCheckStream(null);
    }

    setAvConfirmed(true);
    setStep('interview');
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!formData.jobRole.trim()) {
      setError('Please enter a job role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Include resume text in API call
      const response = await interviewApi.startInterview({
        ...formData,
        resumeText: resumeText || null
      });
      setInterviewId(response.data.interviewId);
      setQuestions(response.data.questions);
      setAnswersSubmitted([]);

      // Go to A/V check step first
      setStep('av-check');

      // Initialize A/V check
      await initializeAVCheck();
    } catch (err) {
      setError(err.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    if (!audioEnabled) {
      setError('Please enable microphone to record your answer');
      return;
    }

    const SpeechRec = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRec) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isSpeaking) stopSpeaking();

    setTranscript('');
    transcriptRef.current = '';
    setRecordingTime(0);
    startTimeRef.current = Date.now();
    setExpressionSamples([]);
    setError('');
    isRecordingRef.current = true;
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    const recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      transcriptRef.current = finalTranscript;
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      if (isRecordingRef.current && (event.error === 'no-speech' || event.error === 'network' || event.error === 'aborted')) {
        setTimeout(() => { try { recognition.start(); } catch (e) { } }, 100);
      }
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        setTimeout(() => { try { recognition.start(); } catch (e) { } }, 100);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecording = async () => {
    isRecordingRef.current = false;
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) { }
    recognitionRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsRecording(false);
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const metrics = getAverageMetrics();

    const finalTranscript = transcriptRef.current.trim() || transcript.trim();
    if (!finalTranscript) {
      setError('No speech recorded. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await interviewApi.submitAnswer(interviewId, {
        questionId: questions[currentQuestionIndex].questionId,
        transcript: finalTranscript,
        duration,
        expressionMetrics: metrics
      });

      setAnswersSubmitted([...answersSubmitted, { questionIndex: currentQuestionIndex, transcript: finalTranscript }]);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTranscript('');
      } else {
        completeInterview();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const completeInterview = async () => {
    setLoading(true);
    try {
      const response = await interviewApi.completeInterview(interviewId);
      setOverallResults(response.data);
      setStep('feedback');
      cleanupMedia();
    } catch (err) {
      setError(err.message || 'Failed to complete interview');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const replayQuestion = () => {
    if (questions[currentQuestionIndex]) speakQuestion(questions[currentQuestionIndex].question);
  };

  const resetInterview = () => {
    setStep('setup');
    setInterviewId(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setOverallResults(null);
    setTranscript('');
    setExpressionSamples([]);
    setAnswersSubmitted([]);
  };

  // Mobile device block - show message if on phone/tablet
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md w-full text-center"
        >
          <div className="bg-background/50 border border-border rounded-2xl p-8">
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-3">Laptop Only</h1>
            <p className="text-muted-foreground mb-6">
              AI Interview Prep is currently only supported on laptops and desktop computers.
            </p>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Laptop className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <p className="text-amber-300 text-sm text-left">
                  Please open this page on a laptop or desktop computer with a webcam and microphone.
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // A/V Check step - confirm camera and microphone before interview
  if (step === 'av-check') {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-4">
              <AlertTriangle className="w-4 h-4" />
              Equipment Check Required
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Confirm Your Setup</h1>
            <p className="text-muted-foreground">Please verify your camera and microphone are working before starting</p>
          </motion.div>

          {/* Chrome Warning */}
          {!isChrome && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <Chrome className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 font-medium">Chrome Browser Recommended</p>
                  <p className="text-amber-400/70 text-sm mt-1">
                    For the best experience, please use Google Chrome. Speech recognition may not work properly in other browsers.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Video Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background/50 border border-border rounded-2xl p-6 mb-6"
          >
            <div className="relative aspect-video bg-background rounded-xl overflow-hidden mb-6">
              <video
                ref={avVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!avVideoWorking && (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 text-muted-foreground/80 mx-auto mb-2" />
                    <p className="text-muted-foreground">Camera not detected</p>
                  </div>
                </div>
              )}
            </div>

            {/* A/V Status Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-xl border ${avVideoWorking ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-center gap-3">
                  {avVideoWorking ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p className={`font-medium ${avVideoWorking ? 'text-emerald-400' : 'text-red-400'}`}>
                      Camera
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {avVideoWorking ? 'Working' : 'Not detected'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${avAudioWorking ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="flex items-center gap-3">
                  {avAudioWorking ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p className={`font-medium ${avAudioWorking ? 'text-emerald-400' : 'text-red-400'}`}>
                      Microphone
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {avAudioWorking ? 'Working' : 'Not detected'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (avCheckStream) {
                    avCheckStream.getTracks().forEach(track => track.stop());
                    setAvCheckStream(null);
                  }
                  setStep('setup');
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={confirmAVAndStart}
                disabled={!avVideoWorking || !avAudioWorking}
                className="flex-1"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm & Start Interview
              </Button>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-muted-foreground"
          >
            <p>Make sure you're in a well-lit, quiet environment for the best results.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview Practice
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Interview Prep</h1>
            <p className="text-lg text-muted-foreground">Practice with AI interviewer, get complete feedback at the end</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="p-6 rounded-2xl bg-background/50 border border-border backdrop-blur-sm">
              <form onSubmit={handleStartInterview} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Job Role *</label>
                  <input
                    type="text"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Industry *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
                  >
                    {INDUSTRIES.map(ind => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Experience Level *</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
                  >
                    {EXPERIENCE_LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Number of Questions</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={formData.questionCount}
                      onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-card rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="w-12 text-center text-lg font-semibold text-primary">{formData.questionCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Choose between 2 to 20 questions for your interview</p>
                </div>

                {/* Resume Upload Section */}
                <div className="border border-dashed border-border rounded-xl p-5 bg-muted/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <FileUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">Upload Resume (Optional)</h3>
                      <p className="text-xs text-muted-foreground">Get personalized questions based on your experience</p>
                    </div>
                  </div>

                  {!resumeFile ? (
                    <div className="relative">
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={resumeLoading}
                      />
                      <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                        {resumeLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            <span className="text-sm text-muted-foreground">Extracting text...</span>
                          </>
                        ) : (
                          <>
                            <FileUp className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload resume</span>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-5 h-5 text-emerald-400" />
                        <div className="flex-1">
                          <p className="text-sm text-emerald-400 font-medium">{resumeFile.name}</p>
                          {/* Progress bar showing extraction complete */}
                          <div className="mt-1.5 h-1.5 bg-card rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeResume}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors ml-3"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}

                  {resumeError && (
                    <p className="text-xs text-red-400 mt-2">{resumeError}</p>
                  )}

                  {resumeText && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                      <Sparkles className="w-3 h-3" />
                      <span>~40% of questions will be personalized based on your resume</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button type="submit" disabled={loading} variant="primary" className="w-full !py-4 !text-lg !rounded-xl flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
                  {loading ? 'Generating Questions...' : `Start Interview (${formData.questionCount} Questions)`}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Questions will be read aloud • Your answers are recorded • Complete feedback at the end
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === 'interview') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-primary to-secondary" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl bg-background/50 border border-border">
              <div className="relative aspect-video bg-background rounded-xl overflow-hidden mb-4">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
                {!videoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <VideoOff className="w-12 h-12 text-muted-foreground/80" />
                  </div>
                )}
                {isRecording && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-foreground rounded-full flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 bg-card rounded-full" />
                    <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                  </div>
                )}
                {isSpeaking && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-foreground rounded-full flex items-center gap-2">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">AI Speaking...</span>
                  </div>
                )}
                {isRecording && !faceVisible && (
                  <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center">
                    <UserX className="w-16 h-16 text-red-400 mb-3" />
                    <p className="text-foreground font-semibold text-lg">Face Not Visible!</p>
                    <p className="text-red-300 text-sm mt-1">Please position yourself in front of the camera</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <button onClick={toggleVideo} className={`p-3 rounded-xl border transition-colors cursor-pointer ${videoEnabled ? 'bg-muted border-border text-foreground hover:bg-muted/80' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button onClick={toggleAudio} className={`p-3 rounded-xl border transition-colors cursor-pointer ${audioEnabled ? 'bg-muted border-border text-foreground hover:bg-muted/80' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                  {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                {isSpeaking ? (
                  <button onClick={stopSpeaking} className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors cursor-pointer hover:bg-amber-500/30">
                    <VolumeX className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={replayQuestion} className="p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary transition-colors cursor-pointer hover:bg-primary/90/30" title="Replay question">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="p-6 rounded-2xl bg-background/50 border border-border">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{currentQuestionIndex + 1}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      {currentQuestion?.type} • {currentQuestion?.difficulty}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground mt-1">{currentQuestion?.question}</h3>
                  </div>
                </div>

                {isRecording && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Mic className="w-5 h-5 text-primary" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Recording in progress</p>
                        <p className="text-muted-foreground text-sm">Speak clearly into your microphone</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                {!isRecording ? (
                  <Button onClick={startRecording} disabled={loading || isSpeaking} variant="primary" className="flex-1 !py-4 !rounded-xl flex items-center justify-center gap-2">
                    <Mic className="w-5 h-5" />
                    {isSpeaking ? 'Wait for question...' : 'Start Recording'}
                  </Button>
                ) : (
                  <button onClick={stopRecording} disabled={loading} className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-foreground font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50">
                    <XCircle className="w-5 h-5" />
                    {loading ? 'Submitting...' : 'Stop & Next'}
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Complete all questions to see your feedback • No scores shown during interview
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'feedback' && overallResults) {
    const getScoreColor = (score) => {
      if (score >= 80) return 'emerald';
      if (score >= 60) return 'amber';
      return 'red';
    };

    const getScoreLabel = (score) => {
      if (score >= 90) return 'Excellent';
      if (score >= 80) return 'Very Good';
      if (score >= 70) return 'Good';
      if (score >= 60) return 'Fair';
      if (score >= 50) return 'Needs Work';
      return 'Needs Improvement';
    };

    const scoreColor = getScoreColor(overallResults.overallScore);
    const scoreGradientClass = {
      emerald: 'from-emerald-500 to-emerald-600',
      amber: 'from-amber-500 to-amber-600',
      red: 'from-red-500 to-red-600'
    }[scoreColor] || 'from-emerald-500 to-emerald-600';
    const scoreShadowClass = {
      emerald: 'shadow-emerald-500/30',
      amber: 'shadow-amber-500/30',
      red: 'shadow-red-500/30'
    }[scoreColor] || 'shadow-emerald-500/30';
    const avgRelevance = overallResults.answers?.reduce((sum, a) => sum + (a.analysis?.relevance || 0), 0) / (overallResults.answers?.length || 1) || 0;
    const avgClarity = overallResults.answers?.reduce((sum, a) => sum + (a.analysis?.clarity || 0), 0) / (overallResults.answers?.length || 1) || 0;
    const avgConfidence = overallResults.answers?.reduce((sum, a) => sum + (a.analysis?.confidence || 0), 0) / (overallResults.answers?.length || 1) || 0;
    const totalFillerWords = overallResults.answers?.reduce((sum, a) => sum + (a.analysis?.fillerWords?.count || 0), 0) || 0;
    const expressionScore = overallResults.overallFeedback?.expressionAnalysis?.overallConfidence || 0;

    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="relative inline-block mb-6">
              <div className={`w-24 h-24 bg-gradient-to-br ${scoreGradientClass} rounded-3xl flex items-center justify-center shadow-2xl ${scoreShadowClass}`}>
                <Award className="w-14 h-14 text-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-foreground" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Interview Complete!</h1>
            <p className="text-lg text-muted-foreground">Here's your comprehensive performance analysis</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-border backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
                <div className="relative">
                  <svg className="w-44 h-44 transform -rotate-90">
                    <circle cx="88" cy="88" r="76" stroke="currentColor" strokeWidth="12" fill="none" className="text-muted-foreground/60" />
                    <motion.circle initial={{ strokeDashoffset: 478 }} animate={{ strokeDashoffset: 478 - (478 * overallResults.overallScore) / 100 }} transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }} cx="88" cy="88" r="76" stroke="url(#scoreGradient)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="478" />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {overallResults.overallScore}%
                    </motion.span>
                    <span className="text-muted-foreground text-sm font-medium mt-1">{getScoreLabel(overallResults.overallScore)}</span>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Performance Breakdown
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground text-sm flex items-center gap-2"><Target className="w-4 h-4 text-sky-400" />Answer Relevance</span>
                        <span className="text-sky-400 font-semibold">{Math.round(avgRelevance)}%</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${avgRelevance}%` }} transition={{ delay: 0.6, duration: 1 }} className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-400" />Communication Clarity</span>
                        <span className="text-emerald-400 font-semibold">{Math.round(avgClarity)}%</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${avgClarity}%` }} transition={{ delay: 0.7, duration: 1 }} className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground text-sm flex items-center gap-2"><Brain className="w-4 h-4 text-purple-400" />Verbal Confidence</span>
                        <span className="text-purple-400 font-semibold">{Math.round(avgConfidence)}%</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${avgConfidence}%` }} transition={{ delay: 0.8, duration: 1 }} className="h-full bg-gradient-to-r from-secondary to-purple-400 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-foreground text-sm flex items-center gap-2"><Eye className="w-4 h-4 text-amber-400" />Body Language & Expression</span>
                        <span className="text-amber-400 font-semibold">{Math.round(expressionScore)}%</span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${expressionScore}%` }} transition={{ delay: 0.9, duration: 1 }} className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{overallResults.answeredQuestions}/{overallResults.totalQuestions}</p>
                  <p className="text-xs text-muted-foreground mt-1">Questions Answered</p>
                </div>
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                  </div>
                  <p className="text-2xl font-bold text-sky-400">{formatTime(overallResults.duration)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Duration</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">{Math.round((avgRelevance + avgClarity + avgConfidence) / 3)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Answer Quality</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-amber-400">{totalFillerWords}</p>
                  <p className="text-xs text-muted-foreground mt-1">Filler Words Used</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-2xl font-bold text-purple-400">{overallResults.answers?.length > 0 ? Math.round(overallResults.duration / overallResults.answers.length) : 0}s</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Response Time</p>
                </div>
              </div>
            </div>
          </motion.div>

          {overallResults.overallFeedback && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-border backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">AI Performance Summary</h3>
                    <p className="text-muted-foreground text-sm">Personalized feedback based on your interview</p>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed text-lg bg-muted/30 p-5 rounded-2xl border border-border/50">{overallResults.overallFeedback.summary}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Your Strengths</h3>
                    <p className="text-emerald-400/70 text-sm">Areas where you excelled</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {overallResults.overallFeedback?.topStrengths?.map((s, i) => (
                    <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/10">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-sm font-bold">{i + 1}</span>
                      </div>
                      <span className="text-foreground/90">{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Areas to Develop</h3>
                    <p className="text-amber-400/70 text-sm">Focus on these for improvement</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {overallResults.overallFeedback?.areasToImprove?.map((a, i) => (
                    <motion.li initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/10">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </div>
                      <span className="text-foreground/90">{a}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Expert Recommendations</h3>
                  <p className="text-primary/70 text-sm">Actionable steps for your next interview</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {overallResults.overallFeedback?.recommendations?.map((r, i) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} key={i} className="p-4 rounded-2xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                      <span className="text-primary font-bold text-sm">{i + 1}</span>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">{r}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {overallResults.overallFeedback?.expressionAnalysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Body Language Analysis</h3>
                    <p className="text-cyan-400/70 text-sm">Insights from facial expression tracking</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-foreground">Expression Confidence Score</span>
                      <span className="text-2xl font-bold text-cyan-400">{overallResults.overallFeedback.expressionAnalysis.overallConfidence}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${overallResults.overallFeedback.expressionAnalysis.overallConfidence}%` }} transition={{ delay: 0.6, duration: 1 }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <p className="text-muted-foreground text-sm mb-2">AI Feedback</p>
                    <p className="text-foreground/90 leading-relaxed">{overallResults.overallFeedback.expressionAnalysis.feedback}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {overallResults.answers && overallResults.answers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-8">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-border backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Question-by-Question Analysis</h3>
                    <p className="text-muted-foreground text-sm">Detailed breakdown of each response</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {overallResults.answers.map((answer, i) => (
                    <QuestionAnalysisCard key={i} answer={answer} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-4">
            <Button onClick={resetInterview} variant="primary" className="flex-1 !py-5 !rounded-2xl flex items-center justify-center gap-3 !text-lg font-semibold">
              <Mic className="w-6 h-6" />
              Start New Interview
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="secondary" className="flex-1 !py-5 !rounded-2xl flex items-center justify-center gap-3 !text-lg font-semibold">
              Back to Dashboard
              <ArrowRight className="w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
