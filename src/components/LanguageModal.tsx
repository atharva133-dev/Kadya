import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LanguageModalProps {
  visible: boolean;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'EN', name: 'English', native: 'English' },
  { code: 'HI', name: 'Hindi', native: 'हिन्दी' },
  { code: 'MR', name: 'Marathi', native: 'मराठी' },
  { code: 'GU', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'BN', name: 'Bengali', native: 'বাংলা' },
  { code: 'TA', name: 'Tamil', native: 'தமிழ்' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  selectedLanguage,
  onSelectLanguage,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose App Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.langList}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langItem,
                    isSelected && styles.selectedLangItem,
                  ]}
                  onPress={() => {
                    onSelectLanguage(lang.code);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text
                      style={[
                        styles.langName,
                        isSelected && styles.selectedLangText,
                      ]}
                    >
                      {lang.native} ({lang.name})
                    </Text>
                    <Text style={styles.langCode}>{lang.code}</Text>
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#DE6027" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langList: {
    gap: 8,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedLangItem: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  langName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  selectedLangText: {
    color: '#DE6027',
    fontWeight: '700',
  },
  langCode: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});
