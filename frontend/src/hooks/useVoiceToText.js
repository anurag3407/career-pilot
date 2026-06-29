/**
 * useVoiceToText — Reusable hook for Web Speech API voice-to-text.
 *
 * Implements issue #28: Voice-to-Text for Mock Interviews
 *
 * Features:
 *  - Browser / device compatibility detection
 *  - interim + final transcript accumulation
 *  - Auto-restart on network/no-speech errors
 *  - Language selection support
 *  - Exposes isListening, transcript, interimTranscript, error, isSupported
 */
import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Returns true when the Web Speech API is available in the current browser.
 */
export const isSpeechRecognitionSupported = () =>
    typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

/**
 * @param {object} options
 * @param {string}   [options.lang='en-US']        BCP-47 language tag
 * @param {boolean}  [options.continuous=true]      Keep listening until stopped
 * @param {boolean}  [options.interimResults=true]  Emit interim (non-final) results
 * @param {Function} [options.onFinalTranscript]    Called with the accumulated final string
 * @param {Function} [options.onError]              Called with an error message string
 */
export function useVoiceToText({
    lang = 'en-US',
    continuous = true,
    interimResults = true,
    onFinalTranscript,
    onError,
} = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');           // final only
    const [interimTranscript, setInterimTranscript] = useState(''); // live preview
    const [error, setError] = useState('');
    const [isSupported] = useState(isSpeechRecognitionSupported);

    const recognitionRef = useRef(null);
    const isListeningRef = useRef(false);
    const finalAccumulatorRef = useRef('');

    // Sync ref so event handlers always see current value
    useEffect(() => {
        isListeningRef.current = isListening;
    }, [isListening]);

    const stopListening = useCallback(() => {
        isListeningRef.current = false;
        setIsListening(false);
        setInterimTranscript('');

        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) { /* ignore */ }
            recognitionRef.current = null;
        }
    }, []);

    const startListening = useCallback(() => {
        if (!isSupported) {
            const msg = 'Speech recognition is not supported in this browser. Please use Chrome or Edge.';
            setError(msg);
            onError?.(msg);
            return;
        }

        if (isListeningRef.current || recognitionRef.current) {
            return; // Prevent duplicate instances on rapid re-entry
        }

        // Reset state
        finalAccumulatorRef.current = '';
        setTranscript('');
        setInterimTranscript('');
        setError('');
        isListeningRef.current = true;
        setIsListening(true);

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = lang;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;

        recognition.onresult = (event) => {
            let finalChunk = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalChunk += result[0].transcript + ' ';
                } else {
                    interim += result[0].transcript;
                }
            }

            if (finalChunk) {
                finalAccumulatorRef.current += finalChunk;
                setTranscript(finalAccumulatorRef.current);
                onFinalTranscript?.(finalAccumulatorRef.current);
            }
            setInterimTranscript(interim);
        };

        recognition.onerror = (event) => {
            // Auto-restart on transient errors
            const transient = ['no-speech', 'network', 'aborted'];
            if (isListeningRef.current && transient.includes(event.error)) {
                setTimeout(() => {
                    try { recognition.start(); } catch (_) { /* ignore */ }
                }, 150);
                return;
            }

            const messages = {
                'not-allowed': 'Microphone access denied. Please allow microphone permission in your browser settings.',
                'service-not-allowed': 'Speech service blocked. Try Chrome or Edge on desktop.',
                'audio-capture': 'No microphone detected. Please connect a microphone and try again.',
                'language-not-supported': `Language "${lang}" is not supported by your browser's speech recognition.`,
            };
            const msg = messages[event.error] || `Speech recognition error: ${event.error}`;
            setError(msg);
            onError?.(msg);
            stopListening();
        };

        recognition.onend = () => {
            if (isListeningRef.current) {
                if (continuous) {
                    // Auto-restart if continuous
                    setTimeout(() => {
                        if (!isListeningRef.current || recognitionRef.current !== recognition) return;
                        try { recognition.start(); } catch (_) { /* ignore */ }
                    }, 150);
                } else {
                    stopListening();
                }
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (err) {
            const msg = `Failed to start speech recognition: ${err.message}`;
            setError(msg);
            onError?.(msg);
            stopListening();
        }
    }, [isSupported, lang, continuous, interimResults, onFinalTranscript, onError, stopListening]);

    const resetTranscript = useCallback(() => {
        finalAccumulatorRef.current = '';
        setTranscript('');
        setInterimTranscript('');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isListeningRef.current = false;
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (_) { /* ignore */ }
            }
        };
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    };
}
