import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACTION_DRAFTS } from '../data/legalData';
import { LegalDraftTemplate } from '../types';

interface DraftModalProps {
  visible: boolean;
  onClose: () => void;
  initialTemplateId?: string;
}

export const DraftModal: React.FC<DraftModalProps> = ({
  visible,
  onClose,
  initialTemplateId,
}) => {
  const getInitialTemplate = () => {
    return ACTION_DRAFTS.find((d) => d.id === initialTemplateId) || ACTION_DRAFTS[0];
  };

  const [selectedTemplate, setSelectedTemplate] = useState<LegalDraftTemplate>(getInitialTemplate());
  const [recipientName, setRecipientName] = useState<string>(selectedTemplate.defaultRecipient);
  const [amountOrRef, setAmountOrRef] = useState<string>(selectedTemplate.defaultAmountOrRef);
  const [facts, setFacts] = useState<string>(selectedTemplate.defaultFacts);
  const [complainantName, setComplainantName] = useState<string>('Complainant Name');
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      const tmpl = getInitialTemplate();
      setSelectedTemplate(tmpl);
      setRecipientName(tmpl.defaultRecipient);
      setAmountOrRef(tmpl.defaultAmountOrRef);
      setFacts(tmpl.defaultFacts);
      setGeneratedDraft(null);
    }
  }, [visible, initialTemplateId]);

  const handleSelectTemplate = (template: LegalDraftTemplate) => {
    setSelectedTemplate(template);
    setRecipientName(template.defaultRecipient);
    setAmountOrRef(template.defaultAmountOrRef);
    setFacts(template.defaultFacts);
    setGeneratedDraft(null);
  };

  const handleGenerate = () => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const draftText = `LEGAL NOTICE / FORMAL DEMAND
Date: ${today}

To:
${recipientName}

Subject: STATUTORY LEGAL DEMAND NOTICE REGARDING ${selectedTemplate.title.toUpperCase()}
Reference / Amount Involved: ${amountOrRef}

Sir/Madam,

Under instructions from and on behalf of my client ${complainantName} (hereinafter referred to as "the Complainant"), I hereby serve you with this formal legal notice regarding the matter outlined below:

1. STATEMENT OF FACTS:
${facts}

2. STATUTORY LEGAL VIOLATION:
The aforesaid refusal and non-compliance constitutes an unlawful act and breach of statutory obligations under governing Indian laws, including the Indian Contract Act, 1872, the Model Tenancy Act, and the Consumer Protection Act, 2019.

3. REQUISITE STATUTORY RELIEF:
You are hereby called upon to settle/pay the aforementioned sum of ${amountOrRef} along with statutory interest @ 18% p.a. within 15 (fifteen) days from the receipt of this notice, failing which the Complainant shall be constrained to initiate appropriate legal proceedings before the competent Judicial Court / Statutory Commission at your sole risk, cost, and legal consequence.

Copy preserved for official court record and evidentiary production.

Yours faithfully,
${complainantName}
Authorized Signatory / Complainant
(Draft generated via Kayda Sathi - Legal Companion App)`;

    setGeneratedDraft(draftText);
    setCopied(false);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    if (Platform.OS === 'web') {
      try {
        navigator.clipboard.writeText(generatedDraft || '');
      } catch (e) {}
    } else {
      Alert.alert('Notice Copied', 'Draft copied to clipboard ready to send via WhatsApp or Email.');
    }
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
              <Text style={styles.title}>Customizable Complaint & Notice Draft</Text>
              <Text style={styles.subtitle}>
                Pre-filled legal formats compliant with Indian court notice rules
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Template Selector Pills */}
            <Text style={styles.sectionLabel}>Select Template:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templateScroll}
            >
              {ACTION_DRAFTS.map((t) => {
                const isSelected = selectedTemplate.id === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.templatePill,
                      isSelected && styles.templatePillActive,
                    ]}
                    onPress={() => handleSelectTemplate(t)}
                  >
                    <Text
                      style={[
                        styles.templatePillText,
                        isSelected && styles.templatePillTextActive,
                      ]}
                    >
                      {t.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {!generatedDraft ? (
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Your Name (Complainant):</Text>
                <TextInput
                  style={styles.textInput}
                  value={complainantName}
                  onChangeText={setComplainantName}
                  placeholder="Enter your full name"
                />

                <Text style={styles.inputLabel}>Opposite Party / Recipient Name & Address:</Text>
                <TextInput
                  style={styles.textInput}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  placeholder="e.g. Landlord Name / Company Grievance Officer"
                />

                <Text style={styles.inputLabel}>Claim Amount or Dispute Reference:</Text>
                <TextInput
                  style={styles.textInput}
                  value={amountOrRef}
                  onChangeText={setAmountOrRef}
                  placeholder="e.g. ₹40,000 / Order #99102"
                />

                <Text style={styles.inputLabel}>Facts & Sequence of Events:</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={facts}
                  onChangeText={setFacts}
                  multiline
                  placeholder="Explain what happened..."
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={styles.generateBtn}
                  onPress={handleGenerate}
                  activeOpacity={0.85}
                >
                  <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.generateBtnText}>Generate Formatted Legal Notice</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.previewContainer}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewTitle}>Ready-to-Send Legal Notice</Text>
                  <TouchableOpacity
                    style={styles.copyBtn}
                    onPress={handleCopy}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={copied ? 'checkmark' : 'copy-outline'}
                      size={16}
                      color="#DE6027"
                    />
                    <Text style={styles.copyBtnText}>
                      {copied ? 'Copied!' : 'Copy Notice'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.previewBox} nestedScrollEnabled>
                  <Text style={styles.previewCodeText}>{generatedDraft}</Text>
                </ScrollView>

                <View style={styles.previewActions}>
                  <TouchableOpacity
                    style={styles.copyFullBtn}
                    onPress={handleCopy}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="copy" size={16} color="#FFFFFF" />
                    <Text style={styles.copyFullBtnText}>Copy Full Text to Clipboard</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modifyBtn}
                    onPress={() => setGeneratedDraft(null)}
                  >
                    <Ionicons name="pencil-outline" size={15} color="#475569" />
                    <Text style={styles.modifyBtnText}>Edit Details & Regenerate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
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
  title: {
    fontSize: 17,
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
    paddingTop: 12,
  },
  sectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  templateScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  templatePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  templatePillActive: {
    backgroundColor: '#FFF5EB',
    borderColor: '#FDBA74',
  },
  templatePillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  templatePillTextActive: {
    color: '#DE6027',
    fontWeight: '700',
  },
  formContainer: {
    marginTop: 4,
    paddingBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  multilineInput: {
    minHeight: 75,
  },
  generateBtn: {
    backgroundColor: '#DE6027',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  previewContainer: {
    marginTop: 6,
    paddingBottom: 24,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  copyBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#DE6027',
  },
  previewBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    maxHeight: 280,
  },
  previewCodeText: {
    fontSize: 11.5,
    color: '#1E293B',
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  previewActions: {
    marginTop: 12,
    gap: 8,
  },
  copyFullBtn: {
    backgroundColor: '#DE6027',
    borderRadius: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  copyFullBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  modifyBtnText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '600',
  },
});
