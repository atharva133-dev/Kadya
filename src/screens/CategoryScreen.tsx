import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CATEGORY_SCREENS_DATA,
  CategoryIssue,
  CategoryScreenConfig,
} from '../data/categoryScreenData';

interface CategoryScreenProps {
  categoryId: string; // 'employment' | 'consumer' | 'banking' | 'cybercrime' | 'police' | 'housing'
  onBack: () => void;
  onOpenVoiceAssistant: (initialQuery?: string) => void;
  onOpenTypeAssistant: (initialQuery?: string) => void;
  onSelectIssue: (issue: CategoryIssue) => void;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  categoryId,
  onBack,
  onOpenVoiceAssistant,
  onOpenTypeAssistant,
  onSelectIssue,
}) => {
  const config: CategoryScreenConfig =
    CATEGORY_SCREENS_DATA[categoryId] || CATEGORY_SCREENS_DATA.housing;

  return (
    <View style={styles.container}>
      {/* 1. Header: Back arrow + Kayda Sathi logo */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityLabel="Back to Home"
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          {/* Kayda Sathi Brand Mark */}
          <View style={styles.brandContainer}>
            <View style={styles.brandIconBadge}>
              <Ionicons name="shield-checkmark" size={15} color="#DE6027" />
            </View>
            <Text style={styles.brandText}>Kayda Sathi</Text>
          </View>

          {/* Right spacer for symmetrical header */}
          <View style={styles.headerRightSpacer} />
        </View>

        {/* Category Title + Subtitle */}
        <Text style={styles.categoryTitle}>{config.title}</Text>
        <Text style={styles.categorySubtitle}>{config.subtitle}</Text>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Large “Describe my problem” Card with Microphone & Text options */}
        <View style={styles.describeCard}>
          <View style={styles.describeHeaderRow}>
            <View style={styles.describeIconContainer}>
              <Ionicons name="sparkles" size={20} color="#DE6027" />
            </View>
            <View style={styles.describeTextCol}>
              <View style={styles.describeTitleRow}>
                <Text style={styles.describeTitle}>Describe my problem</Text>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>AI Assistant</Text>
                </View>
              </View>
              <Text style={styles.describeSubtitle}>
                Not sure which issue fits? Tell us what happened.
              </Text>
            </View>
          </View>

          {/* Two Input Method Options: Microphone & Text */}
          <View style={styles.inputOptionsRow}>
            <TouchableOpacity
              style={styles.speakOptionBtn}
              onPress={() => onOpenVoiceAssistant('')}
              activeOpacity={0.8}
              accessibilityLabel="Speak your problem with voice"
            >
              <View style={styles.speakIconWrapper}>
                <Ionicons name="mic" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.speakOptionText}>Speak</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.typeOptionBtn}
              onPress={() => onOpenTypeAssistant('')}
              activeOpacity={0.8}
              accessibilityLabel="Type your problem with text"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0F172A" />
              <Text style={styles.typeOptionText}>Type Problem</Text>
              <Ionicons name="arrow-forward" size={13} color="#DE6027" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. “Common Issues” Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Common Issues</Text>
          </View>
          <Text style={styles.sectionCountText}>6 issues available</Text>
        </View>

        {/* 4. 6 Selectable Issue Cards */}
        <View style={styles.issueList}>
          {config.issues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={[
                styles.issueCard,
                {
                  backgroundColor: issue.bgColor,
                  borderColor: issue.borderColor,
                },
              ]}
              onPress={() => onSelectIssue(issue)}
              activeOpacity={0.75}
              accessibilityLabel={`${issue.title}: ${issue.description}`}
            >
              {/* Line Icon Container */}
              <View
                style={[
                  styles.issueIconWrapper,
                  { backgroundColor: issue.iconBgColor },
                ]}
              >
                <Ionicons
                  name={issue.iconName}
                  size={21}
                  color={issue.iconColor}
                />
              </View>

              {/* Title & Short Description */}
              <View style={styles.issueTextCol}>
                <Text style={styles.issueTitle}>{issue.title}</Text>
                <Text style={styles.issueDescription} numberOfLines={2}>
                  {issue.description}
                </Text>
              </View>

              {/* Right-Facing Arrow */}
              <View style={styles.issueArrowWrapper}>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Civic Protection Assurance Note */}
        <View style={styles.civicNoteBox}>
          <Ionicons name="shield-checkmark-outline" size={15} color="#64748B" />
          <Text style={styles.civicNoteText}>
            Official legal awareness & action plans based on Indian statutory rights
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F1', // Warm cream background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 14,
    paddingBottom: 16,
    backgroundColor: '#FDF9F1',
    borderBottomWidth: 1,
    borderBottomColor: '#F3EDE2',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DFD4',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
        cursor: 'pointer',
      } as any,
    }),
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E7DFD4',
  },
  brandIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerRightSpacer: {
    width: 38,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A', // Deep navy
    letterSpacing: -0.4,
  },
  categorySubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 19,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FDF9F1',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  // Large "Describe my problem" card
  describeCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FED7AA', // Orange accent border
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#DE6027',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 14px rgba(222, 96, 39, 0.07)',
      },
    }),
  },
  describeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  describeIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  describeTextCol: {
    flex: 1,
  },
  describeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  describeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A', // Deep navy
  },
  aiBadge: {
    backgroundColor: '#FFF2E8',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD8BF',
  },
  aiBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DE6027', // Orange accent
  },
  describeSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
  },
  inputOptionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8F4EC',
    paddingTop: 12,
  },
  speakOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DE6027', // Primary saffron/orange
    borderRadius: 12,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#DE6027',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(222, 96, 39, 0.25)',
        cursor: 'pointer',
      } as any,
    }),
  },
  speakIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  typeOptionBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  // "Common Issues" Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DE6027',
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sectionCountText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  issueList: {
    gap: 10,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.2,
    paddingVertical: 13,
    paddingHorizontal: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
        cursor: 'pointer',
        transition: 'transform 0.12s ease',
      } as any,
    }),
  },
  issueIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  issueTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  issueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A', // Deep navy
    marginBottom: 2,
  },
  issueDescription: {
    fontSize: 12.2,
    color: '#64748B',
    lineHeight: 16.5,
  },
  issueArrowWrapper: {
    paddingLeft: 4,
  },
  civicNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 12,
  },
  civicNoteText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
});
