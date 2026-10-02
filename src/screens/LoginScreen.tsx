import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JusticeScaleLogo } from '../components/JusticeScaleLogo';
import { authService, UserProfile } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToOnboarding?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBackToOnboarding,
}) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [infoMessage, setInfoMessage] = useState<string>('');

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    try {
      let user: UserProfile;
      if (isSignUp) {
        user = await authService.signUpWithEmail(
          email || 'citizen@kaydasathi.in',
          password || 'password123'
        );
      } else {
        user = await authService.signInWithEmail(
          email || 'citizen@kaydasathi.in',
          password || 'password123'
        );
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter your email above to receive a password reset link.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await authService.sendPasswordReset(email);
      setInfoMessage(`Password reset link sent to ${email}. Check your Gmail inbox!`);
    } catch (err: any) {
      setErrorMessage('Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'phone') => {
    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    try {
      let user: UserProfile;
      if (provider === 'google') user = await authService.signInWithGoogle();
      else if (provider === 'apple') user = await authService.signInWithApple();
      else user = await authService.signInWithPhone();
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Social sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = async () => {
    const user = await authService.signInAnonymously();
    onLoginSuccess(user);
  };

  return (
    <View style={styles.container}>
      {/* Botanical Decorative Leaf at Top Right */}
      <View style={styles.topLeafWrapper}>
        <Ionicons name="leaf" size={28} color="#94A3B8" style={{ opacity: 0.2 }} />
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button if needed */}
        {onBackToOnboarding && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToOnboarding}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>
        )}

        {/* Centered Brand Header */}
        <View style={styles.headerBlock}>
          <JusticeScaleLogo size={42} />
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandKayda}>Kayda </Text>
            <Text style={styles.brandSathi}>Sathi</Text>
          </View>
          <Text style={styles.brandTagline}>Your Rights. Your Next Steps.</Text>
        </View>

        {/* Headline */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subTitle}>
            {isSignUp
              ? 'Join Kayda Sathi to get personalized legal guidance.'
              : 'Sign in to continue your legal journey with Kayda Sathi.'}
          </Text>
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialButtonsGroup}>
          {/* Google */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialAuth('google')}
            activeOpacity={0.8}
            accessibilityLabel="Continue with Google"
          >
            <View style={styles.googleIconCircle}>
              <Ionicons name="logo-google" size={18} color="#EA4335" />
            </View>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialAuth('apple')}
            activeOpacity={0.8}
            accessibilityLabel="Continue with Apple"
          >
            <Ionicons name="logo-apple" size={20} color="#000000" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialAuth('phone')}
            activeOpacity={0.8}
            accessibilityLabel="Continue with Phone"
          >
            <Ionicons name="call" size={18} color="#0F172A" />
            <Text style={styles.socialButtonText}>Continue with Phone</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Error message if any */}
        {errorMessage.length > 0 && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Info / Success message if any */}
        {infoMessage.length > 0 && (
          <View style={styles.infoBox}>
            <Ionicons name="mail" size={16} color="#16A34A" />
            <Text style={styles.infoText}>{infoMessage}</Text>
          </View>
        )}

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Forgot Password Row */}
          <View style={styles.rememberRow}>
            <TouchableOpacity
              style={styles.rememberLeft}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.customCheckbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.88}
            accessibilityLabel="Sign In"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.signInBtnText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Sign Up / Sign In Toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} activeOpacity={0.7}>
              <Text style={styles.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>

          {/* Continue as Guest option */}
          <TouchableOpacity
            style={styles.guestLink}
            onPress={handleGuestContinue}
            activeOpacity={0.7}
          >
            <Text style={styles.guestLinkText}>Explore app as Guest Citizen &rarr;</Text>
          </TouchableOpacity>

          {/* Trust Badge */}
          <View style={styles.trustBadge}>
            <Ionicons name="shield-checkmark" size={18} color="#64748B" />
            <Text style={styles.trustBadgeText}>
              Your information is private and secure. We never share your data.
            </Text>
          </View>
        </View>

        {/* Bottom Architectural High Court Illustration */}
        <View style={styles.courtIllustrationContainer}>
          <Image
            source={require('../../assets/images/court_footer.jpg')}
            style={styles.courtImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    position: 'relative',
  },
  topLeafWrapper: {
    position: 'absolute',
    top: 16,
    right: 18,
    zIndex: 1,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 24 : 16,
  },
  backButton: {
    marginLeft: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  headerBlock: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  brandKayda: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandSathi: {
    fontSize: 25,
    fontWeight: '800',
    color: '#DE6027',
    letterSpacing: -0.4,
  },
  brandTagline: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  socialButtonsGroup: {
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    height: 48,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 6px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginHorizontal: 12,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#B91C1C',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#15803D',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
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
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  eyeBtn: {
    padding: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#DE6027',
    borderColor: '#DE6027',
  },
  rememberText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 12.5,
    color: '#DE6027',
    fontWeight: '600',
  },
  signInBtn: {
    backgroundColor: '#DE6027',
    borderRadius: 26,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#DE6027',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 14px rgba(222, 96, 39, 0.3)',
      },
    }),
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  toggleLabel: {
    fontSize: 13,
    color: '#475569',
  },
  toggleLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DE6027',
  },
  guestLink: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  guestLinkText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  trustBadgeText: {
    flex: 1,
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  courtIllustrationContainer: {
    width: '100%',
    height: 180,
    marginTop: 8,
    overflow: 'hidden',
  },
  courtImage: {
    width: '100%',
    height: '100%',
  },
});
