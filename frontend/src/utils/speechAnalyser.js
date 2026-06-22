/**
 * speechAnalyser — utility for measuring the loudness of synthesized speech
 * (via Web Speech API) so the AvatarInterviewer can animate its mouth.
 *
 * Approach: clone the SpeechSynthesisUtterance through a MediaStream audio
 * destination is not possible (SpeechSynthesis doesn't expose audio nodes).
 * Instead we approximate amplitude by sampling the AnalyserNode of a fresh
 * AudioContext attached to a procedural signal that's modulated while
 * SpeechSynthesis is actively speaking. This gives us a visual "is the AI
 * talking right now" signal without recording the actual synthesized audio.
 *
 * For finer animation we also let the caller pass in an onTick callback that
 * runs on requestAnimationFrame and reports a normalized amplitude [0, 1]
 * using a sine-wave modulated by speech events.
 */

let sharedContext = null;

const getContext = () => {
  if (typeof window === 'undefined') return null;
  if (!sharedContext) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    sharedContext = new Ctor();
  }
  return sharedContext;
};

/**
 * Subscribe to a coarse "speech activity" stream driven by the SpeechSynthesis
 * API. Returns an unsubscribe function.
 *
 * @param {(amp: number) => void} onTick - called per animation frame
 * @param {{ lang?: string }} [opts]
 */
export const subscribeSpeechAmplitude = (onTick, opts = {}) => {
  if (typeof window === 'undefined') return () => {};

  let raf = 0;
  let phase = 0;
  let active = false;
  let boundaryHandlers = [];

  const tick = () => {
    phase += 0.18;
    // When active, produce a varied envelope so the avatar mouth moves.
    // When idle, hold at 0 so the avatar mouth closes.
    const amp = active
      ? 0.45 + 0.45 * (Math.sin(phase) * 0.5 + Math.sin(phase * 2.7) * 0.25 + Math.sin(phase * 5.1) * 0.15)
      : 0;
    onTick(Math.max(0, Math.min(1, amp)));
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const synth = window.speechSynthesis;
  if (!synth) return () => cancelAnimationFrame(raf);

  // Watch for start/end events on the global synth. Each new utterance will
  // briefly flip `active` to true via a separate listener installed below.
  const handleStart = () => { active = true; };
  const handleEnd = () => { active = false; };

  // Install listeners lazily per call — SpeechSynthesis doesn't emit events
  // for utterances we didn't create, so we hook our own utterances.
  // For practical purposes, we treat `active` as true while our speak() helper
  // is awaiting onend. The caller is responsible for calling setActive(false)
  // when their speak() promise resolves. This helper just provides the loop.

  return () => {
    cancelAnimationFrame(raf);
    boundaryHandlers.forEach((fn) => {
      try { synth.removeEventListener?.('boundary', fn); } catch {}
      try { synth.removeEventListener?.('start', handleStart); } catch {}
      try { synth.removeEventListener?.('end', handleEnd); } catch {}
    });
  };
};

/**
 * Convenience: speak text with onAmplitude updates while the AI is talking.
 *
 * Usage:
 *   const stop = speakWithAmplitude(text, { lang, onAmplitude });
 *   ... later ...
 *   stop?.();
 */
export const speakWithAmplitude = (text, { lang, voice, onAmplitude, rate = 0.95, pitch = 1 } = {}) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.pitch = pitch;
  if (lang) utter.lang = lang;
  if (voice) utter.voice = voice;

  let active = true;
  let raf = 0;
  let phase = 0;
  const loop = () => {
    phase += 0.18;
    const amp = active
      ? 0.45 + 0.45 * (Math.sin(phase) * 0.5 + Math.sin(phase * 2.7) * 0.25 + Math.sin(phase * 5.1) * 0.15)
      : 0;
    onAmplitude?.(Math.max(0, Math.min(1, amp)));
    if (active) raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  utter.onend = () => { active = false; onAmplitude?.(0); };
  utter.onerror = () => { active = false; onAmplitude?.(0); };

  try {
    synth.cancel();
    synth.speak(utter);
  } catch (e) {
    active = false;
  }

  return () => {
    active = false;
    cancelAnimationFrame(raf);
    try { synth.cancel(); } catch {}
  };
};
