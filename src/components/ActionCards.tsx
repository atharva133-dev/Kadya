import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface ActionCardsProps {
  onOpenDrafts: () => void;
  onOpenLegalAid: () => void;
}

export const ActionCards: React.FC<ActionCardsProps> = ({
  onOpenDrafts,
  onOpenLegalAid,
}) => {
  return (
    <View style={styles.container}>
      {/* Draft Card */}
      <TouchableOpacity
        style={[styles.actionCard, styles.draftCard]}
        onPress={onOpenDrafts}
        activeOpacity={0.8}
        accessibilityLabel="Need a complaint or request draft?"
      >
        <View style={styles.draftIconBox}>
          <MaterialCommunityIcons
            name="file-document-edit-outline"
            size={24}
            color="#C2410C"
          />
        </View>

        <View style={styles.contentCol}>
          <Text style={styles.cardTitle}>Need a complaint or request draft?</Text>
          <Text style={styles.cardSubtitle}>
            Create a personalized draft in minutes.
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </TouchableOpacity>

      {/* Legal Aid & Support Card */}
      <TouchableOpacity
        style={[styles.actionCard, styles.legalAidCard]}
        onPress={onOpenLegalAid}
        activeOpacity={0.8}
        accessibilityLabel="Find Legal Aid and Support"
      >
        <View style={styles.supportIconBox}>
          <Ionicons name="headset" size={22} color="#0F172A" />
        </View>

        <View style={styles.contentCol}>
          <Text style={styles.cardTitle}>Find Legal Aid & Support</Text>
          <Text style={styles.cardSubtitle}>
            Locate authorities, legal-aid centers and helplines near you.
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 20,
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        outlineStyle: 'none',
      } as any,
    }),
  },
  draftCard: {
    backgroundColor: '#FFF5EB',
    borderColor: '#FED7AA',
  },
  legalAidCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  draftIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE8D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
});
