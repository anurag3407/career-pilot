import { triggerConfetti } from '../utils/confetti'
import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, XCircle, CheckCircle, AlertCircle, Volume2, VolumeX, RotateCcw, UserX, Loader2, Sparkles, ArrowRight, Target, TrendingUp, MessageSquare, Eye, Brain, Award, ChevronDown, ChevronUp, Clock, BarChart3, Lightbulb, Zap, Laptop, Smartphone, Chrome, AlertTriangle, FileUp, FileText, X, Globe, Code2, Play, Link as LinkIcon, Share2, Download } from 'lucide-react';
import Button from '../components/Button';
import BodyLanguageTips from '../components/BodyLanguageTips';
import VoiceToTextButton from '../components/VoiceToTextButton';
import { interviewApi, uploadApi, resumeApi } from '../services/api';
import ConfidenceMeter from "../components/ConfidenceMeter";
import {DEFAULT_PROGRESS,updateDifficulty} from '../utils/interviewDifficulty';
import LearningRecommendations from "../components/LearningRecommendations";
import CopyButton from '../components/CopyButton';
import QuestionAnalysisCard from '../components/interview/QuestionAnalysisCard';
import AvatarInterviewer from '../components/interview/AvatarInterviewer';
import { useAIConfigStore } from '../stores/useAIConfigStore';
import { SUPPORTED_LANGUAGES, getLanguage, DEFAULT_LANGUAGE_CODE } from '../constants/languages';
import { captureCardToBlob, downloadBlob, shareImage, buildShareCaption } from '../utils/shareCard';

// Code editor (Monaco) — ~3MB chunk, lazy-loaded only when mode === 'coding'
const CodeEditor = lazy(() => import('../components/interview/CodeEditor'));
const CodingQuestionCard = lazy(() => import('../components/interview/CodingQuestionCard'));
const ShareCard = lazy(() => import('../components/ShareCard'));

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

const INTERVIEW_MODES = [
  { value: 'behavioral', label: 'Behavioral', desc: 'Soft-skill & STAR-method questions' },
  { value: 'technical', label: 'Technical', desc: 'Domain knowledge & reasoning' },
  { value: 'coding', label: 'Coding', desc: 'Live code with test cases' },
  { value: 'mixed', label: 'Mixed', desc: 'Behavioral + technical blend' }
];

const CODING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' }
];








