import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GuidesScreenProps {
  onBackToHome: () => void;
  onOpenCategory: (catId: string) => void;
}

const GUIDES_DATA = [
  {
    id: 'g1',
    title: 'How to recover a rental security deposit from an unresponsive landlord',
    category: 'Housing & Rental',
    readTime: '4 min read',
    summary: 'Everything you need to know about the 15-day legal notice format, Model Tenancy Act, and small claims filing.',
  },
  {
    id: 'g2',
    title: 'What to do within the Golden Hour of online financial fraud',
    category: 'Cybercrime',
    readTime: '3 min read',
    summary: 'Dialing 1930, freezing illicit beneficiary accounts, and filing an admissible report on cybercrime.gov.in.',
  },
  {
    id: 'g3',
    title: 'Your rights when an e-commerce platform refuses a return or replacement',
    category: 'Consumer Protection',
    readTime: '5 min read',
    summary: 'Consumer Protection (E-Commerce) Rules 2020 and how to file directly on e-daakhil portal.',
  },
  {
    id: 'g4',
    title: 'Understanding Zero FIR: Why police cannot refuse your complaint',
    category: 'Police & FIR',
    readTime: '3 min read',
    summary: 'Supreme Court guidelines ensuring you can file an FIR at any police station regardless of jurisdiction.',
  },
  {
    id: 'g5',
    title: 'Unpaid salary and experience letter: Legal recourse under Labour Law',
    category: 'Employment',
    readTime: '4 min read',
    summary: 'Steps under Payment of Wages Act, SAMADHAN portal grievances, and serving a formal employer notice.',
  },
];

export const GuidesScreen: React.FC<GuidesScreenProps> = ({
  onBackToHome,
}) => {
  const [search, setSearch] = useState<string>('');

  const filteredGuides = GUIDES_DATA.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Legal Guides & Rights</Text>
        <Text style={styles.subtitle}>Plain-language legal awareness for everyday situations</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rights, acts, guides..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        {filteredGuides.map((guide) => (
          <View key={guide.id} style={styles.guideCard}>
            <View style={styles.cardTop}>
              <Text style={styles.catText}>{guide.category}</Text>
              <Text style={styles.readTimeText}>{guide.readTime}</Text>
            </View>

            <Text style={styles.guideTitle}>{guide.title}</Text>
            <Text style={styles.guideSummary}>{guide.summary}</Text>

            <TouchableOpacity style={styles.readMoreRow}>
              <Text style={styles.readMoreText}>Read Complete Guide</Text>
              <Ionicons name="arrow-forward" size={14} color="#DE6027" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.homeLink} onPress={onBackToHome}>
          <Ionicons name="arrow-back" size={16} color="#64748B" />
          <Text style={styles.homeLinkText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  body: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DE6027',
    textTransform: 'uppercase',
  },
  readTimeText: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 21,
    marginBottom: 6,
  },
  guideSummary: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  readMoreText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#DE6027',
  },
  homeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  homeLinkText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
});
