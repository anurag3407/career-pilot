import { useEffect, useState } from 'react';
import { useAIConfigStore } from '../../stores/useAIConfigStore';

/**
 * AvatarInterviewer — SVG-based animated avatar that lip-syncs to the AI's
 * spoken questions. Free, no third-party APIs, no avatar SaaS required.
 *
 * The shape (orb/square/hexagon) is derived from the active AI provider:
 *   - gemini      → glowing orb
 *   - openai      → rounded square
 *   - openrouter  → hexagon
 *   - groq        → lightning bolt
 *
 * Props:
 *   isSpeaking  - boolean, true while TTS is active
 *   amplitude   - 0..1 amplitude envelope from speechAnalyser.speakWithAmplitude
 *   provider    - active provider key (gemini|openai|openrouter|groq) — optional,
 *                 defaults to the BYOK store's active provider.
 */
const PALETTE = {
  gemini: { from: '#6366f1', to: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
  openai: { from: '#10a37f', to: '#0d8c6c', glow: 'rgba(16,163,127,0.5)' },
  openrouter: { from: '#8b5cf6', to: '#ec4899', glow: 'rgba(236,72,153,0.5)' },
  groq: { from: '#f59e0b', to: '#ef4444', glow: 'rgba(245,158,11,0.5)' }
};

const renderShape = (provider) => {
  switch (provider) {
    case 'openai':
      return (
        <rect x="40" y="40" width="120" height="120" rx="28" fill="url(#g)" />
      );
    case 'openrouter':
      return (
        <polygon points="100,20 175,60 175,140 100,180 25,140 25,60" fill="url(#g)" />
      );
    case 'groq':
      return (
        <path
          d="M70 30 L130 30 L150 80 L120 90 L150 170 L70 170 L100 90 L70 80 Z"
          fill="url(#g)"
        />
      );
    case 'gemini':
    default:
      return <circle cx="100" cy="100" r="68" fill="url(#g)" />;
  }
};

export default function AvatarInterviewer({ isSpeaking = false, amplitude = 0, provider: providerProp }) {
  const [pulse, setPulse] = useState(0);
  const activeConfig = useAIConfigStore((s) => s.activeProvider);
  const provider = providerProp || activeConfig || 'gemini';
  const colors = PALETTE[provider] || PALETTE.gemini;

  // Smooth the amplitude for a more natural mouth animation
  const mouthOpen = isSpeaking ? Math.min(1, 0.3 + amplitude * 0.9) : 0;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setPulse((p) => (p + 0.05) % (Math.PI * 2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const breathScale = 1 + Math.sin(pulse) * 0.02;
  const glowScale = isSpeaking ? 1 + amplitude * 0.35 : 1;
  const eyeY = isSpeaking ? 88 : 92;

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Outer glow halo */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-transform duration-150"
        style={{
          background: colors.glow,
          transform: `scale(${glowScale})`,
          opacity: isSpeaking ? 0.8 : 0.35
        }}
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 200 200"
        className="relative w-full h-full"
        role="img"
        aria-label={`${provider} AI interviewer avatar`}
      >
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>

        <g
          style={{
            transformOrigin: '100px 100px',
            transform: `scale(${breathScale})`,
            transition: 'transform 120ms ease-out'
          }}
        >
          {renderShape(provider)}

          {/* Eyes */}
          <circle cx={76} cy={eyeY} r="6" fill="#0f172a" />
          <circle cx={124} cy={eyeY} r="6" fill="#0f172a" />
          <circle cx={78} cy={eyeY - 2} r="2" fill="#f8fafc" />
          <circle cx={126} cy={eyeY - 2} r="2" fill="#f8fafc" />

          {/* Mouth — scales open/closed with speech amplitude */}
          <ellipse
            cx="100"
            cy="128"
            rx={10 + mouthOpen * 12}
            ry={2 + mouthOpen * 14}
            fill="#0f172a"
            style={{ transition: 'all 80ms ease-out' }}
          />

          {/* Speaking indicator ring */}
          {isSpeaking && (
            <circle
              cx="100"
              cy="100"
              r="86"
              fill="none"
              stroke={colors.to}
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity="0.5"
              style={{ animation: 'spin 6s linear infinite', transformOrigin: '100px 100px' }}
            />
          )}
        </g>
      </svg>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Status pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/70 backdrop-blur border border-border text-xs font-medium text-foreground">
        {isSpeaking ? 'AI speaking…' : 'AI interviewer'}
      </div>
    </div>
  );
}
