import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ProblemInputCard } from '../components/ProblemInputCard';
import { CommonLegalIssues } from '../components/CommonLegalIssues';
import { ActionCards } from '../components/ActionCards';
import { VoiceModal } from '../components/VoiceModal';
import { CategoryDetailModal } from '../components/CategoryDetailModal';
import { DraftModal } from '../components/DraftModal';
import { LegalAidModal } from '../components/LegalAidModal';
import { LanguageModal } from '../components/LanguageModal';
import { GuidanceResultModal } from '../components/GuidanceResultModal';
import { GeminiRagChatbotModal } from '../components/GeminiRagChatbotModal';
import { COMMON_LEGAL_ISSUES } from '../data/legalData';
import { LegalCategory } from '../types';

interface HomeScreenProps {
  onNavigateTab: (tab: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateTab }) => {
  const [problemText, setProblemText] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<string>('EN');

  // Modals state
  const [voiceModalVisible, setVoiceModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | null>(null);
  const [draftModalVisible, setDraftModalVisible] = useState<boolean>(false);
  const [initialDraftTemplateId, setInitialDraftTemplateId] = useState<string | undefined>(undefined);
  const [legalAidModalVisible, setLegalAidModalVisible] = useState<boolean>(false);
  const [languageModalVisible, setLanguageModalVisible] = useState<boolean>(false);
  const [guidanceModalVisible, setGuidanceModalVisible] = useState<boolean>(false);
  const [geminiChatModalVisible, setGeminiChatModalVisible] = useState<boolean>(false);
  const [activeGeminiQuery, setActiveGeminiQuery] = useState<string>('');

  // Category selection handler
  const handleSelectCategory = (category: LegalCategory) => {
    setSelectedCategory(category);
  };

  // Start draft from category
  const handleStartDraftFromCategory = (category: LegalCategory) => {
    setInitialDraftTemplateId(category.sampleDraftTemplateId);
    setDraftModalVisible(true);
  };

  const handleOpenDraftWithTemplate = (templateId: string) => {
    setInitialDraftTemplateId(templateId);
    setDraftModalVisible(true);
  };

  const handleLaunchGeminiChat = (query?: string) => {
    setActiveGeminiQuery(query || problemText || '');
    setGeminiChatModalVisible(true);
  };

  return (
    <View style={styles.screen}>
      <Header
        currentLanguage={currentLanguage}
        onOpenLanguage={() => setLanguageModalVisible(true)}
        onOpenProfile={() => onNavigateTab('profile')}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Headline & Description */}
        <HeroSection />

        {/* Problem Input Box Card & Gemini RAG Trigger */}
        <ProblemInputCard
          value={problemText}
          onChangeText={setProblemText}
          onOpenVoice={() => setVoiceModalVisible(true)}
          onSubmitProblem={() => setGuidanceModalVisible(true)}
          onOpenGeminiChat={handleLaunchGeminiChat}
        />

        {/* Common Legal Issues Grid */}
        <CommonLegalIssues
          categories={COMMON_LEGAL_ISSUES}
          onSelectCategory={handleSelectCategory}
          onSeeAll={() => onNavigateTab('guides')}
        />

        {/* Complaint Draft & Legal Aid Action Cards */}
        <ActionCards
          onOpenDrafts={() => {
            setInitialDraftTemplateId('draft-rental-deposit');
            setDraftModalVisible(true);
          }}
          onOpenLegalAid={() => setLegalAidModalVisible(true)}
        />
      </ScrollView>

      {/* Gemini RAG Chatbot Modal */}
      <GeminiRagChatbotModal
        visible={geminiChatModalVisible}
        onClose={() => setGeminiChatModalVisible(false)}
        initialQuery={activeGeminiQuery}
        onOpenDraftWithId={handleOpenDraftWithTemplate}
        onOpenHelpline={() => setLegalAidModalVisible(true)}
      />

      {/* Voice Assistant Simulation Modal */}
      <VoiceModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
        onUseTranscription={(transcript) => {
          setProblemText(transcript);
        }}
      />

      {/* Category Detail Modal (5 Pillars) */}
      <CategoryDetailModal
        category={selectedCategory}
        visible={selectedCategory !== null}
        onClose={() => setSelectedCategory(null)}
        onStartDraft={handleStartDraftFromCategory}
        onOpenHelpline={() => setLegalAidModalVisible(true)}
      />

      {/* Draft Generator Modal */}
      <DraftModal
        visible={draftModalVisible}
        initialTemplateId={initialDraftTemplateId}
        onClose={() => setDraftModalVisible(false)}
      />

      {/* Legal Aid & Helpline Modal */}
      <LegalAidModal
        visible={legalAidModalVisible}
        onClose={() => setLegalAidModalVisible(false)}
      />

      {/* Language Selector Modal */}
      <LanguageModal
        visible={languageModalVisible}
        selectedLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onClose={() => setLanguageModalVisible(false)}
      />

      {/* Legal Guidance Results Modal (5 Pillars) */}
      <GuidanceResultModal
        visible={guidanceModalVisible}
        problemText={problemText}
        onClose={() => setGuidanceModalVisible(false)}
        onOpenDraftWithId={handleOpenDraftWithTemplate}
        onOpenHelpline={() => setLegalAidModalVisible(true)}
        onSwitchToGeminiChat={handleLaunchGeminiChat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
});
