import React from 'react';
import { CategoryScreen } from './CategoryScreen';
import { CategoryIssue } from '../data/categoryScreenData';

interface ConsumerScreenProps {
  onBack: () => void;
  onOpenAIAssistant: (initialQuery?: string) => void;
  onSelectIssue?: (issue: CategoryIssue) => void;
}

export const ConsumerScreen: React.FC<ConsumerScreenProps> = ({
  onBack,
  onOpenAIAssistant,
  onSelectIssue,
}) => {
  return (
    <CategoryScreen
      categoryId="consumer"
      onBack={onBack}
      onOpenVoiceAssistant={(q) => onOpenAIAssistant(q || 'Consumer dispute or defective product')}
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
