/**
 * Safe Cross-Platform Voice Service for Kayda Sathi
 * 
 * Crash-proof design for Expo Go & Web:
 * - Zero static native module imports to prevent "Cannot find native module 'ExponentAV'" errors
 * - Web Speech API for desktop/mobile web browsers
 * - Safe optional Text-to-Speech with graceful fallback
 */
import { Platform } from 'react-native';

export interface VoiceLanguage {
  code: string;       // e.g. 'EN', 'HI', 'MR'
  bcp47: string;      // e.g. 'en-IN', 'hi-IN', 'mr-IN'
  name: string;       // e.g. 'English (India)'
  native: string;     // e.g. 'हिन्दी'
}

export const SUPPORTED_VOICE_LANGUAGES: VoiceLanguage[] = [
  { code: 'EN', bcp47: 'en-IN', name: 'English (India)', native: 'English' },
  { code: 'HI', bcp47: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'MR', bcp47: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'GU', bcp47: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'BN', bcp47: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'TA', bcp47: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
];

let webRecognitionInstance: any = null;
let isCurrentlyListening = false;

// Safely obtain Speech module if present without crashing runtime
function getSafeSpeechModule(): any {
  try {
    return require('expo-speech');
  } catch {
    return null;
  }
}

/**
 * Checks if Speech Recognition is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }
  // On mobile Expo Go, voice input operates via curated scenarios & voice simulation
  return true;
}

/**
 * Checks if Speech Synthesis (TTS) is supported
 */
export function isSpeechSynthesisSupported(): boolean {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return 'speechSynthesis' in window;
  }
  return !!getSafeSpeechModule();
}

interface StartListeningParams {
  languageBcp47?: string;
  onInterimResult?: (transcript: string) => void;
  onFinalResult: (transcript: string) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

/**
 * Starts microphone recording/recognition
 */
export async function startListening({
  languageBcp47 = 'en-IN',
  onInterimResult,
  onFinalResult,
  onError,
  onEnd,
}: StartListeningParams): Promise<boolean> {
  // Web Browser with SpeechRecognition
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError?.('Web speech recognition not available. Pick a scenario below.');
      return false;
    }

    try {
      await stopListening();

      webRecognitionInstance = new SpeechRecognition();
      webRecognitionInstance.lang = languageBcp47;
      webRecognitionInstance.continuous = false;
      webRecognitionInstance.interimResults = true;
      webRecognitionInstance.maxAlternatives = 1;

      webRecognitionInstance.onstart = () => {
        isCurrentlyListening = true;
      };

      webRecognitionInstance.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (interim && onInterimResult) {
          onInterimResult(interim);
        }
        if (final) {
          onFinalResult(final);
        }
      };

      webRecognitionInstance.onerror = (event: any) => {
        isCurrentlyListening = false;
        let msg = 'Voice recognition error';
        if (event.error === 'not-allowed') {
          msg = 'Microphone permission denied.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech detected. Please speak clearly.';
        }
        onError?.(msg);
      };

      webRecognitionInstance.onend = () => {
        isCurrentlyListening = false;
        onEnd?.();
      };

      webRecognitionInstance.start();
      return true;
    } catch (err: any) {
      console.warn('[VoiceService] Start recognition error:', err);
      onError?.(err?.message || 'Could not start mic.');
      return false;
    }
  }

  // Mobile Expo Go mode
  // Avoids native crashes; sets listening state and simulates voice detection
  isCurrentlyListening = true;
  onInterimResult?.('Listening to your voice...');
  return true;
}

/**
 * Stops Speech Recognition
 */
export async function stopListening(): Promise<{ uri?: string; base64?: string } | null> {
  isCurrentlyListening = false;

  if (webRecognitionInstance) {
    try {
      webRecognitionInstance.stop();
    } catch {
      // ignore
    }
    webRecognitionInstance = null;
  }

  return null;
}

export function isListening(): boolean {
  return isCurrentlyListening;
}

/**
 * Reads aloud text safely without throwing native errors
 */
export function speakText(
  text: string,
  languageBcp47: string = 'en-IN',
  onFinished?: () => void
): boolean {
  try {
    stopSpeaking();

    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return false;

    // 1. Try native expo-speech safely if available
    const safeSpeech = getSafeSpeechModule();
    if (safeSpeech && typeof safeSpeech.speak === 'function') {
      try {
        safeSpeech.speak(cleanText, {
          language: languageBcp47,
          rate: 0.92,
          pitch: 1.0,
          onDone: () => onFinished?.(),
          onStopped: () => onFinished?.(),
          onError: () => onFinished?.(),
        });
        return true;
      } catch (e) {
        console.warn('[VoiceService] safeSpeech.speak error:', e);
      }
    }

    // 2. Web Speech Synthesis fallback
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = languageBcp47;
      utterance.rate = 0.95;
      utterance.onend = () => onFinished?.();
      utterance.onerror = () => onFinished?.();
      window.speechSynthesis.speak(utterance);
      return true;
    }

    onFinished?.();
    return false;
  } catch (err) {
    console.warn('[VoiceService] speakText error:', err);
    onFinished?.();
    return false;
  }
}

/**
 * Stops any ongoing audio speech playback safely
 */
export function stopSpeaking(): void {
  try {
    const safeSpeech = getSafeSpeechModule();
    if (safeSpeech && typeof safeSpeech.stop === 'function') {
      safeSpeech.stop();
    }
  } catch {
    // ignore
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export async function isSpeaking(): Promise<boolean> {
  try {
    const safeSpeech = getSafeSpeechModule();
    if (safeSpeech && typeof safeSpeech.isSpeakingAsync === 'function') {
      return await safeSpeech.isSpeakingAsync();
    }
  } catch {
    // ignore
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }

  return false;
}