export default function InterviewPrep() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState('setup'); // 'setup' | 'warmup' | 'av-check' | 'interview' | 'feedback'
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
    jobRole: location.state?.jobRole || '',
    industry: 'software_engineering',
    experienceLevel: 'entry',
    questionCount: 10,
    language: 'en',
    mode: 'behavioral',
    companyName: '',
    codingLanguage: 'javascript',
    jdText: '',
    skipWarmup: false
  });

  // Resume upload state
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.resumeId || 'none');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState(location.state?.resumeText || '');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const resumeInputRef = useRef(null);
  const [interviewId, setInterviewId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [codingQuestion, setCodingQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [faceVisible, setFaceVisible] = useState(true);
  const [faceConfidence, setFaceConfidence] = useState(50);
  const [answersSubmitted, setAnswersSubmitted] = useState([]);
  const [warmupQuestions, setWarmupQuestions] = useState([]);
  const [warmupIndex, setWarmupIndex] = useState(0);
  const [code, setCode] = useState('');
  const [runResults, setRunResults] = useState(null);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [jdInput, setJdInput] = useState('');
  const [jdMode, setJdMode] = useState('none'); // 'none' | 'paste' | 'url'
  const [jdLoading, setJdLoading] = useState(false);
  const [jdError, setJdError] = useState('');
  const [jdSummary, setJdSummary] = useState(null); // { role, company, jdText }
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [showSwitchProvider, setShowSwitchProvider] = useState(false);
  const [switchBusy, setSwitchBusy] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const shareCardRef = useRef(null);
  
  const [useTextInput, setUseTextInput] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');

  const [overallResults, setOverallResults] = useState(null);
  const [progressData, setProgressData] = useState(() => {

  const stored =
    localStorage.getItem(
      "interviewProgress"
    );

  return stored
    ? JSON.parse(stored)
    : DEFAULT_PROGRESS;

});
  const [expressionSamples, setExpressionSamples] = useState([]);

  // Active AI config (BYOK) — for the avatar and provider-switch modal
  const activeConfig = useAIConfigStore((s) => s.activeProvider);
  const configuredProviders = useAIConfigStore((s) => s.providers);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const faceCheckIntervalRef = useRef(null);
  const transcriptRef = useRef('');
  const isRecordingRef = useRef(false);

  const visualizerCanvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // Check device and browser on mount
  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    setIsChrome(isChromeBrowser());

    // Re-check on resize
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On mobile we auto-route to text-answer mode because (a) Web Speech API
  // is unreliable on mobile Chrome/Safari and (b) many users prefer typing on
  // a phone keyboard. Desktop users still get voice-first UX by default.
  useEffect(() => {
    if (isMobile) setUseTextInput(true);
  }, [isMobile]);

  // Check BYOK config and fetch saved resumes
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // Check BYOK
      const activeConfig = useAIConfigStore.getState().getActiveConfig();
      const hasStoreKey = !!activeConfig?.apiKey;
      const legacyConfigStr = localStorage.getItem('aiConfig');
      let hasLegacyKey = false;
      try { hasLegacyKey = legacyConfigStr && JSON.parse(legacyConfigStr).apiKey; } catch(e) {}
      const hasOpenRouterKey = localStorage.getItem('openRouterApiKey');
      
      if (!hasStoreKey && !hasLegacyKey && !hasOpenRouterKey) {
        navigate('/settings?tab=ai&return_url=/interview-prep');
        return;
      }

      // Fetch saved resumes
      try {
        const response = await resumeApi.getAll();
        let fetchedResumes = [];
        if (Array.isArray(response)) fetchedResumes = response;
        else if (Array.isArray(response.data)) fetchedResumes = response.data;
        else if (Array.isArray(response.resumes)) fetchedResumes = response.resumes;
        else if (response.data && Array.isArray(response.data.resumes)) fetchedResumes = response.data.resumes;
        
        setSavedResumes(fetchedResumes);
      } catch (err) {
        console.error('Failed to fetch saved resumes:', err);
      }
    };
    checkAuthAndFetch();
  }, [navigate]);

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
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
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
  const confidence =
    Math.min(100, Math.max(40, 50 + skinRatio * 200));

  setFaceConfidence(confidence);

  setExpressionSamples(prev => [
    ...prev.slice(-60),
    { confidence, timestamp: Date.now() }
  ]);
} else {
  setFaceConfidence(20);
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
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        if (audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
      } catch (e) {}
      audioCtxRef.current = null;
    }
    analyserRef.current = null;

    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) { }
    if (timerRef.current) clearInterval(timerRef.current);
    if (faceCheckIntervalRef.current) clearInterval(faceCheckIntervalRef.current);
  };

  const speakQuestion = (text) => {
    if (!text || !synthRef.current) return;
    try { synthRef.current.cancel(); } catch {}
    setIsSpeaking(true);

    const lang = getLanguage(formData.language);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = lang.speechLocale;

    const voices = synthRef.current.getVoices();
    const localePrefix = lang.speechLocale.split('-')[0];
    const preferredVoice =
      voices.find(v => v.lang === lang.speechLocale && v.name.includes('Google'))
      || voices.find(v => v.lang === lang.speechLocale)
      || voices.find(v => v.lang.startsWith(localePrefix))
      || voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('en-US'))
      || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => { setIsSpeaking(false); setAmplitude(0); };
    utterance.onerror = () => { setIsSpeaking(false); setAmplitude(0); };

    // Animate the avatar mouth while speaking
    let phase = 0;
    let active = true;
    let raf = 0;
    const loop = () => {
      phase += 0.18;
      const amp = active
        ? Math.max(0, Math.min(1, 0.45 + 0.45 * (Math.sin(phase) * 0.5 + Math.sin(phase * 2.7) * 0.25 + Math.sin(phase * 5.1) * 0.15)))
        : 0;
      setAmplitude(amp);
      if (active) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    utterance.onend = () => {
      active = false;
      setIsSpeaking(false);
      setAmplitude(0);
      cancelAnimationFrame(raf);
    };
    utterance.onerror = () => {
      active = false;
      setIsSpeaking(false);
      setAmplitude(0);
      cancelAnimationFrame(raf);
    };

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

  const handleResumeSelect = (e) => {
    const id = e.target.value;
    setSelectedResumeId(id);
    if (id === 'none') {
      setResumeText('');
      setResumeFile(null);
    } else if (id === 'upload') {
      setResumeText('');
      setResumeFile(null);
    } else {
      const selected = savedResumes.find(r => (r._id || r.id) === id);
      if (selected) {
        setResumeText(selected.enhancedText || selected.originalText || '');
        setResumeFile({ name: selected.title || selected.jobRole || 'Saved Resume' });
      }
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
    setSelectedResumeId('none');
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
    e?.preventDefault?.();
    if (!formData.jobRole.trim()) {
      setError('Please enter a job role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Resume text + JD text are both included for personalized questions
      const response = await interviewApi.startInterview({
        ...formData,
        resumeText: resumeText || null,
        jobDescriptionText: jdSummary?.jdText || null,
        companyName: formData.companyName || null,
        companyRole: formData.companyName ? formData.jobRole : null,
        skipWarmup: formData.skipWarmup || warmupQuestions.length > 0
      });
      setInterviewId(response.data.interviewId);
      setQuestions(response.data.questions);
      setCodingQuestion(response.data.codingQuestion || null);
      setCode(response.data.codingQuestion?.starterCode || '');
      setAnswersSubmitted([]);

      // Route: warmup → av-check → interview → feedback
      if (!formData.skipWarmup) {
        try {
          const wr = await interviewApi.getWarmupQuestions({
            jobRole: formData.jobRole,
            industry: formData.industry,
            language: formData.language
          });
          setWarmupQuestions(wr.data?.questions || []);
          setWarmupIndex(0);
          setStep('warmup');
        } catch (e) {
          console.warn('Warmup fetch failed, skipping:', e.message);
          setStep('av-check');
          await initializeAVCheck();
        }
      } else {
        setStep('av-check');
        await initializeAVCheck();
      }
    } catch (err) {
      setError(err.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const completeWarmup = async () => {
    setStep('av-check');
    await initializeAVCheck();
  };

  const switchProvider = async () => {
    if (!interviewId) return;
    setSwitchBusy(true);
    setError('');
    try {
      const res = await interviewApi.switchProvider(interviewId);
      if (res?.data?.analysis) {
        // Update the last answer's analysis in-place
        setAnswersSubmitted((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, analysis: res.data.analysis }];
        });
      }
      setShowSwitchProvider(false);
    } catch (err) {
      setError(err.message || 'Failed to switch provider');
    } finally {
      setSwitchBusy(false);
    }
  };

  const runCandidateCode = async () => {
    if (!interviewId || !code?.trim()) return;
    setIsRunningCode(true);
    setRunResults(null);
    try {
      const res = await interviewApi.runCode(interviewId, {
        code,
        language: formData.codingLanguage,
        problemId: codingQuestion?.questionId || questions[0]?.questionId
      });
      setRunResults(res.data);
    } catch (err) {
      setError(err.message || 'Failed to evaluate code');
    } finally {
      setIsRunningCode(false);
    }
  };

  const parseJd = async () => {
    if (!jdInput.trim()) return;
    setJdLoading(true);
    setJdError('');
    try {
      const payload = jdMode === 'url' ? { url: jdInput.trim() } : { text: jdInput.trim() };
      const res = await interviewApi.parseJd(payload);
      setJdSummary(res.data);
      if (res.data?.role && !formData.jobRole) {
        setFormData((f) => ({ ...f, jobRole: res.data.role }));
      }
    } catch (err) {
      setJdError(err.message || 'Failed to parse job description');
    } finally {
      setJdLoading(false);
    }
  };

  const generateShareImage = async () => {
    if (!shareCardRef.current || !overallResults) return null;
    setShareBusy(true);
    try {
      const blob = await captureCardToBlob(shareCardRef.current);
      return blob;
    } finally {
      setShareBusy(false);
    }
  };

  const handleShare = async () => {
    const blob = await generateShareImage();
    if (!blob) return;
    const caption = buildShareCaption(overallResults);
    const result = await shareImage({ blob, text: caption, fileName: `careerpilot-${overallResults.interviewId || 'score'}.png` });
    if (result.method === 'native' || result.method === 'cancelled') return;
  };

  const handleDownloadShare = async () => {
    const blob = await generateShareImage();
    if (!blob) return;
    downloadBlob(blob, `careerpilot-${overallResults?.interviewId || 'score'}.png`);
  };

  const startVisualizerDraw = (analyser, canvas) => {
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      if (!isRecordingRef.current) return;
      animationFrameIdRef.current = requestAnimationFrame(draw);
      
      analyser.getByteTimeDomainData(dataArray);
      
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.lineWidth = 2.5;
      
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#6366f1');
      gradient.addColorStop(0.5, '#a855f7');
      gradient.addColorStop(1, '#ec4899');
      ctx.strokeStyle = gradient;
      
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
      
      ctx.beginPath();
      
      const sliceWidth = width / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    
    draw();
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

    // Initialize Audio Visualizer
    try {
      if (mediaStreamRef.current) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = audioContext;
        
        const source = audioContext.createMediaStreamSource(mediaStreamRef.current);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;
        
        source.connect(analyser);
        
        // Start drawing loop after small timeout to allow canvas mount
        setTimeout(() => {
          if (visualizerCanvasRef.current) {
            startVisualizerDraw(analyser, visualizerCanvasRef.current);
          }
        }, 100);
      }
    } catch (visErr) {
      console.error('Failed to initialize audio visualizer:', visErr);
    }

    timerRef.current = setInterval(() => {
      setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    // Also record audio via MediaRecorder so we can upload the answer audio for replay.
    try {
      if (mediaStreamRef.current && typeof MediaRecorder !== 'undefined') {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
        const recorder = mimeType ? new MediaRecorder(mediaStreamRef.current, { mimeType }) : new MediaRecorder(mediaStreamRef.current);
        audioChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
      }
    } catch (e) {
      console.warn('MediaRecorder unavailable:', e.message);
    }

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
    
    // Stop audio visualizer
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        if (audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
      } catch (e) {
        console.error('Error closing AudioContext:', e);
      }
      audioCtxRef.current = null;
    }
    analyserRef.current = null;

    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) { }
    recognitionRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);

    // Stop MediaRecorder and collect audio blob
    let audioBlob = null;
    if (mediaRecorderRef.current) {
      try {
        const recorder = mediaRecorderRef.current;
        if (recorder.state !== 'inactive') {
          await new Promise((resolve) => {
            recorder.onstop = resolve;
            try { recorder.stop(); } catch (_) { resolve(); }
          });
        }
        if (audioChunksRef.current.length > 0) {
          audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        }
      } catch (e) {
        console.warn('MediaRecorder stop failed:', e.message);
      }
      mediaRecorderRef.current = null;
    }

    setIsRecording(false);
    // eslint-disable-next-line
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const metrics = getAverageMetrics();

    const finalTranscript = transcriptRef.current.trim() || transcript.trim();

    // If Web Speech failed and we have a recorded audio blob, send to backend /transcribe
    let resolvedTranscript = finalTranscript;
    if (!resolvedTranscript && audioBlob) {
      try {
        const tr = await interviewApi.transcribe({ audioBlob, language: formData.language });
        resolvedTranscript = (tr?.data?.text || '').trim();
        if (resolvedTranscript) setTranscript(resolvedTranscript);
      } catch (e) {
        console.warn('Backend transcription failed:', e.message);
      }
    }

    if (!resolvedTranscript) {
      setError('No speech recorded. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await interviewApi.submitAnswer(interviewId, {
        questionId: questions[currentQuestionIndex].questionId,
        transcript: resolvedTranscript,
        duration,
        expressionMetrics: metrics,
        code: formData.mode === 'coding' ? code : undefined,
        codingLanguage: formData.mode === 'coding' ? formData.codingLanguage : undefined,
        audioBlob
      });

      setAnswersSubmitted([...answersSubmitted, { questionIndex: currentQuestionIndex, transcript: resolvedTranscript, analysis: response.data.analysis }]);

      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
      }

      if (response.data?.answeredCount >= response.data?.totalQuestions || !response.data?.nextQuestion) {
        completeInterview();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setTranscript('');
        setCode(response.data?.codingQuestion?.starterCode || code);
        setRunResults(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const submitTextAnswer = async () => {
    const finalTranscript = textAnswer.trim();
    if (!finalTranscript) {
      setError('Please type your answer before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await interviewApi.submitAnswer(interviewId, {
        questionId: questions[currentQuestionIndex].questionId,
        transcript: finalTranscript,
        duration: 30, // Default for text answers
        expressionMetrics: { averageConfidence: 0.8, eyeContactPercentage: 80, headMovementStability: 0.8, overallExpressionScore: 80 }
      });

      setAnswersSubmitted([...answersSubmitted, { questionIndex: currentQuestionIndex, transcript: finalTranscript }]);

      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
      }

      if (response.data?.answeredCount >= response.data?.totalQuestions || !response.data?.nextQuestion) {
        completeInterview();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setTextAnswer('');
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
    const score = response.data.overallScore;
    const previousLevel = progressData.level;
    const updatedProgress = updateDifficulty(score,progressData);
    localStorage.setItem("interviewProgress",JSON.stringify( updatedProgress));
    setProgressData(updatedProgress);
    if(
 previousLevel !==
 updatedProgress.level
){
 alert(
   `🎉 Congratulations!
You reached
${updatedProgress.level}`
 );
}

    setOverallResults(response.data);
    setStep('feedback');

    triggerConfetti({
      duration: 3500,
      particleCount: 180,
      spread: 130
    });

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

  // Mobile devices are now supported. We auto-route to text-input mode so
  // users without a desktop mic can still complete the interview via typing.
  // The A/V check still works on mobile (front-facing camera + mic), but the
  // voice capture path gracefully falls back to text.

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

          {/* Mobile notice */}
          {isMobile && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-blue-200 text-sm">
                  Mobile detected — text-answer mode is recommended. You can still use voice if your keyboard is hidden.
                </p>
              </div>
            </motion.div>
          )}

          {/* Chrome Warning */}
          {!isChrome && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <Chrome className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
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
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
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
            <div className="p-8 rounded-3xl glass glow border border-border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <form onSubmit={handleStartInterview} className="space-y-6 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Job Role *</label>
                  <input
                    type="text"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="w-full px-4 py-3 bg-card/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all-300 shadow-sm"
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
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Interview Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTERVIEW_MODES.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, mode: m.value })}
                        className={
                          'text-left p-3 rounded-xl border transition-colors ' +
                          (formData.mode === m.value
                            ? 'bg-primary/15 border-primary/50 text-foreground'
                            : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/30')
                        }
                      >
                        <div className="text-sm font-semibold">{m.label}</div>
                        <div className="text-xs mt-0.5">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.mode === 'coding' && (
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Coding Language
                    </label>
                    <select
                      value={formData.codingLanguage}
                      onChange={(e) => setFormData({ ...formData, codingLanguage: e.target.value })}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
                    >
                      {CODING_LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <span className="inline-flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> Language
                    </span>
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                  {formData.language !== 'en' && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Non-English uses backend transcription via your AI provider.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Target Company <span className="text-muted-foreground/60">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g., Google, Stripe, Airbnb"
                    className="w-full px-4 py-3 bg-card/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Pulls from the curated company question bank when available.
                  </p>
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

                {/* Job Description (paste or URL) */}
                <div className="border-2 border-dashed border-blue-500/20 rounded-2xl p-6 bg-blue-500/5 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-foreground font-bold text-base">Job Description <span className="text-xs text-muted-foreground font-normal">(optional)</span></h3>
                        <p className="text-xs text-muted-foreground">Personalize questions to a specific role.</p>
                      </div>
                    </div>
                    {jdSummary && (
                      <button
                        type="button"
                        onClick={() => { setJdSummary(null); setJdInput(''); }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {!jdSummary && (
                    <>
                      <div className="flex items-center gap-2 mb-3 text-xs">
                        {['none', 'paste', 'url'].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setJdMode(m)}
                            className={
                              'px-3 py-1 rounded-full transition-colors ' +
                              (jdMode === m
                                ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                                : 'bg-muted/30 border border-border text-muted-foreground hover:border-blue-500/30')
                            }
                          >
                            {m === 'none' ? 'Skip' : m === 'paste' ? 'Paste Text' : 'From URL'}
                          </button>
                        ))}
                      </div>

                      {jdMode !== 'none' && (
                        <>
                          <textarea
                            value={jdInput}
                            onChange={(e) => setJdInput(e.target.value)}
                            placeholder={jdMode === 'url' ? 'https://job-boards.example.com/job/...' : 'Paste the job description text here...'}
                            rows={jdMode === 'url' ? 2 : 5}
                            className="w-full px-3 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 resize-y"
                          />
                          {jdError && <p className="text-xs text-red-400 mt-1.5">{jdError}</p>}
                          <button
                            type="button"
                            onClick={parseJd}
                            disabled={jdLoading || !jdInput.trim()}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600"
                          >
                            {jdLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                            {jdLoading ? 'Parsing…' : 'Parse & Use'}
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {jdSummary && (
                    <div className="text-xs text-blue-200 space-y-1">
                      <div><span className="text-muted-foreground">Detected role: </span>{jdSummary.role || '—'}</div>
                      {jdSummary.company && <div><span className="text-muted-foreground">Company: </span>{jdSummary.company}</div>}
                      <div><span className="text-muted-foreground">Text length: </span>{jdSummary.jdText.length} characters</div>
                    </div>
                  )}
                </div>

                {/* Resume Upload Section */}
                <div className="border-2 border-dashed border-primary/20 rounded-2xl p-6 bg-primary/5 transition-colors relative group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-bold text-lg">Resume Context (Optional)</h3>
                      <p className="text-sm text-muted-foreground">Select or upload a resume to get personalized questions.</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <select
                      value={selectedResumeId}
                      onChange={handleResumeSelect}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary shadow-sm"
                    >
                      <option value="none">-- No Resume --</option>
                      {savedResumes.map(r => (
                        <option key={r._id || r.id} value={r._id || r.id}>
                          {r.title || r.jobRole || 'Saved Resume'}
                        </option>
                      ))}
                      <option value="upload">+ Upload New PDF</option>
                    </select>
                  </div>

                  {selectedResumeId === 'upload' && !resumeFile ? (
                    <div className="relative mt-2 cursor-pointer hover:bg-primary/10 rounded-xl transition-colors">
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={resumeLoading}
                      />
                      <div className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-card border border-border group-hover:border-primary/50 transition-colors shadow-sm">
                        {resumeLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            <span className="text-sm font-semibold text-muted-foreground">Extracting text...</span>
                          </>
                        ) : (
                          <>
                            <FileUp className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload resume</span>
                          </>
                        )}
                      </div>
                    </div>
                  ) : resumeFile ? (
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
                  ) : null}

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
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Body language coaching tip */}
                <BodyLanguageTips currentQuestionIndex={currentQuestionIndex} />

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

  // ─── Warmup step ──────────────────────────────────────────────────────
  if (step === 'warmup' && warmupQuestions.length > 0) {
    const wq = warmupQuestions[warmupIndex];
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-xl w-full">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
              <Sparkles className="w-3 h-3" /> Warmup · not scored
            </span>
          </div>
          <div className="p-8 rounded-3xl bg-background/60 border border-border backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Warmup question {warmupIndex + 1} of {warmupQuestions.length}
            </h2>
            <p className="text-lg text-foreground/90 leading-relaxed">{wq?.question}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              This won't count toward your score — just a chance to find your rhythm.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={completeWarmup} className="flex-1">
                Skip warmup
              </Button>
              <Button variant="primary" onClick={completeWarmup} className="flex-1">
                {warmupIndex + 1 >= warmupQuestions.length ? 'Start real interview' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'interview') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / formData.questionCount) * 100;
    const isCoding = formData.mode === 'coding';

    return (
    <>
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {isCoding ? <span className="inline-flex items-center gap-1"><Code2 className="w-3.5 h-3.5" /> Coding Question</span> : `Question ${currentQuestionIndex + 1} of ${formData.questionCount}`}
              </span>
              <div className="flex items-center gap-3">
                <button type="button"
                  onClick={() => setShowSwitchProvider(true)}
                  className="text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  title="Re-analyze with a different AI provider"
                >
                  <Sparkles className="w-3 h-3" />
                  Switch AI
                </button>
                <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-primary to-secondary" />
            </div>
          </motion.div>

          <div className={isCoding ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl bg-background/50 border border-border">
              {!isCoding && (
                <>
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
                    <button type="button" onClick={toggleVideo} className={`p-3 rounded-xl border transition-colors cursor-pointer ${videoEnabled ? 'bg-muted border-border text-foreground hover:bg-muted/80' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                      {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </button>
                    <button type="button" onClick={toggleAudio} className={`p-3 rounded-xl border transition-colors cursor-pointer ${audioEnabled ? 'bg-muted border-border text-foreground hover:bg-muted/80' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                      {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </button>
                    {isSpeaking ? (
                      <button type="button" onClick={stopSpeaking} className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors cursor-pointer hover:bg-amber-500/30">
                        <VolumeX className="w-5 h-5" />
                      </button>
                    ) : (
                      <button type="button" onClick={replayQuestion} className="p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary transition-colors cursor-pointer hover:bg-primary/90/30" title="Replay question">
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {isCoding ? (
                <>
                  <Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground">Loading problem…</div>}>
                    <CodingQuestionCard
                      coding={codingQuestion || questions[0]?.coding}
                      runResults={runResults}
                    />
                  </Suspense>
                  <div className="p-4 rounded-2xl bg-background/50 border border-border space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Your solution · {formData.codingLanguage}
                      </span>
                      <Button
                        onClick={runCandidateCode}
                        disabled={isRunningCode || !code?.trim()}
                        variant="outline"
                        className="!py-2 !px-3 !text-xs"
                      >
                        {isRunningCode ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
                        {isRunningCode ? 'Evaluating…' : 'Run Tests'}
                      </Button>
                    </div>
                    <Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground text-sm">Loading editor…</div>}>
                      <CodeEditor
                        language={formData.codingLanguage}
                        value={code}
                        onChange={setCode}
                        height="320px"
                      />
                    </Suspense>
                  </div>
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Optional: explain your approach (will be analyzed alongside your code)…"
                    rows={3}
                    className="w-full p-3 rounded-xl bg-muted/40 border border-border text-sm text-foreground focus:ring-2 focus:ring-primary resize-y"
                  />
                  <Button
                    onClick={submitTextAnswer}
                    disabled={loading || !code?.trim()}
                    variant="primary"
                    className="w-full !py-4 !rounded-xl flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {loading ? 'Submitting…' : 'Submit Solution'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-background/50 border border-border">
                    <AvatarInterviewer isSpeaking={isSpeaking} amplitude={amplitude} />
                  </div>
                  <div className="p-6 rounded-2xl bg-background/50 border border-border">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
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
                      <>
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
                        <div className="mt-4">
                            <ConfidenceMeter confidence={faceConfidence} />
                       </div>
                        <div className="mt-4 rounded-xl overflow-hidden border border-border/60 bg-slate-950 p-1 flex items-center justify-center">
                          <canvas
                            ref={visualizerCanvasRef}
                            className="w-full h-24 bg-slate-900 rounded-lg shadow-inner"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {!isCoding && <BodyLanguageTips currentQuestionIndex={currentQuestionIndex} />}

              {!isCoding && (
                <div className="flex gap-3 w-full">
                  {useTextInput ? (
                    <div className="flex flex-col w-full gap-3">
                      <textarea
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full min-h-[120px] p-4 rounded-xl bg-muted/50 border border-border text-foreground focus:ring-2 focus:ring-primary resize-y"
                        disabled={loading}
                      />
                      <div className="flex gap-3">
                        <Button onClick={() => setUseTextInput(false)} disabled={loading} variant="outline" className="flex-1 !py-4 !rounded-xl flex items-center justify-center gap-2">
                          <Mic className="w-4 h-4" /> Use Microphone
                        </Button>
                        <Button onClick={submitTextAnswer} disabled={loading || !textAnswer.trim()} variant="primary" className="flex-[2] !py-4 !rounded-xl flex items-center justify-center gap-2">
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          {loading ? 'Submitting...' : 'Submit Answer'}
                        </Button>
                      </div>
                    </div>
                  ) : !isRecording ? (
                    <div className="flex w-full gap-3">
                      <Button onClick={() => setUseTextInput(true)} disabled={loading || isSpeaking} variant="outline" className="flex-1 !py-4 !rounded-xl flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" /> Type Answer
                      </Button>
                      <Button onClick={startRecording} disabled={loading || isSpeaking} variant="primary" className="flex-[2] !py-4 !rounded-xl flex items-center justify-center gap-2">
                        <Mic className="w-5 h-5" />
                        {isSpeaking ? 'Wait for question...' : 'Start Recording'}
                      </Button>
                    </div>
                  ) : (
                    <button type="button" onClick={stopRecording} disabled={loading} className="flex-1 w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-foreground font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50">
                      <XCircle className="w-5 h-5" />
                      {loading ? 'Submitting...' : 'Stop & Submit'}
                    </button>
                  )}
                </div>
              )}

              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  {isCoding ? 'Submit when your solution passes the visible test cases.' : 'Complete all questions to see your feedback • No scores shown during interview'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Switch-provider modal */}
      {showSwitchProvider && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => !switchBusy && setShowSwitchProvider(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-foreground mb-2">Switch AI Provider</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Re-analyze your last answer using a different BYOK provider. Add providers in Settings first if needed.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(configuredProviders).map(([key, val]) => (
                <button type="button"
                  key={key}
                  onClick={async () => {
                    useAIConfigStore.getState().setActiveProvider(key);
                    await switchProvider();
                  }}
                  disabled={switchBusy || key === activeConfig}
                  className={
                    'w-full text-left p-3 rounded-xl border transition-colors flex items-center justify-between ' +
                    (key === activeConfig
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-muted/30 border-border text-foreground hover:border-primary/30')
                  }
                >
                  <span className="font-medium capitalize">{key}</span>
                  {key === activeConfig && <CheckCircle className="w-4 h-4" />}
                </button>
              ))}
              {Object.keys(configuredProviders).length === 0 && (
                <p className="text-sm text-muted-foreground">No providers configured. Visit Settings to add one.</p>
              )}
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSwitchProvider(false)} disabled={switchBusy}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      </>
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
    const getCommunicationRating = () => {
  if (avgClarity >= 85 && avgConfidence >= 85) return 'Excellent';
  if (avgClarity >= 75 && avgConfidence >= 75) return 'Strong';
  if (avgClarity >= 65 && avgConfidence >= 65) return 'Good';
  return 'Needs Improvement';
};

const communicationTips = [];

if (avgConfidence < 70) {
  communicationTips.push(
    'Practice speaking more confidently and reduce hesitation.'
  );
}

if (avgClarity < 70) {
  communicationTips.push(
    'Structure responses using the STAR method.'
  );
}

if (totalFillerWords > 5) {
  communicationTips.push(
    "Reduce filler words such as 'um', 'uh', and 'like'."
  );
}

if (communicationTips.length === 0) {
  communicationTips.push(
    'Excellent communication skills. Keep practicing regularly.'
  );
}

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

            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
  <h3 className="text-xl font-bold mb-2">
    Interview Readiness Score
  </h3>

  <p className="text-5xl font-bold text-primary">
    {overallResults.overallScore}%
  </p>

  <p className="text-muted-foreground mt-2">
    Based on confidence, communication, and answer quality.
  </p>
</div>

            <p className="text-lg text-muted-foreground">Here's your comprehensive performance analysis</p>
          </motion.div>
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.05 }}
  className="mb-8"
>
  <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">

    <h2 className="text-2xl font-bold mb-4">
      Adaptive Interview Progress
    </h2>

    <div className="grid md:grid-cols-2 gap-4">

      <div>
        <p className="text-muted-foreground">
          Current Level
        </p>

        <p className="text-xl font-bold">
          {progressData.level}
        </p>
      </div>

      <div>
        <p className="text-muted-foreground">
          Average Score
        </p>

        <p className="text-xl font-bold">
          {progressData.averageScore}%
        </p>
      </div>

      <div>
        <p className="text-muted-foreground">
          Interviews Completed
        </p>

        <p className="text-xl font-bold">
          {progressData.completedInterviews}
        </p>
      </div>

      <div>
        <p className="text-muted-foreground">
          Success Streak
        </p>

        <p className="text-xl font-bold">
          {progressData.streak}/3
        </p>
      </div>

    </div>

    <div className="mt-6">

      <p className="mb-2 text-sm text-muted-foreground">
        Progress To Next Level
      </p>

      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">

        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{
            width: `${progressData.streak * 33}%`
          }}
        />

      </div>

    </div>

  </div>
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
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="mb-8"
>
  <div className="p-8 rounded-3xl bg-background/50 border border-border">

    <h2 className="text-2xl font-bold mb-6">
      Communication & Confidence Analysis
    </h2>

    <div className="grid md:grid-cols-4 gap-4 mb-6">

      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-sm text-muted-foreground">
          Communication Score
        </p>
        <p className="text-3xl font-bold text-emerald-400">
          {Math.round(avgClarity)}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <p className="text-sm text-muted-foreground">
          Confidence Score
        </p>
        <p className="text-3xl font-bold text-purple-400">
          {Math.round(avgConfidence)}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <p className="text-sm text-muted-foreground">
          Filler Words
        </p>
        <p className="text-3xl font-bold text-red-400">
          {totalFillerWords}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-sm text-muted-foreground">
          Rating
        </p>
        <p className="text-xl font-bold text-amber-400">
          {getCommunicationRating()}
        </p>
      </div>

    </div>

    <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
      <h3 className="font-semibold mb-3">
        Communication Improvement Roadmap
      </h3>

      <ul className="space-y-2">
        {communicationTips.map((tip, index) => (
          <li key={index}>
            • {tip}
          </li>
        ))}
      </ul>
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
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
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
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </div>
                      <span className="text-foreground/90">{a}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.35 }}
  className="mb-8"
>
  <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20">

    <h2 className="text-2xl font-bold mb-4">
      Areas To Improve
    </h2>

    <p className="text-muted-foreground mb-5">
      Focus on these areas before your next interview.
    </p>

    <div className="space-y-3">
      {overallResults.overallFeedback?.areasToImprove?.map((item, index) => (
        <div
          key={index}
          className="p-4 rounded-xl bg-background/50 border border-border"
        >
          <div className="flex items-start gap-3">

            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />

            <span className="text-foreground">
              {item}
            </span>

          </div>
        </div>
      ))}
    </div>

  </div>
</motion.div>

            <LearningRecommendations
  areasToImprove={
    overallResults.overallFeedback?.areasToImprove || []
  }
/>
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
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-wrap gap-4">
            <Button onClick={resetInterview} variant="primary" className="flex-1 !py-5 !rounded-2xl flex items-center justify-center gap-3 !text-lg font-semibold min-w-[200px]">
              <Mic className="w-6 h-6" />
              Start New Interview
            </Button>
            <Button
              onClick={() => setShareOpen((s) => !s)}
              variant="secondary"
              className="flex-1 !py-5 !rounded-2xl flex items-center justify-center gap-3 !text-lg font-semibold min-w-[200px]"
            >
              <Share2 className="w-6 h-6" />
              Share My Score
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1 !py-5 !rounded-2xl flex items-center justify-center gap-3 !text-lg font-semibold min-w-[200px]">
              Back to Dashboard
              <ArrowRight className="w-6 h-6" />
            </Button>
          </motion.div>

          {shareOpen && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-2xl bg-card border border-border flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground flex-1 min-w-[200px]">
                Capture your score as an image and share it on LinkedIn, X/Twitter, or download it.
              </p>
              <Button onClick={handleShare} disabled={shareBusy} variant="primary" className="!py-2 !text-sm">
                {shareBusy ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Share2 className="w-4 h-4 mr-1.5" />}
                Share Image
              </Button>
              <Button onClick={handleDownloadShare} disabled={shareBusy} variant="outline" className="!py-2 !text-sm">
                <Download className="w-4 h-4 mr-1.5" />
                Download PNG
              </Button>
            </motion.div>
          )}

          {/* Offscreen card used for html2canvas capture */}
          <div style={{ position: 'fixed', left: '-99999px', top: 0 }} aria-hidden="true">
            <Suspense fallback={null}>
              <ShareCard ref={shareCardRef} interview={overallResults} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
