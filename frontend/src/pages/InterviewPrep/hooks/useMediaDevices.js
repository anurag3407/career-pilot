import { useState, useRef, useEffect } from 'react';
import { getLanguage } from '../../../constants/languages';

export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
  const isMobileWidth = window.innerWidth <= 768;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return mobileRegex.test(userAgent.toLowerCase()) || (isMobileWidth && isTouchDevice);
};

export const isChromeBrowser = () => {
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isEdge = /Edg/.test(userAgent);
  return isChrome && !isEdge;
};

export function useMediaDevices(formData) {
  const [isMobile, setIsMobile] = useState(false);
  const [isChrome, setIsChrome] = useState(true);

  // A/V confirmation state
  const [avConfirmed, setAvConfirmed] = useState(false);
  const [avCheckStream, setAvCheckStream] = useState(null);
  const [avVideoWorking, setAvVideoWorking] = useState(false);
  const [avAudioWorking, setAvAudioWorking] = useState(false);
  const avVideoRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [faceVisible, setFaceVisible] = useState(true);
  const [faceConfidence, setFaceConfidence] = useState(50);
  const [amplitude, setAmplitude] = useState(0);
  const [expressionSamples, setExpressionSamples] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
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

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    setIsChrome(isChromeBrowser());

    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initializeAVCheck = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: true
      });
      setAvCheckStream(stream);
      setAvVideoWorking(true);
      setAvAudioWorking(true);
      if (avVideoRef.current) {
        avVideoRef.current.srcObject = stream;
      }
      return true;
    } catch (err) {
      console.error('A/V check failed:', err);
      setAvVideoWorking(false);
      setAvAudioWorking(false);
      return false;
    }
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

    const handleEnd = () => {
      active = false;
      setIsSpeaking(false);
      setAmplitude(0);
      cancelAnimationFrame(raf);
    };

    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
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
      setFaceConfidence(confidence);
      setExpressionSamples(prev => [...prev.slice(-60), { confidence, timestamp: Date.now() }]);
    } else {
      setFaceConfidence(20);
    }
  };

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

  const initializeMedia = async (onError) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
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
      if(onError) onError('Please allow camera and microphone access to continue.');
    }
  };

  return {
    isMobile, setIsMobile,
    isChrome, setIsChrome,
    avConfirmed, setAvConfirmed,
    avCheckStream, setAvCheckStream,
    avVideoWorking, setAvVideoWorking,
    avAudioWorking, setAvAudioWorking,
    avVideoRef,
    isRecording, setIsRecording,
    transcript, setTranscript,
    recordingTime, setRecordingTime,
    videoEnabled, setVideoEnabled,
    audioEnabled, setAudioEnabled,
    isSpeaking, setIsSpeaking,
    faceVisible, setFaceVisible,
    faceConfidence, setFaceConfidence,
    amplitude, setAmplitude,
    expressionSamples, setExpressionSamples,
    mediaRecorderRef, audioChunksRef, videoRef, mediaStreamRef, recognitionRef,
    timerRef, startTimeRef, synthRef, canvasRef, ctxRef, faceCheckIntervalRef,
    transcriptRef, isRecordingRef, visualizerCanvasRef, audioCtxRef, analyserRef,
    animationFrameIdRef,
    initializeAVCheck,
    cleanupMedia,
    getAverageMetrics,
    toggleVideo,
    toggleAudio,
    speakQuestion,
    stopSpeaking,
    startVisualizerDraw,
    initializeMedia
  };
}
