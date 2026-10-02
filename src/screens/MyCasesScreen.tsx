import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MyCasesScreenProps {
  onBackToHome: () => void;
  onOpenDraft: () => void;
}

export const MyCasesScreen: React.FC<MyCasesScreenProps> = ({
  onBackToHome,
  onOpenDraft,
}) => {
  const dummyCases = [
    {
      id: '1',
      title: 'Security Deposit Recovery - Landlord',
      category: 'Housing & Rental',
      status: 'Draft Ready',
      statusColor: '#DE6027',
      date: '2 Oct 2026',
      desc: '15-day statutory demand notice prepared for ₹35,000 security deposit return.',
    },
    {
      id: '2',
      title: 'Defective Laptop Return Grievance',
      category: 'Consumer Protection',
      status: 'Notice Sent',
      statusColor: '#16A34A',
      date: '28 Sep 2026',
      desc: 'Grievance ticket registered with National Consumer Helpline (NCH #1915).',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cases & Drafts</Text>
        <Text style={styles.subtitle}>Track your legal notices and complaints</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.content}>
        {dummyCases.map((c) => (
          <View key={c.id} style={styles.caseCard}>
            <View style={styles.cardTop}>
              <Text style={styles.categoryBadge}>{c.category}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${c.statusColor}15` }]}>
                <Text style={[styles.statusText, { color: c.statusColor }]}>{c.status}</Text>
              </View>
            </View>

            <Text style={styles.caseTitle}>{c.title}</Text>
            <Text style={styles.caseDesc}>{c.desc}</Text>

            <View style={styles.cardBottom}>
              <Text style={styles.dateText}>Created: {c.date}</Text>
              <TouchableOpacity style={styles.viewBtn} onPress={onOpenDraft}>
                <Text style={styles.viewBtnText}>View Notice</Text>
                <Ionicons name="arrow-forward" size={13} color="#DE6027" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.newNoticeBtn} onPress={onOpenDraft}>
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.newNoticeBtnText}>Create New Legal Draft</Text>
        </TouchableOpacity>

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
    paddingBottom: 12,
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
  },
  body: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  caseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  caseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  caseDesc: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  dateText: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#DE6027',
  },
  newNoticeBtn: {
    backgroundColor: '#DE6027',
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  newNoticeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
