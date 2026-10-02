import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTranslation } from '../locales/translations';

interface ProblemInputCardProps {
  value: string;
  onChangeText: (text: string) => void;
  onOpenVoice: () => void;
  onSubmitProblem: () => void;
  onOpenGeminiChat: (query?: string) => void;
  language?: string;
}

export const ProblemInputCard: React.FC<ProblemInputCardProps> = ({
  value,
  onChangeText,
  onOpenVoice,
  onSubmitProblem,
  onOpenGeminiChat,
  language = 'EN',
}) => {
  const t = getTranslation(language);
  const inputRef = useRef<TextInput>(null);

  const handleFocusType = () => {
    inputRef.current?.focus();
  };

  const SUGGESTION_PROMPTS = [
    'My landlord has not returned my security deposit even after I moved out.',
    'Delivered broken phone online, return request rejected.',
    'Employer withheld 2 months salary after resignation.',
    'UPI unauthorized debit scam of ₹15,000.',
  ];

  return (
    <View style={styles.wrapper}>

      {/* Main Input Box Card */}
      <View style={styles.card}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder="Describe your legal problem in plain language..."
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={500}
          value={value}
          onChangeText={onChangeText}
          textAlignVertical="top"
        />

        {/* Character count */}
        <Text style={styles.charCount}>{value.length}/500</Text>

        {/* Suggestion Chips */}
        {value.length === 0 && (
          <View style={styles.chipSection}>
            <Text style={styles.chipSectionLabel}>Common examples:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {SUGGESTION_PROMPTS.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  onPress={() => onChangeText(prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.promptChipText} numberOfLines={1}>
                    {prompt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Button Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.typeButton}
            onPress={handleFocusType}
            activeOpacity={0.8}
            accessibilityLabel="Type your legal problem"
          >
            <Ionicons name="keypad-outline" size={17} color="#334155" />
            <Text style={styles.typeButtonText}>{t.typeBtn}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.speakButton}
            onPress={onOpenVoice}
            activeOpacity={0.85}
            accessibilityLabel="Speak your legal problem"
          >
            <Ionicons name="mic" size={18} color="#FFFFFF" />
            <Text style={styles.speakButtonText}>{t.speakBtn}</Text>
          </TouchableOpacity>
        </View>

        {/* Action triggers when user entered text */}
        {value.trim().length > 5 && (
          <View style={styles.actionButtonsCol}>
            <TouchableOpacity
              style={styles.geminiActionBtn}
              onPress={() => onOpenGeminiChat(value)}
              activeOpacity={0.85}
            >
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              <Text style={styles.geminiActionBtnText}>{t.askLegalAi}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={onSubmitProblem}
              activeOpacity={0.85}
            >
              <Text style={styles.analyzeButtonText}>{t.view5Pillars}</Text>
              <Ionicons name="arrow-forward" size={15} color="#0F172A" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Trust Badges */}
      <View style={styles.trustBadgesRow}>
        <View style={styles.badgeItem}>
          <Ionicons name="lock-closed" size={13} color="#475569" />
          <Text style={styles.badgeText}>{t.privacyBadge}</Text>
        </View>

        <View style={styles.badgeDivider} />

        <View style={styles.badgeItem}>
          <Ionicons name="information-circle-outline" size={14} color="#475569" />
          <Text style={styles.badgeText}>{t.infoBadge}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
      },
    }),
  },
  textInput: {
    minHeight: 85,
    fontSize: 14.5,
    color: '#0F172A',
    lineHeight: 21,
    paddingTop: 0,
    paddingBottom: 4,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11.5,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 8,
  },
  chipSection: {
    marginBottom: 10,
  },
  chipSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  chipRow: {
    gap: 6,
    paddingBottom: 2,
  },
  promptChip: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: 220,
  },
  promptChipText: {
    fontSize: 11.5,
    color: '#334155',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDF2F7',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  speakButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DE6027',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#DE6027',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 3px 10px rgba(222, 96, 39, 0.25)',
        outlineStyle: 'none',
      } as any,
    }),
  },
  speakButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtonsCol: {
    marginTop: 12,
    gap: 8,
  },
  geminiActionBtn: {
    backgroundColor: '#DE6027',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#DE6027',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(222, 96, 39, 0.2)',
      },
    }),
  },
  geminiActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  analyzeButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeButtonText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  trustBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '500',
  },
  badgeDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
});
