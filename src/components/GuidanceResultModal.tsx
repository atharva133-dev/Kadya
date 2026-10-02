import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyzeLegalQueryWithGemini } from '../data/legalData';
import { GeminiLegalAnalysis } from '../types';

interface GuidanceResultModalProps {
  visible: boolean;
  problemText: string;
  onClose: () => void;
  onOpenDraftWithId: (templateId: string) => void;
  onOpenHelpline: () => void;
  onSwitchToGeminiChat: (query: string) => void;
}

export const GuidanceResultModal: React.FC<GuidanceResultModalProps> = ({
  visible,
  problemText,
  onClose,
  onOpenDraftWithId,
  onOpenHelpline,
  onSwitchToGeminiChat,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<{ [doc: string]: boolean }>({});

  const analysis: GeminiLegalAnalysis = analyzeLegalQueryWithGemini(
    problemText || 'My landlord has not returned my security deposit even after I moved out.'
  );

  const toggleDoc = (doc: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.geminiBadge}>
                <Ionicons name="sparkles" size={14} color="#DE6027" />
                <Text style={styles.geminiBadgeText}>AI Legal Analysis • Gemini RAG</Text>
              </View>
              <Text style={styles.title}>Your Legal Action Plan</Text>
              <Text style={styles.subtitle}>
                Clear roadmap from "I don't know what to do" to "I know my next steps"
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* User problem quote */}
            <View style={styles.quoteCard}>
              <Text style={styles.quoteLabel}>Reported Problem:</Text>
              <Text style={styles.quoteText} numberOfLines={3}>
                "{problemText || 'My landlord has not returned my security deposit even after I moved out.'}"
              </Text>
            </View>

            {/* Identified Issue & RAG Confidence */}
            <View style={styles.identifiedCard}>
              <View style={styles.identifiedTopRow}>
                <Ionicons name="shield-checkmark" size={18} color="#0D9488" />
                <Text style={styles.identifiedIssueText}>
                  {analysis.identifiedIssue}
                </Text>
                <View style={styles.confidencePill}>
                  <Text style={styles.confidenceText}>{analysis.confidenceScore}% Match</Text>
                </View>
              </View>
              <Text style={styles.identifiedCategory}>Domain: {analysis.categoryTitle}</Text>
            </View>

            {/* Pillar 1: Applicable Rights & Remedies */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="scale-outline" size={18} color="#DE6027" />
                <Text style={styles.sectionHeading}>1. Your Rights & Legal Remedies</Text>
              </View>
              {analysis.rightsAndRemedies.map((right, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle" size={15} color="#16A34A" />
                  <Text style={styles.bulletText}>{right}</Text>
                </View>
              ))}
              <View style={styles.lawsTagBox}>
                <Text style={styles.lawsTagLabel}>Governing Statutes:</Text>
                {analysis.retrievedLaws.map((law, idx) => (
                  <View key={idx} style={styles.lawPill}>
                    <Text style={styles.lawPillText}>{law}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Pillar 2: Required Documents Checklist (Interactive) */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="checkbox-outline" size={18} color="#2563EB" />
                <Text style={styles.sectionHeading}>2. Required Documents Checklist</Text>
              </View>
              <Text style={styles.sectionSubtext}>
                Collect these documents to establish your claim:
              </Text>
              {analysis.requiredDocuments.map((doc, idx) => {
                const isChecked = !!checkedDocs[doc];
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.docItem, isChecked && styles.docItemChecked]}
                    onPress={() => toggleDoc(doc)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isChecked ? 'checkbox' : 'square-outline'}
                      size={18}
                      color={isChecked ? '#16A34A' : '#94A3B8'}
                    />
                    <Text style={[styles.docText, isChecked && styles.docTextChecked]}>
                      {doc}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pillar 3: Suggested Next Steps */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="footsteps-outline" size={18} color="#7C3AED" />
                <Text style={styles.sectionHeading}>3. Suggested Step-by-Step Action</Text>
              </View>
              {analysis.suggestedNextSteps.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepNumBadge}>
                    <Text style={styles.stepNumText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Pillar 4: Appropriate Authority to Approach */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="business-outline" size={18} color="#0D9488" />
                <Text style={styles.sectionHeading}>4. Appropriate Authority to Approach</Text>
              </View>
              <View style={styles.authorityCard}>
                <Text style={styles.authorityName}>{analysis.appropriateAuthority.name}</Text>
                <Text style={styles.authorityDesig}>Designation: {analysis.appropriateAuthority.designation}</Text>
                <Text style={styles.authorityDesc}>{analysis.appropriateAuthority.description}</Text>
                <View style={styles.authorityFooter}>
                  <Text style={styles.portalText}>🌐 {analysis.appropriateAuthority.portal}</Text>
                  <TouchableOpacity onPress={onOpenHelpline}>
                    <Text style={styles.helplineLink}>📞 {analysis.appropriateAuthority.helpline}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Gemini Interactive Follow-up CTA */}
            <TouchableOpacity
              style={styles.chatWithGeminiBanner}
              onPress={() => {
                onClose();
                onSwitchToGeminiChat(problemText);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubbles" size={20} color="#DE6027" />
              <View style={styles.chatWithGeminiContent}>
                <Text style={styles.chatWithGeminiTitle}>Have more questions?</Text>
                <Text style={styles.chatWithGeminiSubtitle}>
                  Ask Gemini RAG follow-ups like "What if I have no rent agreement?"
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#DE6027" />
            </TouchableOpacity>
          </ScrollView>

          {/* Pillar 5 & Footer: Customizable Complaint Draft */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.helplineBtn}
              onPress={() => {
                onClose();
                onOpenHelpline();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="call-outline" size={17} color="#0F172A" />
              <Text style={styles.helplineBtnText}>Free Helpline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.draftBtn}
              onPress={() => {
                onClose();
                onOpenDraftWithId(analysis.draftTemplateId);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="document-text-outline" size={17} color="#FFFFFF" />
              <Text style={styles.draftBtnText}>Customize Complaint Draft</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  geminiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  geminiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DE6027',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11.5,
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
  scrollBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  quoteCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  quoteLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  quoteText: {
    fontSize: 13,
    color: '#1E293B',
    fontStyle: 'italic',
  },
  identifiedCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    padding: 12,
    marginBottom: 16,
  },
  identifiedTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  identifiedIssueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F766E',
  },
  confidencePill: {
    backgroundColor: '#CCFBF1',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  confidenceText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F766E',
  },
  identifiedCategory: {
    fontSize: 11.5,
    color: '#334155',
    marginTop: 4,
  },
  sectionBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtext: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  lawsTagBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 4,
  },
  lawsTagLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  lawPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  lawPillText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginBottom: 5,
  },
  docItemChecked: {
    backgroundColor: '#F0FDF4',
  },
  docText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
  },
  docTextChecked: {
    color: '#16A34A',
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
  },
  stepNumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 17,
  },
  authorityCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
  },
  authorityName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  authorityDesig: {
    fontSize: 11.5,
    color: '#0D9488',
    fontWeight: '700',
    marginTop: 2,
  },
  authorityDesc: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 4,
    lineHeight: 16,
  },
  authorityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  portalText: {
    fontSize: 11,
    color: '#475569',
  },
  helplineLink: {
    fontSize: 11.5,
    color: '#DE6027',
    fontWeight: '700',
  },
  chatWithGeminiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 12,
    marginBottom: 20,
  },
  chatWithGeminiContent: {
    flex: 1,
  },
  chatWithGeminiTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C2410C',
  },
  chatWithGeminiSubtitle: {
    fontSize: 11.5,
    color: '#7C2D12',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },
  helplineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helplineBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  draftBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DE6027',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 12,
  },
  draftBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
