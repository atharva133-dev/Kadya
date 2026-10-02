import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../services/authService';

interface ProfileScreenProps {
  onBackToHome: () => void;
  onOpenLanguage: () => void;
  userProfile?: UserProfile | null;
  onSignOut?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBackToHome,
  onOpenLanguage,
  userProfile,
  onSignOut,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account & Settings</Text>
        <Text style={styles.subtitle}>Manage your legal profile and preferences</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#0F172A" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {userProfile?.displayName || 'Citizen User'}
            </Text>
            <Text style={styles.userSub}>
              {userProfile?.email
                ? userProfile.email
                : userProfile?.isAnonymous
                ? 'Guest Citizen Session'
                : 'Verified User'}
            </Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text style={styles.verifiedText}>Active</Text>
          </View>
        </View>

        {/* Security & Firebase Status */}
        <View style={styles.securityBanner}>
          <Ionicons name="shield-checkmark" size={20} color="#0D9488" />
          <View style={styles.securityBannerContent}>
            <Text style={styles.securityBannerTitle}>{userProfile?.isAnonymous ? 'Guest session' : 'Account sign-in'}</Text>
            <Text style={styles.securityBannerText}>
              {userProfile?.isAnonymous
                ? 'You are exploring with a temporary guest account. Sign in with email to keep an account across visits.'
                : 'You are signed in with Firebase Authentication. Cloud storage for drafts and cases is not connected yet.'}
            </Text>
          </View>
        </View>

        {/* Settings options */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionLabel}>Preferences</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={onOpenLanguage}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="globe-outline" size={20} color="#334155" />
              <Text style={styles.settingText}>Language / भाषा</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-outline" size={20} color="#334155" />
              <Text style={styles.settingText}>Privacy & Data Protection</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={20} color="#334155" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-buoy-outline" size={20} color="#334155" />
              <Text style={styles.settingText}>About Kayda Sathi</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Sign Out Button */}
          {onSignOut && (
            <TouchableOpacity
              style={[styles.settingRow, styles.signOutRow]}
              onPress={onSignOut}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text style={styles.signOutText}>Sign Out / Switch Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#DC2626" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.homeLink} onPress={onBackToHome}>
          <Ionicons name="arrow-back" size={16} color="#64748B" />
          <Text style={styles.homeLinkText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  body: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  userSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  securityBannerContent: {
    flex: 1,
  },
  securityBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  securityBannerText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
    marginTop: 2,
  },
  settingsSection: {
    marginTop: 4,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  signOutRow: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
    marginTop: 6,
  },
  signOutText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '700',
  },
  homeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  homeLinkText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
});
