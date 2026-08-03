/**
 * Supported interview languages.
 *
 * Each entry maps a short language code (used in API requests and stored on the
 * Interview document) to:
 *   - code:        the short tag sent to the backend (BCP-47 prefix)
 *   - name:        the language's own name (used in TTS voice selection)
 *   - label:       English label shown in UI dropdowns
 *   - speechLocale: BCP-47 tag passed to the browser's SpeechRecognition API
 *   - whisperHint: short hint appended to the LLM prompt so generated content
 *                  matches the requested language even when the LLM would
 *                  default to English.
 *
 * Adding a language: append a row here and update SUPPORTED_LANGUAGES.
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', label: 'English', speechLocale: 'en-US', whisperHint: 'English' },
  { code: 'es', name: 'Español', label: 'Spanish', speechLocale: 'es-ES', whisperHint: 'Spanish (Español)' },
  { code: 'fr', name: 'Français', label: 'French', speechLocale: 'fr-FR', whisperHint: 'French (Français)' },
  { code: 'de', name: 'Deutsch', label: 'German', speechLocale: 'de-DE', whisperHint: 'German (Deutsch)' },
  { code: 'it', name: 'Italiano', label: 'Italian', speechLocale: 'it-IT', whisperHint: 'Italian (Italiano)' },
  { code: 'pt', name: 'Português', label: 'Portuguese', speechLocale: 'pt-PT', whisperHint: 'Portuguese (Português)' },
  { code: 'nl', name: 'Nederlands', label: 'Dutch', speechLocale: 'nl-NL', whisperHint: 'Dutch (Nederlands)' },
  { code: 'hi', name: 'हिन्दी', label: 'Hindi', speechLocale: 'hi-IN', whisperHint: 'Hindi (हिन्दी)' },
  { code: 'ja', name: '日本語', label: 'Japanese', speechLocale: 'ja-JP', whisperHint: 'Japanese (日本語)' },
  { code: 'ko', name: '한국어', label: 'Korean', speechLocale: 'ko-KR', whisperHint: 'Korean (한국어)' },
  { code: 'zh', name: '中文', label: 'Chinese (Simplified)', speechLocale: 'zh-CN', whisperHint: 'Simplified Chinese (中文)' },
  { code: 'ar', name: 'العربية', label: 'Arabic', speechLocale: 'ar-SA', whisperHint: 'Arabic (العربية)' },
  { code: 'ru', name: 'Русский', label: 'Russian', speechLocale: 'ru-RU', whisperHint: 'Russian (Русский)' },
  { code: 'tr', name: 'Türkçe', label: 'Turkish', speechLocale: 'tr-TR', whisperHint: 'Turkish (Türkçe)' }
];

/**
 * Resolve a language row by its short code. Falls back to English when the
 * requested code is unknown so callers don't have to defensively check.
 */
export const getLanguage = (code) =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];

export const DEFAULT_LANGUAGE_CODE = 'en';
