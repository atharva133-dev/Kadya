import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HeroSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us what happened.</Text>
      <Text style={styles.subtitle}>
        Type or speak in your own words. We'll help you understand your rights and next steps.
      </Text>
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
