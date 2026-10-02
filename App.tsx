import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MyCasesScreen } from './src/screens/MyCasesScreen';
import { GuidesScreen } from './src/screens/GuidesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { BottomNavBar } from './src/components/BottomNavBar';
import { DraftModal } from './src/components/DraftModal';
import { LanguageModal } from './src/components/LanguageModal';
import { authService, UserProfile } from './src/services/authService';
import { TabType } from './src/types';

type AppFlow = 'onboarding' | 'login' | 'main';

function MainApp() {
  const insets = useSafeAreaInsets();
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [restoringSession, setRestoringSession] = useState(true);

  useEffect(() => authService.subscribe(user => {
    setUserProfile(user);
    if (user) setCurrentFlow('main');
    else setCurrentFlow(flow => flow === 'main' ? 'login' : flow);
    setRestoringSession(false);
  }, message => {
    setRestoringSession(false);
    Alert.alert('Sign-in unavailable', message);
  }), []);

  // Main App Tabs
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [globalDraftOpen, setGlobalDraftOpen] = useState<boolean>(false);
  const [globalLangOpen, setGlobalLangOpen] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<string>('EN');

  // Handle successful login
  const handleLoginSuccess = (user: UserProfile) => {
    setUserProfile(user);
    setCurrentFlow('main');
  };

  // Handle logout
  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setActiveTab('home');
      setGlobalDraftOpen(false);
      setGlobalLangOpen(false);
    } catch (error) {
      Alert.alert('Could not sign out', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const renderActiveTabScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigateTab={setActiveTab} />;
      case 'cases':
        return (
          <MyCasesScreen
            onBackToHome={() => setActiveTab('home')}
            onOpenDraft={() => setGlobalDraftOpen(true)}
          />
        );
      case 'guides':
        return (
          <GuidesScreen
            onBackToHome={() => setActiveTab('home')}
            onOpenCategory={() => setActiveTab('home')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onBackToHome={() => setActiveTab('home')}
            onOpenLanguage={() => setGlobalLangOpen(true)}
            userProfile={userProfile}
            onSignOut={handleSignOut}
          />
        );
      default:
        return <HomeScreen onNavigateTab={setActiveTab} />;
    }
  };

  const renderFlowScreen = () => {
    switch (currentFlow) {
      case 'onboarding':
        return (
          <OnboardingScreen
            onGetStarted={() => setCurrentFlow('login')}
            onSkip={() => setCurrentFlow('login')}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onBackToOnboarding={() => setCurrentFlow('onboarding')}
            language={currentLang}
          />
        );
      case 'main':
      default:
        return (
          <View style={styles.mainLayout}>
            {/* Active Screen View */}
            <View style={styles.screenWrapper}>{renderActiveTabScreen()}</View>

            {/* Bottom Navigation Bar */}
            <BottomNavBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              bottomInset={Platform.OS === 'web' ? 6 : insets.bottom}
            />

            {/* Global Draft Modal */}
            <DraftModal
              visible={globalDraftOpen}
              onClose={() => setGlobalDraftOpen(false)}
            />

            {/* Global Language Modal */}
            <LanguageModal
              visible={globalLangOpen}
              selectedLanguage={currentLang}
              onSelectLanguage={setCurrentLang}
              onClose={() => setGlobalLangOpen(false)}
            />
          </View>
        );
    }
  };

  return (
    <View
      style={[
        styles.rootBackground,
        currentFlow === 'onboarding' && { backgroundColor: '#FDF9F1' },
      ]}
    >
      <View
        style={[
          styles.appContainer,
          {
            paddingTop: currentFlow === 'onboarding' || Platform.OS === 'web' ? 0 : insets.top,
          },
          currentFlow === 'onboarding' && {
            maxWidth: 430,
            boxShadow: 'none',
          } as any,
        ]}
      >
        <StatusBar style="dark" />
        {restoringSession ? (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color="#DE6027" accessibilityLabel="Restoring your session" />
          </View>
        ) : renderFlowScreen()}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rootBackground: {
    flex: 1,
    backgroundColor: '#FDF9F1',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FDF9F1',
    alignSelf: 'center',
    ...Platform.select({
      web: {
        maxWidth: 440,
        height: '100%',
        boxShadow: 'none',
        overflow: 'hidden',
      } as any,
    }),
  },
  mainLayout: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
