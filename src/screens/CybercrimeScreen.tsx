import React from 'react';
import { CategoryScreen } from './CategoryScreen';
import { CategoryIssue } from '../data/categoryScreenData';

interface CybercrimeScreenProps {
  onBack: () => void;
  onOpenAIAssistant: (initialQuery?: string) => void;
  onSelectIssue?: (issue: CategoryIssue) => void;
}

export const CybercrimeScreen: React.FC<CybercrimeScreenProps> = ({
  onBack,
  onOpenAIAssistant,
  onSelectIssue,
}) => {
  return (
    <CategoryScreen
      categoryId="cybercrime"
      onBack={onBack}
      onOpenVoiceAssistant={(q) => onOpenAIAssistant(q || 'Online scam or cybercrime fraud')}
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
