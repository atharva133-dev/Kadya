import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  size?: number;
}

export const JusticeScaleLogo: React.FC<Props> = ({ size = 32 }) => {
  return (
    <View style={[styles.container, { width: size + 6, height: size + 6 }]}>
      <MaterialCommunityIcons name="scale-balance" size={size} color="#0F172A" />
      <View style={styles.accentBadge} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  accentBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DE6027',
  },
});
