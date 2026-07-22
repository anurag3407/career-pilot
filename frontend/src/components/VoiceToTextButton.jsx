/**
 * VoiceToTextButton — Reusable microphone toggle button with live transcript display.
 *
 * Implements issue #28: Voice-to-Text for Mock Interviews
 *
 * Props:
 *  onTranscriptChange  (string) => void   Called whenever transcript updates
 *  lang                string             BCP-47 language tag (default 'en-US')
 *  placeholder         string             Hint text shown in empty textarea
 *  disabled            boolean            Disable the button externally
 *  className           string             Extra Tailwind classes for the wrapper
 *  showTranscript      boolean            Whether to render the transcript textarea (default true)
 *  size                'sm'|'md'|'lg'     Button size preset (default 'md')
 */
import { useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Loader2 } from 'lucide-react';
import { useVoiceToText, isSpeechRecognitionSupported } from '../hooks/useVoiceToText';

const SIZE = {
    sm: { btn: 'p-2', icon: 'w-4 h-4', pulse: 'w-8 h-8' },
    md: { btn: 'p-3', icon: 'w-5 h-5', pulse: 'w-10 h-10' },
    lg: { btn: 'p-4', icon: 'w-6 h-6', pulse: 'w-12 h-12' },
};

export default function VoiceToTextButton({
    onTranscriptChange,
    lang = 'en-US',
    placeholder = 'Your spoken answer will appear here…',
    disabled = false,
    className = '',
    showTranscript = true,
    size = 'md',
}) {
    const s = SIZE[size] || SIZE.md;

    const handleFinal = useCallback(
        (text) => onTranscriptChange?.(text),
        [onTranscriptChange]
    );

    const {
        isListening,
        transcript,
        interimTranscript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    } = useVoiceToText({ lang, onFinalTranscript: handleFinal });

    const toggle = () => {
        if (disabled) return;
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            startListening();
        }
    };

    const displayText = transcript + interimTranscript;

    // Not supported — show a static badge
    if (!isSpeechRecognitionSupported()) {
        return (
            <div className={`flex items-center gap-2 text-sm text-amber-400 ${className}`}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Voice input requires Chrome or Edge on desktop.</span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {/* Button row */}
            <div className="flex items-center gap-3">
                {/* Outer pulse ring when listening */}
                <div className="relative flex-shrink-0">
                    {isListening && (
                        <span
                            className={`absolute inset-0 rounded-full bg-red-500/30 animate-ping ${s.pulse}`}
                            aria-hidden="true"
                        />
                    )}
                    <button
                        type="button"
                        onClick={toggle}
                        disabled={disabled}
                        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                        aria-pressed={isListening}
                        className={[
                            s.btn,
                            'relative rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                            disabled
                                ? 'opacity-40 cursor-not-allowed bg-muted'
                                : isListening
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600'
                                    : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20',
                        ].join(' ')}
                    >
                        {isListening
                            ? <MicOff className={s.icon} />
                            : <Mic className={s.icon} />
                        }
                    </button>
                </div>

                {/* Status label */}
                <span className={`text-sm font-medium ${isListening ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {isListening ? (
                        <span className="flex items-center gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Listening…
                        </span>
                    ) : transcript
                        ? 'Click mic to re-record'
                        : 'Click mic to speak your answer'
                    }
                </span>

                {/* Clear button */}
                {transcript && !isListening && (
                    <button
                        type="button"
                        onClick={() => { resetTranscript(); onTranscriptChange?.(''); }}
                        className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                        aria-label="Clear transcript"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Transcript area */}
            {showTranscript && (
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="false"
                    className={[
                        'min-h-[80px] rounded-xl border p-4 text-sm leading-relaxed transition-colors',
                        isListening
                            ? 'border-red-500/40 bg-red-500/5'
                            : displayText
                                ? 'border-border bg-muted/40'
                                : 'border-dashed border-border/60 bg-transparent',
                    ].join(' ')}
                >
                    {displayText ? (
                        <>
                            <span className="text-foreground">{transcript}</span>
                            {interimTranscript && (
                                <span className="text-muted-foreground italic">{interimTranscript}</span>
                            )}
                        </>
                    ) : (
                        <span className="text-muted-foreground/60">{placeholder}</span>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
                >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
