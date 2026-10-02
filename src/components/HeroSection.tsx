import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getTranslation } from '../locales/translations';

interface HeroSectionProps {
  language?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ language = 'EN' }) => {
  const t = getTranslation(language);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.describeTitle}</Text>
      <Text style={styles.subtitle}>{t.describeSubtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#475569',
    marginTop: 6,
    lineHeight: 21,
    letterSpacing: -0.1,
  },
});
