import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SAMPLE_VOICE_PROMPTS } from '../data/legalData';
import {
  startListening,
  stopListening,
  isListening,
  isSpeechRecognitionSupported,
  speakText,
  stopSpeaking,
  isSpeaking,
  isSpeechSynthesisSupported,
  SUPPORTED_VOICE_LANGUAGES,
  VoiceLanguage,
} from '../services/voiceService';
import { askGeminiVoiceAssistant } from '../services/geminiService';

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onUseTranscription: (text: string) => void;
  onLaunchGeminiChat?: (query: string) => void;
  initialLanguage?: string;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  visible,
  onClose,
  onUseTranscription,
  onLaunchGeminiChat,
  initialLanguage = 'EN',
}) => {
  const [selectedLang, setSelectedLang] = useState<VoiceLanguage>(
    SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === initialLanguage) || SUPPORTED_VOICE_LANGUAGES[0]
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>(SAMPLE_VOICE_PROMPTS[0]);
  const [interimText, setInterimText] = useState<string>('');
  const [waveHeights, setWaveHeights] = useState<number[]>([18, 28, 42, 35, 20, 32, 45, 24]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  // Gemini AI Voice Response state
  const [isConsultingGemini, setIsConsultingGemini] = useState<boolean>(false);
  const [geminiAnswer, setGeminiAnswer] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const waveTimerRef = useRef<any>(null);

  // Sync selected lang when initialLanguage changes or modal becomes visible
  useEffect(() => {
    if (visible) {
      const match = SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === initialLanguage);
      if (match) setSelectedLang(match);
      setGeminiAnswer(null);
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      handleStopMic();
      stopSpeaking();
      setIsPlayingAudio(false);
    }
  }, [visible, initialLanguage]);

  // Audio wave animation when recording or playing
  useEffect(() => {
    if (isRecording || isPlayingAudio) {
      waveTimerRef.current = setInterval(() => {
        setWaveHeights([
          Math.floor(Math.random() * 32) + 12,
          Math.floor(Math.random() * 46) + 16,
          Math.floor(Math.random() * 56) + 20,
          Math.floor(Math.random() * 42) + 15,
          Math.floor(Math.random() * 52) + 18,
          Math.floor(Math.random() * 44) + 14,
          Math.floor(Math.random() * 36) + 12,
          Math.floor(Math.random() * 28) + 10,
        ]);
      }, 160);
    } else {
      if (waveTimerRef.current) clearInterval(waveTimerRef.current);
      setWaveHeights([14, 20, 26, 20, 24, 18, 16, 12]);
    }

    return () => {
      if (waveTimerRef.current) clearInterval(waveTimerRef.current);
    };
  }, [isRecording, isPlayingAudio]);

  const handleStartMic = async () => {
    stopSpeaking();
    setIsPlayingAudio(false);
    setGeminiAnswer(null);
    setStatusMessage(
      Platform.OS === 'web'
        ? 'Listening to your voice... Speak now'
        : 'Recording voice from mic... Tap to finish'
    );

    const started = await startListening({
      languageBcp47: selectedLang.bcp47,
      onInterimResult: (interim) => {
        setInterimText(interim);
      },
      onFinalResult: (final) => {
        setTranscript(final);
        setInterimText('');
        setIsRecording(false);
        setStatusMessage('Voice captured successfully ✓');
      },
      onError: (err) => {
        setIsRecording(false);
        setStatusMessage(err);
      },
      onEnd: () => {
        setIsRecording(false);
      },
    });

    if (started) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  };

  const handleStopMic = async () => {
    setIsRecording(false);
    await stopListening();
    setInterimText('');
    setStatusMessage('Voice query ready. Tap "Ask Gemini AI" below.');
  };

  const handleToggleMic = () => {
    if (isRecording) {
      handleStopMic();
    } else {
      handleStartMic();
    }
  };

  // Ask Gemini AI Voice Assistant
  const handleAskGeminiVoice = async () => {
    const query = (interimText || transcript).trim();
    if (!query) return;

    handleStopMic();
    stopSpeaking();
    setIsPlayingAudio(false);
    setIsConsultingGemini(true);
    setStatusMessage('Consulting Gemini Legal AI...');

    try {
      const answer = await askGeminiVoiceAssistant(query, selectedLang.name);
      setGeminiAnswer(answer);
      setStatusMessage('Gemini Legal Guidance ready');

      // Auto-speak answer if speech synthesis is supported
      if (isSpeechSynthesisSupported()) {
        setIsPlayingAudio(true);
        speakText(answer, selectedLang.bcp47, () => {
          setIsPlayingAudio(false);
        });
      }
    } catch (err) {
      console.warn('Gemini voice error:', err);
      setStatusMessage('Could not retrieve advice. Please try again.');
    } finally {
      setIsConsultingGemini(false);
    }
  };

  // Toggle Text-to-Speech audio
  const handleToggleAudioPlay = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else if (geminiAnswer) {
      setIsPlayingAudio(true);
      speakText(geminiAnswer, selectedLang.bcp47, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleApplyToBox = () => {
    stopSpeaking();
    onUseTranscription(transcript);
    onClose();
  };

  const handleOpenFullChat = () => {
    stopSpeaking();
    const query = transcript.trim();
    onClose();
    if (onLaunchGeminiChat) {
      onLaunchGeminiChat(query);
    } else {
      onUseTranscription(query);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        handleStopMic();
        stopSpeaking();
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.badgeRow}>
                <View style={styles.livePulseDot} />
                <Text style={styles.badgeText}>Gemini Voice Assistant</Text>
              </View>
              <Text style={styles.title}>Speak Your Legal Problem</Text>
              <Text style={styles.subtitle}>
                Ask in your mother tongue. Instant rights & audio guidance.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleStopMic();
                stopSpeaking();
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Language Selector Chips */}
          <View style={styles.langChipsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SUPPORTED_VOICE_LANGUAGES.map((lang) => {
                const isCurrent = selectedLang.code === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.langChip, isCurrent && styles.activeLangChip]}
                    onPress={() => {
                      setSelectedLang(lang);
                      if (isRecording) {
                        handleStopMic();
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.langChipText,
                        isCurrent && styles.activeLangChipText,
                      ]}
                    >
                      {lang.native} ({lang.code})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Waveform & Interactive Mic Box */}
            <View style={styles.waveBox}>
              <TouchableOpacity
                style={[styles.micCircle, isRecording && styles.micCircleActive]}
                onPress={handleToggleMic}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={isRecording ? 'stop' : 'mic'}
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              {/* Soundwaves */}
              <View style={styles.waveformRow}>
                {waveHeights.map((h, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      {
                        height: h,
                        backgroundColor: isRecording
                          ? '#EF4444'
                          : isPlayingAudio
                          ? '#10B981'
                          : i % 2 === 0
                          ? '#DE6027'
                          : '#F97316',
                      },
                    ]}
                  />
                ))}
              </View>

              <Text
                style={[
                  styles.listeningStatus,
                  isRecording && styles.listeningStatusActive,
                ]}
              >
                {isRecording
                  ? 'Listening in ' + selectedLang.name + '... Tap to finish'
                  : isPlayingAudio
                  ? 'Playing audio answer...'
                  : 'Tap microphone to speak'}
              </Text>

              {statusMessage ? (
                <Text style={styles.statusSubtext}>{statusMessage}</Text>
              ) : null}
            </View>

            {/* Live Captured / Selected Voice Transcript */}
            <View style={styles.transcriptBox}>
              <View style={styles.transcriptHeader}>
                <Text style={styles.transcriptLabel}>
                  {interimText ? 'Capturing Voice...' : 'Voice Query:'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setTranscript('');
                    setInterimText('');
                    setGeminiAnswer(null);
                  }}
                >
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.transcriptText}>
                {interimText ? `"${interimText}..."` : `"${transcript}"`}
              </Text>
            </View>

            {/* Gemini Live Voice Answer Section */}
            {isConsultingGemini && (
              <View style={styles.geminiLoadingBox}>
                <ActivityIndicator size="small" color="#DE6027" />
                <Text style={styles.geminiLoadingText}>
                  Gemini is analyzing statutory Indian Law in {selectedLang.name}...
                </Text>
              </View>
            )}

            {geminiAnswer && !isConsultingGemini && (
              <View style={styles.geminiAnswerCard}>
                <View style={styles.geminiAnswerHeader}>
                  <View style={styles.geminiTitleRow}>
                    <Ionicons name="sparkles" size={16} color="#DE6027" />
                    <Text style={styles.geminiAnswerTitle}>Gemini Voice Advice</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.audioPillBtn, isPlayingAudio && styles.audioPillBtnActive]}
                    onPress={handleToggleAudioPlay}
                  >
                    <Ionicons
                      name={isPlayingAudio ? 'pause' : 'volume-high'}
                      size={14}
                      color={isPlayingAudio ? '#FFFFFF' : '#DE6027'}
                    />
                    <Text
                      style={[
                        styles.audioPillText,
                        isPlayingAudio && styles.audioPillTextActive,
                      ]}
                    >
                      {isPlayingAudio ? 'Stop' : 'Listen / सुनिए'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.geminiAnswerBody}>{geminiAnswer}</Text>

                <TouchableOpacity
                  style={styles.chatContinuationBtn}
                  onPress={handleOpenFullChat}
                >
                  <Text style={styles.chatContinuationText}>
                    Open in Full Legal Chatbot (5 Pillars & Drafts)
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#DE6027" />
                </TouchableOpacity>
              </View>
            )}

            {/* Quick Test Scenarios */}
            {!geminiAnswer && (
              <>
                <Text style={styles.sampleSectionTitle}>
                  Or choose a real-life citizen scenario:
                </Text>
                <View style={styles.sampleList}>
                  {SAMPLE_VOICE_PROMPTS.map((prompt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.sampleItem,
                        transcript === prompt && styles.selectedSampleItem,
                      ]}
                      onPress={() => {
                        stopSpeaking();
                        setTranscript(prompt);
                        setInterimText('');
                        setGeminiAnswer(null);
                      }}
                    >
                      <Ionicons
                        name={transcript === prompt ? 'radio-button-on' : 'radio-button-off'}
                        size={16}
                        color={transcript === prompt ? '#DE6027' : '#94A3B8'}
                      />
                      <Text style={styles.sampleText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          {/* Action Buttons Row */}
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity
              style={styles.askGeminiBtn}
              onPress={handleAskGeminiVoice}
              disabled={isConsultingGemini || (!transcript && !interimText)}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              <Text style={styles.askGeminiBtnText}>
                {isConsultingGemini ? 'Analyzing...' : 'Ask Gemini AI'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.useTextBtn}
              onPress={handleApplyToBox}
              activeOpacity={0.85}
            >
              <Text style={styles.useTextBtnLabel}>Use Text</Text>
              <Ionicons name="arrow-down-circle-outline" size={16} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#DE6027',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DE6027',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langChipsRow: {
    marginBottom: 12,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeLangChip: {
    backgroundColor: '#FFF7ED',
    borderColor: '#DE6027',
  },
  langChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  activeLangChipText: {
    color: '#DE6027',
    fontWeight: '700',
  },
  scrollArea: {
    maxHeight: 360,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  waveBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFEDD5',
  },
  micCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#DE6027',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#DE6027',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  micCircleActive: {
    backgroundColor: '#EF4444',
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    gap: 6,
    marginBottom: 6,
  },
  waveBar: {
    width: 5,
    borderRadius: 3,
  },
  listeningStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  listeningStatusActive: {
    color: '#DC2626',
  },
  statusSubtext: {
    fontSize: 11,
    color: '#78716C',
    marginTop: 4,
    textAlign: 'center',
  },
  transcriptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 12,
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transcriptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  transcriptText: {
    fontSize: 13.5,
    color: '#0F172A',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  geminiLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    marginTop: 12,
  },
  geminiLoadingText: {
    fontSize: 12.5,
    color: '#9A3412',
    fontWeight: '600',
  },
  geminiAnswerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    padding: 14,
    marginTop: 12,
  },
  geminiAnswerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  geminiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  geminiAnswerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  audioPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  audioPillBtnActive: {
    backgroundColor: '#DE6027',
    borderColor: '#DE6027',
  },
  audioPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DE6027',
  },
  audioPillTextActive: {
    color: '#FFFFFF',
  },
  geminiAnswerBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 10,
  },
  chatContinuationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chatContinuationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DE6027',
  },
  sampleSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
    marginBottom: 8,
  },
  sampleList: {
    gap: 6,
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedSampleItem: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  sampleText: {
    flex: 1,
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 16,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  askGeminiBtn: {
    flex: 2,
    backgroundColor: '#DE6027',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#DE6027',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  askGeminiBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  useTextBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  useTextBtnLabel: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
});
