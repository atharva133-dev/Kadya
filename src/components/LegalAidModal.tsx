import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LEGAL_AID_HELPLINES } from '../data/legalData';

interface LegalAidModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LegalAidModal: React.FC<LegalAidModalProps> = ({
  visible,
  onClose,
}) => {
  const handleCall = (number: string, name: string) => {
    const cleanNumber = number.split('/')[0].trim();
    if (Platform.OS === 'web') {
      Alert.alert(`Helpline: ${cleanNumber}`, `Official contact for ${name}.`);
    } else {
      Linking.openURL(`tel:${cleanNumber}`);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Find Legal Aid & Support</Text>
              <Text style={styles.subtitle}>
                Official government helplines and legal aid clinics near you
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Legal Aid Banner */}
          <View style={styles.banner}>
            <Ionicons name="shield-checkmark" size={24} color="#0D9488" />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Article 39A - Free Legal Aid</Text>
              <Text style={styles.bannerText}>
                Under the Indian Constitution, free legal counsel and court representation is provided by State Legal Services to women, marginalized groups, and low-income citizens.
              </Text>
            </View>
          </View>

          {/* Helpline List */}
          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {LEGAL_AID_HELPLINES.map((helpline) => (
              <View key={helpline.id} style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{helpline.type}</Text>
                  </View>
                  <Text style={styles.timingText}>{helpline.timing}</Text>
                </View>

                <Text style={styles.cardName}>{helpline.name}</Text>
                <Text style={styles.cardDesc}>{helpline.description}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.numberRow}>
                    <Ionicons name="call" size={16} color="#DE6027" />
                    <Text style={styles.numberText}>{helpline.number}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => handleCall(helpline.number, helpline.name)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.callBtnText}>Call Helpline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0FDFA',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 14,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  bannerText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
    marginTop: 2,
  },
  scrollList: {
    maxHeight: 400,
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeBadge: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },
  timingText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
  },
  cardName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  numberText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  callBtn: {
    backgroundColor: '#DE6027',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
