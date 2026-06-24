import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { triggerConfetti } from '../../utils/confetti';
import { interviewApi, resumeApi, uploadApi } from '../../services/api';
import { useAIConfigStore } from '../../stores/useAIConfigStore';

import { useInterviewSession } from './hooks/useInterviewSession';
import { useMediaDevices } from './hooks/useMediaDevices';
import { useLevelUp } from './hooks/useLevelUp';

import SetupForm from './components/SetupForm';
import AVCheck from './components/AVCheck';
import WarmupRound from './components/WarmupRound';
import DeviceBar from './components/DeviceBar';
import QuestionCard from './components/QuestionCard';
import CodingRound from './components/CodingRound';
import FeedbackPanel from './components/FeedbackPanel';
import Button from '../../components/Button';
import { Code2, Sparkles, CheckCircle } from 'lucide-react';

export default function InterviewPrep() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('setup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const [jdInput, setJdInput] = useState('');
  const [jdMode, setJdMode] = useState('none');
  const [jdLoading, setJdLoading] = useState(false);
  const [jdError, setJdError] = useState('');
  const [jdSummary, setJdSummary] = useState(null);

  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(location.state?.resumeId || 'none');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState(location.state?.resumeText || '');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const resumeInputRef = useRef(null);

  const [useTextInput, setUseTextInput] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  const [showSwitchProvider, setShowSwitchProvider] = useState(false);
  const [switchBusy, setSwitchBusy] = useState(false);

  const session = useInterviewSession();
  const media = useMediaDevices(formData);
  const levelUp = useLevelUp();

  const activeConfig = useAIConfigStore((s) => s.activeProvider);
  const configuredProviders = useAIConfigStore((s) => s.providers);

  useEffect(() => {
    if (media.isMobile) setUseTextInput(true);
  }, [media.isMobile]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const activeCfg = useAIConfigStore.getState().getActiveConfig();
      const hasStoreKey = !!activeCfg?.apiKey;
      const legacyConfigStr = localStorage.getItem('aiConfig');
      let hasLegacyKey = false;
      try { hasLegacyKey = legacyConfigStr && JSON.parse(legacyConfigStr).apiKey; } catch (e) {}
      const hasOpenRouterKey = localStorage.getItem('openRouterApiKey');
      
      if (!hasStoreKey && !hasLegacyKey && !hasOpenRouterKey) {
        navigate('/settings?tab=ai&return_url=/interview-prep');
        return;
      }

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
    if (step === 'interview') media.initializeMedia((errStr) => setError(errStr));
    return () => {
      media.cleanupMedia();
      if (media.synthRef.current) media.synthRef.current.cancel();
    };
  }, [step]);

  useEffect(() => {
    if (step !== 'av-check' && media.avCheckStream) {
      media.avCheckStream.getTracks().forEach(track => track.stop());
      media.setAvCheckStream(null);
    }
  }, [step, media.avCheckStream]);

  useEffect(() => {
    if (step === 'interview' && session.questions.length > 0) {
      media.speakQuestion(session.questions[session.currentQuestionIndex]?.question);
    }
  }, [session.currentQuestionIndex, step, session.questions]);

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

  const handleResumeSelect = (e) => {
    const id = e.target.value;
    setSelectedResumeId(id);
    if (id === 'none' || id === 'upload') {
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

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setResumeError('Please upload a PDF file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File size must be less than 5MB');
      return;
    }
    try {
      setResumeLoading(true);
      setResumeError('');
      const response = await uploadApi.extractText(file);
      const extractedText = response.data?.text || response.text || '';
      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error('Could not extract text from PDF.');
      }
      setResumeText(extractedText.trim());
      setResumeFile(file);
    } catch (err) {
      console.error('PDF extraction failed:', err);
      setResumeError(err.message || 'Failed to extract text from PDF.');
    } finally {
      setResumeLoading(false);
    }
  };

  const removeResume = () => {
    setSelectedResumeId('none');
    setResumeFile(null);
    setResumeText('');
    setResumeError('');
    if (resumeInputRef.current) resumeInputRef.current.value = '';
  };

  const confirmAVAndStart = () => {
    if (!media.avVideoWorking || !media.avAudioWorking) {
      setError('Please ensure both camera and microphone are working before continuing.');
      return;
    }
    if (media.avCheckStream) {
      media.avCheckStream.getTracks().forEach(track => track.stop());
      media.setAvCheckStream(null);
    }
    media.setAvConfirmed(true);
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
      const response = await interviewApi.startInterview({
        ...formData,
        resumeText: resumeText || null,
        jobDescriptionText: jdSummary?.jdText || null,
        companyName: formData.companyName || null,
        companyRole: formData.companyName ? formData.jobRole : null,
        skipWarmup: formData.skipWarmup || session.warmupQuestions.length > 0
      });
      session.setInterviewId(response.data.interviewId);
      session.setQuestions(response.data.questions);
      session.setCodingQuestion(response.data.codingQuestion || null);
      session.setCode(response.data.codingQuestion?.starterCode || '');
      session.setAnswersSubmitted([]);

      if (!formData.skipWarmup) {
        try {
          const wr = await interviewApi.getWarmupQuestions({
            jobRole: formData.jobRole,
            industry: formData.industry,
            language: formData.language
          });
          session.setWarmupQuestions(wr.data?.questions || []);
          session.setWarmupIndex(0);
          setStep('warmup');
        } catch (err) {
          console.warn('Warmup fetch failed, skipping:', err.message);
          setStep('av-check');
          await media.initializeAVCheck();
        }
      } else {
        setStep('av-check');
        await media.initializeAVCheck();
      }
    } catch (err) {
      setError(err.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const completeWarmup = async () => {
    setStep('av-check');
    await media.initializeAVCheck();
  };

  const startRecording = () => {
    if (!media.audioEnabled) {
      setError('Please enable microphone to record your answer');
      return;
    }
    const SpeechRec = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRec) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    if (media.isSpeaking) media.stopSpeaking();

    media.setTranscript('');
    media.transcriptRef.current = '';
    media.setRecordingTime(0);
    media.startTimeRef.current = Date.now();
    media.setExpressionSamples([]);
    setError('');
    media.isRecordingRef.current = true;
    media.setIsRecording(true);

    try {
      if (media.mediaStreamRef.current) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        media.audioCtxRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(media.mediaStreamRef.current);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        media.analyserRef.current = analyser;
        source.connect(analyser);
        setTimeout(() => {
          if (media.visualizerCanvasRef.current) {
            media.startVisualizerDraw(analyser, media.visualizerCanvasRef.current);
          }
        }, 100);
      }
    } catch (visErr) {
      console.error('Failed to initialize audio visualizer:', visErr);
    }

    media.timerRef.current = setInterval(() => {
      media.setRecordingTime(Math.floor((Date.now() - media.startTimeRef.current) / 1000));
    }, 1000);

    try {
      if (media.mediaStreamRef.current && typeof MediaRecorder !== 'undefined') {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
        const recorder = mimeType ? new MediaRecorder(media.mediaStreamRef.current, { mimeType }) : new MediaRecorder(media.mediaStreamRef.current);
        media.audioChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) media.audioChunksRef.current.push(e.data);
        };
        recorder.start(1000);
        media.mediaRecorderRef.current = recorder;
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
        if (result.isFinal) finalTranscript += result[0].transcript + ' ';
        else interimTranscript += result[0].transcript;
      }
      media.transcriptRef.current = finalTranscript;
      media.setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      if (media.isRecordingRef.current && (event.error === 'no-speech' || event.error === 'network' || event.error === 'aborted')) {
        setTimeout(() => { try { recognition.start(); } catch (e) { } }, 100);
      }
    };

    recognition.onend = () => {
      if (media.isRecordingRef.current) {
        setTimeout(() => { try { recognition.start(); } catch (e) { } }, 100);
      }
    };

    recognition.start();
    media.recognitionRef.current = recognition;
  };

  const stopRecording = async () => {
    media.isRecordingRef.current = false;
    
    if (media.animationFrameIdRef.current) {
      cancelAnimationFrame(media.animationFrameIdRef.current);
      media.animationFrameIdRef.current = null;
    }
    if (media.audioCtxRef.current) {
      try {
        if (media.audioCtxRef.current.state !== 'closed') media.audioCtxRef.current.close();
      } catch (e) {}
      media.audioCtxRef.current = null;
    }
    media.analyserRef.current = null;

    if (media.recognitionRef.current) try { media.recognitionRef.current.stop(); } catch (e) { }
    media.recognitionRef.current = null;
    if (media.timerRef.current) clearInterval(media.timerRef.current);

    let audioBlob = null;
    if (media.mediaRecorderRef.current) {
      try {
        const recorder = media.mediaRecorderRef.current;
        if (recorder.state !== 'inactive') {
          await new Promise((resolve) => {
            recorder.onstop = resolve;
            try { recorder.stop(); } catch (_) { resolve(); }
          });
        }
        if (media.audioChunksRef.current.length > 0) {
          audioBlob = new Blob(media.audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        }
      } catch (e) {}
      media.mediaRecorderRef.current = null;
    }

    media.setIsRecording(false);
    const duration = Math.floor((Date.now() - media.startTimeRef.current) / 1000);
    const metrics = media.getAverageMetrics();
    const finalTranscript = media.transcriptRef.current.trim() || media.transcript.trim();

    let resolvedTranscript = finalTranscript;
    if (!resolvedTranscript && audioBlob) {
      try {
        const tr = await interviewApi.transcribe({ audioBlob, language: formData.language });
        resolvedTranscript = (tr?.data?.text || '').trim();
        if (resolvedTranscript) media.setTranscript(resolvedTranscript);
      } catch (e) {}
    }

    if (!resolvedTranscript) {
      setError('No speech recorded. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await interviewApi.submitAnswer(session.interviewId, {
        questionId: session.questions[session.currentQuestionIndex].questionId,
        transcript: resolvedTranscript,
        duration,
        expressionMetrics: metrics,
        code: formData.mode === 'coding' ? session.code : undefined,
        codingLanguage: formData.mode === 'coding' ? formData.codingLanguage : undefined,
        audioBlob
      });

      session.setAnswersSubmitted([...session.answersSubmitted, { questionIndex: session.currentQuestionIndex, transcript: resolvedTranscript, analysis: response.data.analysis }]);

      if (response.data && response.data.questions) {
        session.setQuestions(response.data.questions);
      }

      if (response.data?.answeredCount >= response.data?.totalQuestions || !response.data?.nextQuestion) {
        completeInterview();
      } else {
        session.setCurrentQuestionIndex(prev => prev + 1);
        media.setTranscript('');
        session.setCode(response.data?.codingQuestion?.starterCode || session.code);
        session.setRunResults(null);
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
      const response = await interviewApi.submitAnswer(session.interviewId, {
        questionId: session.questions[session.currentQuestionIndex].questionId,
        transcript: finalTranscript,
        duration: 30,
        expressionMetrics: { averageConfidence: 0.8, eyeContactPercentage: 80, headMovementStability: 0.8, overallExpressionScore: 80 },
        code: formData.mode === 'coding' ? session.code : undefined,
        codingLanguage: formData.mode === 'coding' ? formData.codingLanguage : undefined,
      });

      session.setAnswersSubmitted([...session.answersSubmitted, { questionIndex: session.currentQuestionIndex, transcript: finalTranscript }]);

      if (response.data && response.data.questions) {
        session.setQuestions(response.data.questions);
      }

      if (response.data?.answeredCount >= response.data?.totalQuestions || !response.data?.nextQuestion) {
        completeInterview();
      } else {
        session.setCurrentQuestionIndex(prev => prev + 1);
        setTextAnswer('');
        session.setCode(response.data?.codingQuestion?.starterCode || session.code);
        session.setRunResults(null);
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
      const response = await interviewApi.completeInterview(session.interviewId);
      levelUp.handleLevelUp(response.data.overallScore);
      session.setOverallResults(response.data);
      setStep('feedback');

      triggerConfetti({
        duration: 3500,
        particleCount: 180,
        spread: 130
      });

      media.cleanupMedia();
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

  const handleSwitchProvider = async () => {
    setSwitchBusy(true);
    setError('');
    try {
      await session.switchProvider();
      setShowSwitchProvider(false);
    } catch (err) {
      setError(err.message || 'Failed to switch provider');
    } finally {
      setSwitchBusy(false);
    }
  };

  if (step === 'setup') {
    return (
      <SetupForm
        formData={formData}
        setFormData={setFormData}
        handleStartInterview={handleStartInterview}
        loading={loading}
        error={error}
        jdMode={jdMode}
        setJdMode={setJdMode}
        jdInput={jdInput}
        setJdInput={setJdInput}
        jdLoading={jdLoading}
        jdError={jdError}
        jdSummary={jdSummary}
        setJdSummary={setJdSummary}
        parseJd={parseJd}
        selectedResumeId={selectedResumeId}
        handleResumeSelect={handleResumeSelect}
        savedResumes={savedResumes}
        resumeFile={resumeFile}
        resumeInputRef={resumeInputRef}
        handleResumeUpload={handleResumeUpload}
        resumeLoading={resumeLoading}
        removeResume={removeResume}
        resumeError={resumeError}
        resumeText={resumeText}
      />
    );
  }

  if (step === 'av-check') {
    return (
      <AVCheck
        isMobile={media.isMobile}
        isChrome={media.isChrome}
        avVideoRef={media.avVideoRef}
        avVideoWorking={media.avVideoWorking}
        avAudioWorking={media.avAudioWorking}
        error={error}
        confirmAVAndStart={confirmAVAndStart}
        setStep={setStep}
        avCheckStream={media.avCheckStream}
        setAvCheckStream={media.setAvCheckStream}
      />
    );
  }

  if (step === 'warmup') {
    return (
      <WarmupRound
        warmupQuestions={session.warmupQuestions}
        warmupIndex={session.warmupIndex}
        completeWarmup={completeWarmup}
      />
    );
  }

  if (step === 'interview') {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const progress = ((session.currentQuestionIndex + 1) / formData.questionCount) * 100;
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
                  {isCoding ? <span className="inline-flex items-center gap-1"><Code2 className="w-3.5 h-3.5" /> Coding Question</span> : `Question ${session.currentQuestionIndex + 1} of ${formData.questionCount}`}
                </span>
                <div className="flex items-center gap-3">
                  <button
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
              {!isCoding && (
                <DeviceBar
                  videoRef={media.videoRef}
                  videoEnabled={media.videoEnabled}
                  audioEnabled={media.audioEnabled}
                  isRecording={media.isRecording}
                  recordingTime={media.recordingTime}
                  isSpeaking={media.isSpeaking}
                  faceVisible={media.faceVisible}
                  toggleVideo={media.toggleVideo}
                  toggleAudio={media.toggleAudio}
                  stopSpeaking={media.stopSpeaking}
                  replayQuestion={() => media.speakQuestion(currentQuestion?.question)}
                  formatTime={formatTime}
                />
              )}

              {isCoding ? (
                <CodingRound
                  codingQuestion={session.codingQuestion}
                  questions={session.questions}
                  runResults={session.runResults}
                  formData={formData}
                  code={session.code}
                  setCode={session.setCode}
                  runCandidateCode={session.runCandidateCode}
                  isRunningCode={session.isRunningCode}
                  textAnswer={textAnswer}
                  setTextAnswer={setTextAnswer}
                  submitTextAnswer={submitTextAnswer}
                  loading={loading}
                />
              ) : (
                <QuestionCard
                  currentQuestion={currentQuestion}
                  currentQuestionIndex={session.currentQuestionIndex}
                  isSpeaking={media.isSpeaking}
                  amplitude={media.amplitude}
                  isRecording={media.isRecording}
                  faceConfidence={media.faceConfidence}
                  visualizerCanvasRef={media.visualizerCanvasRef}
                  error={error}
                  useTextInput={useTextInput}
                  setUseTextInput={setUseTextInput}
                  textAnswer={textAnswer}
                  setTextAnswer={setTextAnswer}
                  loading={loading}
                  submitTextAnswer={submitTextAnswer}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                />
              )}
            </div>
          </div>
        </div>

        {showSwitchProvider && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => !switchBusy && setShowSwitchProvider(false)}>
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-foreground mb-2">Switch AI Provider</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Re-analyze your last answer using a different BYOK provider. Add providers in Settings first if needed.
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(configuredProviders).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={async () => {
                      useAIConfigStore.getState().setActiveProvider(key);
                      await handleSwitchProvider();
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

  if (step === 'feedback' && session.overallResults) {
    return (
      <FeedbackPanel
        overallResults={session.overallResults}
        progressData={levelUp.progressData}
        formatTime={formatTime}
      />
    );
  }

  return null;
}
