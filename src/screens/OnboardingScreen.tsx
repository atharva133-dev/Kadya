import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

interface OnboardingScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted,
  onSkip,
}) => {
  return (
    <View style={styles.container}>
      {/* 
        Artboard wrapper locked to the exact 473:1024 aspect ratio of the artwork.
        This guarantees:
        1. 100% of the screen (from top logo to bottom Get Started button) is visible.
        2. Zero clipping of buttons or headers.
        3. Zero white sidebars or letterbox gaps because background is uniformly #FDF9F1.
      */}
      <View style={styles.artboardWrapper}>
        <Image
          source={require('../../assets/images/onboarding_bg_v2.png')}
          style={styles.artworkImage}
          resizeMode="contain"
          accessible={false}
        />

        {/* Interactive 'Skip' pill button at top-right */}
        <TouchableOpacity
          style={styles.skipButtonArea}
          onPress={onSkip}
          activeOpacity={0.65}
          accessibilityRole="button"
          accessibilityLabel="Skip to Login"
        >
          <View style={styles.touchAreaFiller} />
        </TouchableOpacity>

        {/* Interactive Highlight Banner Card */}
        <TouchableOpacity
          style={styles.bannerCardArea}
          onPress={onGetStarted}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Explore Legal Steps"
        >
          <View style={styles.touchAreaFiller} />
        </TouchableOpacity>

        {/* Interactive 'Get Started ->' Navy Pill Button */}
        <TouchableOpacity
          style={styles.getStartedButtonArea}
          onPress={onGetStarted}
          activeOpacity={0.78}
          accessibilityRole="button"
          accessibilityLabel="Get Started with Kayda Sathi"
        >
          <View style={styles.touchAreaFiller} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FDF9F1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  artboardWrapper: {
    height: '100%',
    aspectRatio: 473 / 1024,
    maxWidth: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF9F1',
    ...Platform.select({
      web: {
        userSelect: 'none',
      } as any,
    }),
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  // Skip button positioned over top-right pill
  skipButtonArea: {
    position: 'absolute',
    top: '3.0%',
    right: '4.5%',
    width: '18%',
    height: '4.5%',
    borderRadius: 20,
    zIndex: 10,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  // Middle Highlight Banner card
  bannerCardArea: {
    position: 'absolute',
    top: '76.2%',
    left: '7.5%',
    right: '7.5%',
    height: '8.2%',
    borderRadius: 16,
    zIndex: 10,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  // Get Started CTA button
  getStartedButtonArea: {
    position: 'absolute',
    top: '89.5%',
    left: '8.2%',
    right: '8.2%',
    height: '5.5%',
    borderRadius: 30,
    zIndex: 10,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  touchAreaFiller: {
    width: '100%',
    height: '100%',
  },
});
