import React from 'react';
import { CategoryScreen } from './CategoryScreen';
import { CategoryIssue } from '../data/categoryScreenData';

interface PoliceScreenProps {
  onBack: () => void;
  onOpenAIAssistant: (initialQuery?: string) => void;
  onSelectIssue?: (issue: CategoryIssue) => void;
}

export const PoliceScreen: React.FC<PoliceScreenProps> = ({
  onBack,
  onOpenAIAssistant,
  onSelectIssue,
}) => {
  return (
    <CategoryScreen
      categoryId="police"
      onBack={onBack}
      onOpenVoiceAssistant={(q) => onOpenAIAssistant(q || 'Police FIR and complaint procedure')}
      onOpenTypeAssistant={(q) => onOpenAIAssistant(q || '')}
      onSelectIssue={(issue) => {
        if (onSelectIssue) {
          onSelectIssue(issue);
        } else {
          onOpenAIAssistant(issue.sampleQuery);
        }
      }}
    />
  );
};
