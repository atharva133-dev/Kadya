import React from 'react';
import { CategoryScreen } from './CategoryScreen';
import { CategoryIssue } from '../data/categoryScreenData';

interface HousingRentalScreenProps {
  onBack: () => void;
  onOpenAIAssistant: (initialQuery?: string) => void;
  onSelectIssue?: (issue: CategoryIssue) => void;
}

export const HousingRentalScreen: React.FC<HousingRentalScreenProps> = ({
  onBack,
  onOpenAIAssistant,
  onSelectIssue,
}) => {
  return (
    <CategoryScreen
      categoryId="housing"
      onBack={onBack}
      onOpenVoiceAssistant={(query) => onOpenAIAssistant(query || 'Housing dispute')}
      onOpenTypeAssistant={(query) => onOpenAIAssistant(query || '')}
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
