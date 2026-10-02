import React from 'react';
import { CategoryScreen } from './CategoryScreen';
import { CategoryIssue } from '../data/categoryScreenData';

interface EmploymentScreenProps {
  onBack: () => void;
  onOpenAIAssistant: (initialQuery?: string) => void;
  onSelectIssue?: (issue: CategoryIssue) => void;
}

export const EmploymentScreen: React.FC<EmploymentScreenProps> = ({
  onBack,
  onOpenAIAssistant,
  onSelectIssue,
}) => {
  return (
    <CategoryScreen
      categoryId="employment"
      onBack={onBack}
      onOpenVoiceAssistant={(q) => onOpenAIAssistant(q || 'Employment and unpaid salary problem')}
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
