import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  bottomInset?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  bottomInset = 0,
}) => {
  const tabs: {
    id: TabType;
    label: string;
    activeIcon: keyof typeof Ionicons.glyphMap;
    inactiveIcon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      activeIcon: 'home',
      inactiveIcon: 'home-outline',
    },
    {
      id: 'cases',
      label: 'My Cases',
      activeIcon: 'folder',
      inactiveIcon: 'folder-outline',
    },
    {
      id: 'guides',
      label: 'Guides',
      activeIcon: 'book',
      inactiveIcon: 'book-outline',
    },
    {
      id: 'profile',
      label: 'Profile',
      activeIcon: 'person',
      inactiveIcon: 'person-outline',
    },
  ];

  return (
    <View
      style={[
        styles.navContainer,
        { paddingBottom: Math.max(bottomInset, Platform.OS === 'ios' ? 14 : 8) },
      ]}
    >
      <View style={styles.navRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.inactiveIcon}
                size={23}
                color={isActive ? '#DE6027' : '#64748B'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 64,
  },
  tabLabel: {
    fontSize: 11.5,
    marginTop: 4,
    letterSpacing: -0.1,
  },
  activeTabLabel: {
    color: '#DE6027',
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: '#64748B',
    fontWeight: '500',
  },
});
