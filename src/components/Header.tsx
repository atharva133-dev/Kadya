import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JusticeScaleLogo } from './JusticeScaleLogo';

interface HeaderProps {
  currentLanguage: string;
  onOpenLanguage: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onOpenLanguage,
  onOpenProfile,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <JusticeScaleLogo size={34} />
        <View style={styles.brandTextCol}>
          <View style={styles.titleRow}>
            <Text style={styles.brandKayda}>Kayda </Text>
            <Text style={styles.brandSathi}>Sathi</Text>
          </View>
          <Text style={styles.tagline}>Your Rights. Your Next Steps.</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={onOpenLanguage}
          activeOpacity={0.7}
          accessibilityLabel="Change Language"
        >
          <Text style={styles.languageText}>{currentLanguage}</Text>
          <Ionicons name="chevron-down" size={14} color="#334155" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={onOpenProfile}
          activeOpacity={0.7}
          accessibilityLabel="User Profile"
        >
          <Ionicons name="person-outline" size={20} color="#334155" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 14 : 10,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTextCol: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandKayda: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandSathi: {
    fontSize: 22,
    fontWeight: '800',
    color: '#DE6027',
    letterSpacing: -0.4,
  },
  tagline: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
    letterSpacing: 0.1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  languageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
