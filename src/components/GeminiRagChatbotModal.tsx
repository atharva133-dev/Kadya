import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyzeLegalQueryWithGemini } from '../data/legalData';
import {
  askGeminiLegalAgent,
  cleanMarkdownText,
} from '../services/geminiService';
import {
  startListening,
  stopListening,
  speakText,
  stopSpeaking,
} from '../services/voiceService';
import { ChatMessage, GeminiLegalAnalysis, GeminiAgentResponse } from '../types';

interface GeminiRagChatbotModalProps {
  visible: boolean;
  onClose: () => void;
  initialQuery?: string;
  onOpenDraftWithId: (templateId: string) => void;
  onOpenHelpline: () => void;
  language?: string;
}

export const GeminiRagChatbotModal: React.FC<GeminiRagChatbotModalProps> = ({
  visible,
  onClose,
  initialQuery = '',
  onOpenDraftWithId,
  onOpenHelpline,
  language = 'EN',
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [checkedDocs, setCheckedDocs] = useState<{ [docName: string]: boolean }>({});
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize or handle initialQuery
  useEffect(() => {
    if (!visible) return;

    if (initialQuery.trim().length > 0) {
      handleUserSubmit(initialQuery);
    } else if (messages.length === 0) {
      // Welcome message from Gemini Legal Agent
      setMessages([
        {
          id: 'welcome',
          sender: 'gemini',
          text: `Namaste! I am the Kayda Sathi Legal Agent, specialized in Indian Law.

Describe your legal dispute or question. I will summarize your position without complicated jargon, identify your statutory rights, prepare an evidence checklist, outline an action roadmap, and generate a pre-filled complaint notice.`,
          timestamp: 'Just now',
        },
      ]);
    }
  }, [visible, initialQuery]);

  const handleUserSubmit = (textToSend: string) => {
    const query = cleanMarkdownText(textToSend);
    if (!query) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const langNames: Record<string, string> = {
      EN: 'English',
      HI: 'Hindi',
      MR: 'Marathi',
      GU: 'Gujarati',
      BN: 'Bengali',
      TA: 'Tamil',
    };
    const langName = langNames[language] || 'English';

    // Call Gemini Legal Agent for structured clean JSON response
    askGeminiLegalAgent(query, langName)
      .then((agentResp: GeminiAgentResponse) => {
        const geminiMsg: ChatMessage = {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: agentResp.summary,
          timestamp: 'Just now',
          agentResponse: agentResp,
        };

        setMessages((prev) => [...prev, geminiMsg]);
        setIsTyping(false);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      })
      .catch((err) => {
        console.warn('[KaydaSathi Agent] Chat submit error:', err);
        const analysis: GeminiLegalAnalysis = analyzeLegalQueryWithGemini(query);
        const geminiMsg: ChatMessage = {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: cleanMarkdownText(analysis.summaryInPlainLanguage),
          timestamp: 'Just now',
          analysis,
        };

        setMessages((prev) => [...prev, geminiMsg]);
        setIsTyping(false);
      });
  };

  const toggleDocCheck = (docName: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docName]: !prev[docName],
    }));
  };

  const QUICK_PROMPTS = [
    'My landlord has not returned my security deposit even after I moved out.',
    'E-commerce seller delivered broken phone and rejected refund.',
    'Company withheld 2 months salary and relieving letter after resignation.',
    'Lost ₹15,000 to an unauthorized UPI scam link.',
    'Police station refused to register FIR for phone theft.',
  ];

  // Voice input toggle for chat input
  const handleToggleVoiceInput = async () => {
    if (isVoiceRecording) {
      setIsVoiceRecording(false);
      await stopListening();
    } else {
      setIsVoiceRecording(true);
      await startListening({
        languageBcp47: 'en-IN',
        onInterimResult: (interim) => {
          setInputText(interim);
        },
        onFinalResult: (final) => {
          setInputText(final);
          setIsVoiceRecording(false);
        },
        onError: () => {
          setIsVoiceRecording(false);
        },
        onEnd: () => {
          setIsVoiceRecording(false);
        },
      });
    }
  };

  // Text to speech readout on Gemini message
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      stopSpeaking();
      setSpeakingMsgId(msgId);
      speakText(text, 'en-IN', () => {
        setSpeakingMsgId(null);
      });
    }
  };

  const handleClose = () => {
    stopListening();
    stopSpeaking();
    setIsVoiceRecording(false);
    setSpeakingMsgId(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.geminiBadge}>
                <Ionicons name="sparkles" size={16} color="#DE6027" />
                <Text style={styles.geminiBadgeText}>Gemini RAG</Text>
              </View>
              <View>
                <Text style={styles.title}>Kayda Sathi AI Legal Assistant</Text>
                <Text style={styles.subtitle}>
                  Grounded on Indian Statutes • Voice & 5-Pillar Plan
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeBtn}
              accessibilityLabel="Close Chatbot"
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Quick Prompts Bar */}
          <View style={styles.quickBar}>
            <Text style={styles.quickBarLabel}>Try Common Issues:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickScroll}
            >
              {QUICK_PROMPTS.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickChip}
                  onPress={() => handleUserSubmit(prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickChipText} numberOfLines={1}>
                    {prompt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Message Thread */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isUser ? styles.userRow : styles.geminiRow,
                  ]}
                >
                  {!isUser && (
                    <View style={styles.aiAvatar}>
                      <Ionicons name="sparkles" size={15} color="#FFFFFF" />
                    </View>
                  )}

                  <View
                    style={[
                      styles.messageBubble,
                      isUser ? styles.userBubble : styles.geminiBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isUser ? styles.userText : styles.geminiText,
                      ]}
                    >
                      {cleanMarkdownText(msg.text)}
                    </Text>

                    {!isUser && (
                      <TouchableOpacity
                        style={styles.bubbleSpeakBtn}
                        onPress={() => handleToggleSpeak(msg.id, cleanMarkdownText(msg.text))}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={speakingMsgId === msg.id ? 'pause-circle' : 'volume-medium-outline'}
                          size={14}
                          color={speakingMsgId === msg.id ? '#DE6027' : '#64748B'}
                        />
                        <Text
                          style={[
                            styles.bubbleSpeakText,
                            speakingMsgId === msg.id && styles.bubbleSpeakTextActive,
                          ]}
                        >
                          {speakingMsgId === msg.id ? 'Stop Audio' : 'Listen / सुनिए'}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Rich Structured Agent Response Card (Zero ** or //) */}
                    {msg.agentResponse && (
                      <View style={styles.analysisContainer}>
                        {/* Domain & Agent Confidence Pill */}
                        <View style={styles.domainPill}>
                          <Ionicons name="shield-checkmark" size={14} color="#0F766E" />
                          <Text style={styles.domainPillText}>
                            {msg.agentResponse.identifiedIssue} • {msg.agentResponse.confidenceScore}% Agent Confidence
                          </Text>
                        </View>

                        {/* Pillar 1: Core Rights */}
                        {msg.agentResponse.coreRights.length > 0 && (
                          <View style={styles.pillarSection}>
                            <View style={styles.pillarHeader}>
                              <Ionicons name="scale" size={16} color="#DE6027" />
                              <Text style={styles.pillarTitle}>1. Your Rights Under Indian Law</Text>
                            </View>
                            {msg.agentResponse.coreRights.map((right, rIdx) => (
                              <View key={rIdx} style={styles.bulletItem}>
                                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                                <Text style={styles.bulletText}>{right}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Pillar 2: Required Documents Checklist */}
                        {msg.agentResponse.requiredDocuments.length > 0 && (
                          <View style={styles.pillarSection}>
                            <View style={styles.pillarHeader}>
                              <Ionicons name="checkbox" size={16} color="#2563EB" />
                              <Text style={styles.pillarTitle}>2. Required Documents Checklist</Text>
                            </View>
                            <Text style={styles.checklistHint}>
                              Tap to check off documents you have ready:
                            </Text>
                            {msg.agentResponse.requiredDocuments.map((doc, dIdx) => {
                              const isChecked = !!checkedDocs[doc];
                              return (
                                <TouchableOpacity
                                  key={dIdx}
                                  style={[
                                    styles.docCheckRow,
                                    isChecked && styles.docCheckRowChecked,
                                  ]}
                                  onPress={() => toggleDocCheck(doc)}
                                  activeOpacity={0.7}
                                >
                                  <Ionicons
                                    name={isChecked ? 'checkbox' : 'square-outline'}
                                    size={18}
                                    color={isChecked ? '#16A34A' : '#94A3B8'}
                                  />
                                  <Text
                                    style={[
                                      styles.docCheckText,
                                      isChecked && styles.docCheckTextChecked,
                                    ]}
                                  >
                                    {doc}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}

                        {/* Pillar 3: Action Roadmap */}
                        {msg.agentResponse.actionSteps.length > 0 && (
                          <View style={styles.pillarSection}>
                            <View style={styles.pillarHeader}>
                              <Ionicons name="footsteps" size={16} color="#7C3AED" />
                              <Text style={styles.pillarTitle}>3. Step-by-Step Action Roadmap</Text>
                            </View>
                            {msg.agentResponse.actionSteps.map((step, sIdx) => (
                              <View key={sIdx} style={styles.stepBox}>
                                <Text style={styles.stepText}>{step}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Pillar 4: Authority & Helpline */}
                        <View style={styles.pillarSection}>
                          <View style={styles.pillarHeader}>
                            <Ionicons name="business" size={16} color="#0D9488" />
                            <Text style={styles.pillarTitle}>4. Appropriate Authority to Contact</Text>
                          </View>
                          <View style={styles.authorityCard}>
                            <Text style={styles.authName}>
                              {msg.agentResponse.authority.name}
                            </Text>
                            <View style={styles.authMetaRow}>
                              {msg.agentResponse.authority.portal && (
                                <View style={styles.authMetaItem}>
                                  <Ionicons name="globe-outline" size={13} color="#475569" />
                                  <Text style={styles.authMetaText}>
                                    {msg.agentResponse.authority.portal}
                                  </Text>
                                </View>
                              )}
                              <TouchableOpacity
                                style={styles.authMetaItem}
                                onPress={onOpenHelpline}
                              >
                                <Ionicons name="call" size={13} color="#DE6027" />
                                <Text style={[styles.authMetaText, { color: '#DE6027', fontWeight: '700' }]}>
                                  {msg.agentResponse.authority.helpline}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                        {/* Pillar 5: Action Draft */}
                        <View style={styles.draftCtaBox}>
                          <Text style={styles.draftCtaHint}>
                            Ready to take action? Customize your pre-filled formal notice:
                          </Text>
                          <TouchableOpacity
                            style={styles.openDraftBtn}
                            onPress={() => {
                              onClose();
                              onOpenDraftWithId(msg.agentResponse!.draftTemplateId);
                            }}
                            activeOpacity={0.85}
                          >
                            <Ionicons name="document-text" size={18} color="#FFFFFF" />
                            <Text style={styles.openDraftBtnText}>
                              Open {msg.agentResponse.recommendedDraftTitle || 'Legal Notice Draft'}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Fallback to local 5-pillar analysis if agentResponse not available */}
                    {!msg.agentResponse && msg.analysis && (
                      <View style={styles.analysisContainer}>
                        {/* Domain & Confidence Badge */}
                        <View style={styles.domainPill}>
                          <Ionicons name="shield-checkmark" size={14} color="#0F766E" />
                          <Text style={styles.domainPillText}>
                            {msg.analysis.identifiedIssue} • {msg.analysis.confidenceScore}% RAG Confidence
                          </Text>
                        </View>

                        {/* Pillar 1: Applicable Rights & Remedies */}
                        <View style={styles.pillarSection}>
                          <View style={styles.pillarHeader}>
                            <Ionicons name="scale" size={16} color="#DE6027" />
                            <Text style={styles.pillarTitle}>1. Your Rights & Remedies</Text>
                          </View>
                          {msg.analysis.rightsAndRemedies.map((right, rIdx) => (
                            <View key={rIdx} style={styles.bulletItem}>
                              <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                              <Text style={styles.bulletText}>{right}</Text>
                            </View>
                          ))}
                        </View>

                        {/* Pillar 2: Required Documents Checklist (Interactive) */}
                        <View style={styles.pillarSection}>
                          <View style={styles.pillarHeader}>
                            <Ionicons name="checkbox" size={16} color="#2563EB" />
                            <Text style={styles.pillarTitle}>2. Required Documents Checklist</Text>
                          </View>
                          <Text style={styles.checklistHint}>
                            Tap to check off documents you have ready:
                          </Text>
                          {msg.analysis.requiredDocuments.map((doc, dIdx) => {
                            const isChecked = !!checkedDocs[doc];
                            return (
                              <TouchableOpacity
                                key={dIdx}
                                style={[
                                  styles.docCheckRow,
                                  isChecked && styles.docCheckRowChecked,
                                ]}
                                onPress={() => toggleDocCheck(doc)}
                                activeOpacity={0.7}
                              >
                                <Ionicons
                                  name={isChecked ? 'checkbox' : 'square-outline'}
                                  size={18}
                                  color={isChecked ? '#16A34A' : '#94A3B8'}
                                />
                                <Text
                                  style={[
                                    styles.docCheckText,
                                    isChecked && styles.docCheckTextChecked,
                                  ]}
                                >
                                  {doc}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {/* Pillar 3: Suggested Next Steps */}
                        <View style={styles.pillarSection}>
                          <View style={styles.pillarHeader}>
                            <Ionicons name="footsteps" size={16} color="#7C3AED" />
                            <Text style={styles.pillarTitle}>3. Suggested Next Steps</Text>
                          </View>
                          {msg.analysis.suggestedNextSteps.map((step, sIdx) => (
                            <View key={sIdx} style={styles.stepBox}>
                              <Text style={styles.stepText}>{step}</Text>
                            </View>
                          ))}
                        </View>

                        {/* Pillar 4: Appropriate Authority */}
                        <View style={styles.pillarSection}>
                          <View style={styles.pillarHeader}>
                            <Ionicons name="business" size={16} color="#0D9488" />
                            <Text style={styles.pillarTitle}>4. Appropriate Authority to Approach</Text>
                          </View>
                          <View style={styles.authorityCard}>
                            <Text style={styles.authName}>
                              {msg.analysis.appropriateAuthority.name}
                            </Text>
                            <Text style={styles.authDesignation}>
                              Officer: {msg.analysis.appropriateAuthority.designation}
                            </Text>
                            <Text style={styles.authDesc}>
                              {msg.analysis.appropriateAuthority.description}
                            </Text>
                            <View style={styles.authMetaRow}>
                              <View style={styles.authMetaItem}>
                                <Ionicons name="globe-outline" size={13} color="#475569" />
                                <Text style={styles.authMetaText}>
                                  {msg.analysis.appropriateAuthority.portal}
                                </Text>
                              </View>
                              <View style={styles.authMetaItem}>
                                <Ionicons name="call" size={13} color="#DE6027" />
                                <Text style={[styles.authMetaText, { color: '#DE6027', fontWeight: '700' }]}>
                                  {msg.analysis.appropriateAuthority.helpline}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        {/* Pillar 5: Action Draft Button */}
                        <View style={styles.draftCtaBox}>
                          <Text style={styles.draftCtaHint}>
                            Ready to take action? Customize your pre-filled formal notice:
                          </Text>
                          <TouchableOpacity
                            style={styles.openDraftBtn}
                            onPress={() => {
                              onClose();
                              onOpenDraftWithId(msg.analysis!.draftTemplateId);
                            }}
                            activeOpacity={0.85}
                          >
                            <Ionicons name="document-text" size={18} color="#FFFFFF" />
                            <Text style={styles.openDraftBtnText}>
                              Open & Customize Complaint Draft
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {isTyping && (
              <View style={[styles.messageRow, styles.geminiRow]}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={15} color="#FFFFFF" />
                </View>
                <View style={[styles.messageBubble, styles.geminiBubble]}>
                  <Text style={styles.typingIndicatorText}>
                    Gemini RAG is retrieving statutes and preparing your 5-pillar roadmap...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[
                styles.voiceInputBtn,
                isVoiceRecording && styles.voiceInputBtnActive,
              ]}
              onPress={handleToggleVoiceInput}
              activeOpacity={0.8}
              accessibilityLabel="Speak message"
            >
              <Ionicons
                name={isVoiceRecording ? 'stop' : 'mic'}
                size={18}
                color={isVoiceRecording ? '#FFFFFF' : '#DE6027'}
              />
            </TouchableOpacity>

            <TextInput
              style={[
                styles.inputField,
                isVoiceRecording && styles.inputFieldRecording,
              ]}
              placeholder={isVoiceRecording ? 'Listening to voice... Speak now' : 'Ask Gemini or describe your legal issue...'}
              placeholderTextColor={isVoiceRecording ? '#DC2626' : '#94A3B8'}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleUserSubmit(inputText)}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                inputText.trim().length === 0 && styles.sendBtnDisabled,
              ]}
              onPress={() => handleUserSubmit(inputText)}
              disabled={inputText.trim().length === 0}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: Platform.OS === 'web' ? '92%' : '88%',
    maxHeight: 760,
    display: 'flex',
    flexDirection: 'column',
    ...Platform.select({
      web: {
        maxWidth: 580,
        marginHorizontal: 'auto',
        width: '100%',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.15)',
      } as any,
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  geminiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  geminiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DE6027',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  quickBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  quickScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  quickChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 260,
  },
  quickChipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  geminiRow: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DE6027',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    backgroundColor: '#0F172A',
    borderBottomRightRadius: 4,
  },
  geminiBubble: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
    flex: 1,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  geminiText: {
    color: '#1E293B',
    lineHeight: 21,
  },
  typingIndicatorText: {
    fontSize: 12.5,
    color: '#DE6027',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  analysisContainer: {
    marginTop: 14,
    gap: 12,
  },
  domainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  domainPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  pillarSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  pillarTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  checklistHint: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 5,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  docCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginBottom: 4,
  },
  docCheckRowChecked: {
    backgroundColor: '#F0FDF4',
  },
  docCheckText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
  },
  docCheckTextChecked: {
    color: '#16A34A',
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  stepBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
    marginBottom: 6,
  },
  stepText: {
    fontSize: 12,
    color: '#2E1065',
    lineHeight: 16,
  },
  authorityCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  authName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  authDesignation: {
    fontSize: 11.5,
    color: '#0D9488',
    fontWeight: '700',
    marginTop: 1,
  },
  authDesc: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 4,
    lineHeight: 16,
  },
  authMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  authMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authMetaText: {
    fontSize: 11,
    color: '#475569',
  },
  draftCtaBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDBA74',
    alignItems: 'center',
  },
  draftCtaHint: {
    fontSize: 11.5,
    color: '#9A3412',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  openDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DE6027',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
  },
  openDraftBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  inputField: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 13.5,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DE6027',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  voiceInputBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceInputBtnActive: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  inputFieldRecording: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
  },
  bubbleSpeakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  bubbleSpeakText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  bubbleSpeakTextActive: {
    color: '#DE6027',
    fontWeight: '700',
  },
});
