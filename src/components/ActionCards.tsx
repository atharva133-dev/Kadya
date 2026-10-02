import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getTranslation } from '../locales/translations';

interface ActionCardsProps {
  onOpenDrafts: () => void;
  onOpenLegalAid: () => void;
  language?: string;
}

export const ActionCards: React.FC<ActionCardsProps> = ({
  onOpenDrafts,
  onOpenLegalAid,
  language = 'EN',
}) => {
  const t = getTranslation(language);

  return (
    <View style={styles.container}>
      {/* Draft Card */}
      <TouchableOpacity
        style={[styles.actionCard, styles.draftCard]}
        onPress={onOpenDrafts}
        activeOpacity={0.8}
        accessibilityLabel={t.draftsTitle}
      >
        <View style={styles.draftIconBox}>
          <MaterialCommunityIcons
            name="file-document-edit-outline"
            size={24}
            color="#C2410C"
          />
        </View>

        <View style={styles.contentCol}>
          <Text style={styles.cardTitle}>{t.draftsTitle}</Text>
          <Text style={styles.cardSubtitle}>{t.draftsSubtitle}</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </TouchableOpacity>

      {/* Legal Aid & Support Card */}
      <TouchableOpacity
        style={[styles.actionCard, styles.legalAidCard]}
        onPress={onOpenLegalAid}
        activeOpacity={0.8}
        accessibilityLabel={t.helplineTitle}
      >
        <View style={styles.supportIconBox}>
          <Ionicons name="headset" size={22} color="#0F172A" />
        </View>

        <View style={styles.contentCol}>
          <Text style={styles.cardTitle}>{t.helplineTitle}</Text>
          <Text style={styles.cardSubtitle}>{t.helplineSubtitle}</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 28,
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      } as any,
    }),
  },
  draftCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  legalAidCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  draftIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  supportIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contentCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
