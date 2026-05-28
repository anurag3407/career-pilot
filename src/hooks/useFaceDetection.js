import { useState, useEffect, useRef, useCallback } from 'react';

let faceLandmarksDetectionPromise = null;

const loadTensorFlow = async () => {
    if (!faceLandmarksDetectionPromise) {
        faceLandmarksDetectionPromise = (async () => {
            const tf = await import('@tensorflow/tfjs');
            const fld = await import('@tensorflow-models/face-landmarks-detection');
            await tf.ready();
            return fld;
        })();
    }
    return faceLandmarksDetectionPromise;
};

const calculateConfidenceMetrics = (predictions, frameWidth = 640, frameHeight = 480) => {
    if (!predictions || predictions.length === 0) {
        return {
            faceDetected: false,
            confidence: 0,
            eyeContact: 0,
            headStability: 0,
            overallScore: 0
        };
    }

    const face = predictions[0];
    const keypoints = face.keypoints;

    const leftEye = keypoints.filter(k => k.name?.includes('leftEye'));
    const rightEye = keypoints.filter(k => k.name?.includes('rightEye'));
    const nose = keypoints.find(k => k.name === 'noseTip');

    let eyeContact = 70;
    if (leftEye.length > 0 && rightEye.length > 0) {
        const leftCenter = leftEye.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
        const rightCenter = rightEye.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
        leftCenter.x /= leftEye.length;
        leftCenter.y /= leftEye.length;
        rightCenter.x /= rightEye.length;
        rightCenter.y /= rightEye.length;

        const eyeDistance = Math.abs(rightCenter.x - leftCenter.x);
        const eyeSymmetry = Math.abs(leftCenter.y - rightCenter.y);
        eyeContact = Math.min(100, Math.max(0, 100 - eyeSymmetry * 2));
    }

    let headStability = 80;
    if (nose) {
        const centerX = frameWidth / 2;
        const centerY = frameHeight / 2;
        const deviation = Math.sqrt(Math.pow(nose.x - centerX, 2) + Math.pow(nose.y - centerY, 2));
        headStability = Math.max(0, 100 - deviation * 0.3);
    }

    const confidence = face.box ? Math.min(100, (face.box.width * face.box.height) / 500) : 70;

    const overallScore = Math.round((eyeContact * 0.3) + (headStability * 0.3) + (confidence * 0.4));

    return {
        faceDetected: true,
        confidence: Math.round(confidence),
        eyeContact: Math.round(eyeContact),
        headStability: Math.round(headStability),
        overallScore
    };
};

export const useFaceDetection = (videoRef, isActive = false) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metrics, setMetrics] = useState({
        faceDetected: false,
        confidence: 0,
        eyeContact: 0,
        headStability: 0,
        overallScore: 0
    });
    const [modelReady, setModelReady] = useState(false);

    const detectorRef = useRef(null);
    const animationFrameRef = useRef(null);
    const metricsHistoryRef = useRef([]);

    const initializeDetector = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const fld = await loadTensorFlow();
            const model = fld.SupportedModels.MediaPipeFaceMesh;
            const detectorConfig = {
                runtime: 'tfjs',
                refineLandmarks: true,
                maxFaces: 1
            };

            detectorRef.current = await fld.createDetector(model, detectorConfig);
            setModelReady(true);
            setIsLoading(false);
        } catch (err) {
            console.error('Failed to initialize face detector:', err);
            setError('Failed to load face detection model');
            setIsLoading(false);
        }
    }, []);

    const detectFace = useCallback(async () => {
        if (!detectorRef.current || !videoRef.current || !isActive) return;

        const video = videoRef.current;
        if (video.readyState < 2) {
            animationFrameRef.current = requestAnimationFrame(detectFace);
            return;
        }

        try {
            const predictions = await detectorRef.current.estimateFaces(video, { flipHorizontal: true });
            const frameWidth = video.videoWidth || video.clientWidth || 640;
            const frameHeight = video.videoHeight || video.clientHeight || 480;
            const newMetrics = calculateConfidenceMetrics(predictions, frameWidth, frameHeight);

            metricsHistoryRef.current.push(newMetrics);
            if (metricsHistoryRef.current.length > 30) {
                metricsHistoryRef.current.shift();
            }

            setMetrics(newMetrics);
        } catch (err) {
            console.error('Face detection error:', err);
        }

        animationFrameRef.current = requestAnimationFrame(detectFace);
    }, [videoRef, isActive]);

    const getAverageMetrics = useCallback(() => {
        const history = metricsHistoryRef.current;
        if (history.length === 0) {
            return { averageConfidence: 0, eyeContactPercentage: 0, headMovementStability: 0, overallExpressionScore: 0 };
        }

        const validHistory = history.filter(m => m.faceDetected);
        if (validHistory.length === 0) {
            return { averageConfidence: 0, eyeContactPercentage: 0, headMovementStability: 0, overallExpressionScore: 0 };
        }

        return {
            averageConfidence: Math.round(validHistory.reduce((sum, m) => sum + m.confidence, 0) / validHistory.length),
            eyeContactPercentage: Math.round(validHistory.reduce((sum, m) => sum + m.eyeContact, 0) / validHistory.length),
            headMovementStability: Math.round(validHistory.reduce((sum, m) => sum + m.headStability, 0) / validHistory.length),
            overallExpressionScore: Math.round(validHistory.reduce((sum, m) => sum + m.overallScore, 0) / validHistory.length)
        };
    }, []);

    const resetMetrics = useCallback(() => {
        metricsHistoryRef.current = [];
        setMetrics({ faceDetected: false, confidence: 0, eyeContact: 0, headStability: 0, overallScore: 0 });
    }, []);

    useEffect(() => {
        initializeDetector();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (detectorRef.current) {
                detectorRef.current.dispose?.();
            }
        };
    }, [initializeDetector]);

    useEffect(() => {
        if (isActive && modelReady) {
            detectFace();
        } else if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive, modelReady, detectFace]);

    return {
        isLoading,
        error,
        metrics,
        modelReady,
        getAverageMetrics,
        resetMetrics
    };
};

export default useFaceDetection;
