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
import { LegalCategory } from '../types';

interface CategoryDetailModalProps {
  category: LegalCategory | null;
  visible: boolean;
  onClose: () => void;
  onStartDraft: (category: LegalCategory) => void;
  onOpenHelpline: () => void;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  category,
  visible,
  onClose,
  onStartDraft,
  onOpenHelpline,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<{ [doc: string]: boolean }>({});

  if (!category) return null;

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
            <View style={[styles.iconBox, { backgroundColor: category.bgColor }]}>
              <Ionicons
                name={category.iconName as any}
                size={24}
                color={category.iconColor}
              />
            </View>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{category.title}</Text>
              <Text style={styles.subtitle}>{category.subtitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Pillar 1: Applicable Rights & Remedies */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="scale-outline" size={17} color="#DE6027" />
                <Text style={styles.sectionHeading}>1. Your Rights & Remedies</Text>
              </View>
              {category.rightsAndRemedies.map((right, index) => (
                <View key={index} style={styles.bulletRow}>
                  <Ionicons name="checkmark-circle" size={15} color="#16A34A" />
                  <Text style={styles.bulletText}>{right}</Text>
                </View>
              ))}
              <View style={styles.tagWrap}>
                {category.keyLaws.map((law, index) => (
                  <View key={index} style={styles.lawTag}>
                    <Text style={styles.lawTagText}>{law}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Pillar 2: Required Documents Checklist */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="checkbox-outline" size={17} color="#2563EB" />
                <Text style={styles.sectionHeading}>2. Required Documents Checklist</Text>
              </View>
              <Text style={styles.sectionSubtext}>
                Check off documents you have in hand:
              </Text>
              {category.requiredDocuments.map((doc, index) => {
                const isChecked = !!checkedDocs[doc];
                return (
                  <TouchableOpacity
                    key={index}
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

            {/* Pillar 3: Action Roadmap (Suggested Next Steps) */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="checkmark-done-circle-outline" size={17} color="#7C3AED" />
                <Text style={styles.sectionHeading}>3. Suggested Step-by-Step Action</Text>
              </View>
              {category.immediateSteps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Pillar 4: Appropriate Authority */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="business-outline" size={17} color="#0D9488" />
                <Text style={styles.sectionHeading}>4. Appropriate Authority to Approach</Text>
              </View>
              <View style={styles.authorityCard}>
                <Text style={styles.authorityName}>{category.appropriateAuthority.name}</Text>
                <Text style={styles.authorityDesig}>
                  Designation: {category.appropriateAuthority.designation}
                </Text>
                <Text style={styles.authorityDesc}>
                  {category.appropriateAuthority.description}
                </Text>
                <View style={styles.authorityFooter}>
                  <Text style={styles.portalText}>🌐 {category.appropriateAuthority.portal}</Text>
                  <TouchableOpacity onPress={onOpenHelpline}>
                    <Text style={styles.helplineLink}>📞 {category.appropriateAuthority.helpline}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions (Pillar 5) */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.helplineButton}
              onPress={() => {
                onClose();
                onOpenHelpline();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="call-outline" size={18} color="#0F172A" />
              <Text style={styles.helplineButtonText}>Helpline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.draftButton}
              onPress={() => {
                onClose();
                onStartDraft(category);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="document-text-outline" size={17} color="#FFFFFF" />
              <Text style={styles.draftButtonText}>Create Legal Notice Draft</Text>
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
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12.5,
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
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  lawTag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lawTagText: {
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
    gap: 10,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
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
  helplineButton: {
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
  helplineButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  draftButton: {
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
  draftButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
