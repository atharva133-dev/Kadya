import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SAMPLE_VOICE_PROMPTS } from '../data/legalData';

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onUseTranscription: (text: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  visible,
  onClose,
  onUseTranscription,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>(SAMPLE_VOICE_PROMPTS[0]);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [waveHeights, setWaveHeights] = useState<number[]>([18, 28, 42, 35, 20, 32, 45, 24]);

  useEffect(() => {
    if (!visible) return;
    setIsRecording(true);
    // Animate audio waveform bars
    const interval = setInterval(() => {
      setWaveHeights([
        Math.floor(Math.random() * 35) + 12,
        Math.floor(Math.random() * 45) + 15,
        Math.floor(Math.random() * 55) + 20,
        Math.floor(Math.random() * 40) + 15,
        Math.floor(Math.random() * 50) + 20,
        Math.floor(Math.random() * 45) + 12,
        Math.floor(Math.random() * 38) + 15,
        Math.floor(Math.random() * 30) + 10,
      ]);
    }, 180);

    return () => clearInterval(interval);
  }, [visible]);

  const handleApply = (text: string) => {
    onUseTranscription(text);
    onClose();
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
              <Text style={styles.title}>Voice Legal Assistant</Text>
              <Text style={styles.subtitle}>
                Speak naturally in your own language
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Waveform Visualization */}
          <View style={styles.waveBox}>
            <View style={styles.micCircle}>
              <Ionicons name="mic" size={28} color="#FFFFFF" />
            </View>

            <View style={styles.waveformRow}>
              {waveHeights.map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: h, backgroundColor: i % 2 === 0 ? '#DE6027' : '#F97316' },
                  ]}
                />
              ))}
            </View>

            <Text style={styles.listeningStatus}>
              {isRecording ? 'Listening... Speak now' : 'Transcription Ready'}
            </Text>
          </View>

          {/* Current Recognized Transcript Preview */}
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptLabel}>Voice Transcript Preview:</Text>
            <Text style={styles.transcriptText}>"{selectedPrompt}"</Text>
          </View>

          {/* Sample voice queries */}
          <Text style={styles.sampleSectionTitle}>Or select a common scenario:</Text>
          <ScrollView
            style={styles.sampleList}
            showsVerticalScrollIndicator={false}
          >
            {SAMPLE_VOICE_PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.sampleItem,
                  selectedPrompt === prompt && styles.selectedSampleItem,
                ]}
                onPress={() => setSelectedPrompt(prompt)}
              >
                <Ionicons
                  name={selectedPrompt === prompt ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={selectedPrompt === prompt ? '#DE6027' : '#94A3B8'}
                />
                <Text style={styles.sampleText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.useTextBtn}
            onPress={() => handleApply(selectedPrompt)}
            activeOpacity={0.85}
          >
            <Text style={styles.useTextBtnLabel}>Insert into Legal Problem Box</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
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
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  waveBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  micCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DE6027',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    gap: 6,
    marginBottom: 8,
  },
  waveBar: {
    width: 5,
    borderRadius: 3,
  },
  listeningStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C2410C',
  },
  transcriptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 14,
  },
  transcriptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 13.5,
    color: '#0F172A',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  sampleSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginTop: 14,
    marginBottom: 8,
  },
  sampleList: {
    maxHeight: 150,
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  selectedSampleItem: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  sampleText: {
    flex: 1,
    fontSize: 12.5,
    color: '#1E293B',
    lineHeight: 17,
  },
  useTextBtn: {
    backgroundColor: '#DE6027',
    borderRadius: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  useTextBtnLabel: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
