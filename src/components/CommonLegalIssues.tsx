import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LegalCategory } from '../types';
import { getTranslation } from '../locales/translations';

interface CommonLegalIssuesProps {
  categories: LegalCategory[];
  onSelectCategory: (category: LegalCategory) => void;
  onSeeAll: () => void;
  language?: string;
}

export const CommonLegalIssues: React.FC<CommonLegalIssuesProps> = ({
  categories,
  onSelectCategory,
  onSeeAll,
  language = 'EN',
}) => {
  const t = getTranslation(language);
  // Render icon helper
  const renderCategoryIcon = (category: LegalCategory) => {
    if (category.iconFamily === 'MaterialCommunityIcons') {
      return (
        <MaterialCommunityIcons
          name={category.iconName as any}
          size={24}
          color={category.iconColor}
        />
      );
    }
    return (
      <Ionicons
        name={category.iconName as any}
        size={24}
        color={category.iconColor}
      />
    );
  };

  const getCategoryTitle = (item: LegalCategory) => {
    if (item.id === 'housing') return t.housing;
    if (item.id === 'employment') return t.employment;
    if (item.id === 'consumer') return t.consumer;
    if (item.id === 'banking') return t.banking;
    if (item.id === 'cybercrime') return t.cybercrime;
    if (item.id === 'police') return t.police;
    return item.title;
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.commonIssues}</Text>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onSeeAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>{t.seeAll}</Text>
          <Ionicons name="chevron-forward" size={14} color="#DE6027" />
        </TouchableOpacity>
      </View>

      {/* 2-Column Grid */}
      <View style={styles.grid}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: item.bgColor,
                borderColor: item.borderColor,
              },
            ]}
            onPress={() => onSelectCategory(item)}
            activeOpacity={0.75}
          >
            {/* Top row with icon and chevron */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.iconWrapper}>
                {renderCategoryIcon(item)}
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </View>

            {/* Title and Subtitle */}
            <Text style={styles.cardTitle} numberOfLines={1}>
              {getCategoryTitle(item)}
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              {item.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  seeAllText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#DE6027',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    minWidth: 140,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    minHeight: 120,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        outlineStyle: 'none',
      } as any,
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 6,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
    fontWeight: '400',
  },
});
