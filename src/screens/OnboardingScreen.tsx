import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';

interface OnboardingScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted,
  onSkip,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // The original artwork design is 473 x 979 (~0.483 aspect ratio)
  // We constrain it within the mobile frame or desktop viewport
  const isWeb = Platform.OS === 'web';
  const containerMaxWidth = 460;
  const targetWidth = Math.min(windowWidth, containerMaxWidth);
  // Fit nicely within viewport height on desktop/laptop web
  const availableHeight = isWeb ? Math.min(windowHeight, 880) : windowHeight;

  return (
    <View style={styles.outerContainer}>
      <View
        style={[
          styles.contentCard,
          {
            width: targetWidth,
            height: availableHeight,
          },
        ]}
      >
        {/* Full-bleed, 100% pixel-perfect original high-res design canvas */}
        <Image
          source={require('../../assets/images/onboarding_bg_exact.png')}
          style={styles.canvasImage}
          resizeMode="contain"
          accessible={false}
        />

        {/* Interactive 'Skip' touch target at top-right */}
        <TouchableOpacity
          style={styles.skipTouchTarget}
          onPress={onSkip}
          activeOpacity={0.65}
          accessibilityRole="button"
          accessibilityLabel="Skip to Login"
        >
          <View style={styles.invisibleTarget} />
        </TouchableOpacity>

        {/* Interactive 'Get Started ->' touch target at bottom */}
        <TouchableOpacity
          style={styles.getStartedTouchTarget}
          onPress={onGetStarted}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <View style={styles.invisibleTarget} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FAF6EF',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  contentCard: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF6EF',
    overflow: 'hidden',
  },
  canvasImage: {
    width: '100%',
    height: '100%',
  },
  skipTouchTarget: {
    position: 'absolute',
    top: '3%',
    right: '4%',
    width: 70,
    height: 44,
    zIndex: 10,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  getStartedTouchTarget: {
    position: 'absolute',
    bottom: '4.5%',
    left: '6%',
    right: '6%',
    height: 60,
    borderRadius: 30,
    zIndex: 10,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  invisibleTarget: {
    width: '100%',
    height: '100%',
  },
});
