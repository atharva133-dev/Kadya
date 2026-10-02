export type TabType = 'home' | 'cases' | 'guides' | 'profile';

export interface LegalAuthority {
  name: string;
  designation: string;
  portal: string;
  helpline: string;
  description: string;
}

export interface RagCitation {
  act: string;
  section: string;
  summary: string;
}

export interface LegalCategory {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  bgColor: string;
  borderColor: string;
  iconColor: string;
  keyLaws: string[];
  commonScenarios: string[];
  immediateSteps: string[];
  requiredDocuments: string[];
  rightsAndRemedies: string[];
  appropriateAuthority: LegalAuthority;
  ragCitations: RagCitation[];
  sampleDraftTemplateId: string;
}

export interface LegalDraftTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedTime: string;
  fields: string[];
  defaultRecipient: string;
  defaultAmountOrRef: string;
  defaultFacts: string;
}

export interface HelplineResource {
  id: string;
  name: string;
  number: string;
  description: string;
  timing: string;
  type: string;
}

export interface GeminiLegalAnalysis {
  categoryTitle: string;
  identifiedIssue: string;
  confidenceScore: number;
  retrievedLaws: string[];
  rightsAndRemedies: string[];
  requiredDocuments: string[];
  suggestedNextSteps: string[];
  appropriateAuthority: LegalAuthority;
  draftTemplateId: string;
  summaryInPlainLanguage: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  analysis?: GeminiLegalAnalysis;
}
