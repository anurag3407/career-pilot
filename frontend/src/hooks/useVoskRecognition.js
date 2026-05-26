import { useState, useRef, useCallback, useEffect } from 'react';

let voskModule = null;
let voskModel = null;

const MODEL_URL = 'https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip';

export const useVoskRecognition = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    const recognizerRef = useRef(null);
    const audioContextRef = useRef(null);
    const processorRef = useRef(null);
    const streamRef = useRef(null);
    const transcriptRef = useRef('');

    const initializeVosk = useCallback(async () => {
        if (voskModel) {
            setIsReady(true);
            return true;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!voskModule) {
                voskModule = await import('vosk-browser');
            }

            voskModel = await voskModule.createModel(MODEL_URL);
            setIsReady(true);
            setIsLoading(false);
            return true;
        } catch (err) {
            console.error('Vosk initialization error:', err);
            setError('Failed to load speech model. Using fallback.');
            setIsLoading(false);
            return false;
        }
    }, []);

    const startListening = useCallback(async () => {
        if (!voskModel) {
            const initialized = await initializeVosk();
            if (!initialized) return false;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            audioContextRef.current = new AudioContext({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);

            recognizerRef.current = new voskModel.KaldiRecognizer(16000);

            transcriptRef.current = '';
            setTranscript('');

            recognizerRef.current.on('result', (message) => {
                if (message.result && message.result.text) {
                    transcriptRef.current += message.result.text + ' ';
                    setTranscript(transcriptRef.current);
                }
            });

            recognizerRef.current.on('partialresult', (message) => {
                if (message.result && message.result.partial) {
                    setTranscript(transcriptRef.current + message.result.partial);
                }
            });

            await audioContextRef.current.audioWorklet.addModule(
                new URL('vosk-browser/dist/recognizer-processor.js', import.meta.url)
            );

            processorRef.current = new AudioWorkletNode(audioContextRef.current, 'recognizer-processor', {
                channelCount: 1,
                numberOfInputs: 1,
                numberOfOutputs: 1
            });

            processorRef.current.port.onmessage = (event) => {
                if (recognizerRef.current) {
                    recognizerRef.current.acceptWaveform(event.data);
                }
            };

            source.connect(processorRef.current);
            processorRef.current.connect(audioContextRef.current.destination);

            setIsListening(true);
            return true;
        } catch (err) {
            console.error('Start listening error:', err);
            setError('Failed to start speech recognition.');
            return false;
        }
    }, [initializeVosk]);

    const stopListening = useCallback(() => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        if (audioContextRef.current) {
            // Check if audioContext is open before closing to avoid errors
            if (audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(err => console.error("Error closing AudioContext:", err));
            }
            audioContextRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                if (track.readyState === 'live') {
                    track.stop();
                }
            });
            streamRef.current = null;
        }

        if (recognizerRef.current) {
            recognizerRef.current.remove();
            recognizerRef.current = null;
        }

        setIsListening(false);
        return transcriptRef.current.trim();
    }, []);

    const resetTranscript = useCallback(() => {
        transcriptRef.current = '';
        setTranscript('');
    }, []);

    // CRITICAL FIX: Global lifecycle cleanup mechanism
    useEffect(() => {
        // Return a cleanup wrapper that terminates background recordings if components unmount mid-session
        return () => {
            stopListening();
        };
    }, [stopListening]);

    return {
        isLoading,
        isReady,
        isListening,
        transcript,
        error,
        initializeVosk,
        startListening,
        stopListening,
        resetTranscript,
        transcriptRef
    };
};

export default useVoskRecognition;