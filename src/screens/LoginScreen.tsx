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
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JusticeScaleLogo } from '../components/JusticeScaleLogo';
import { authService, UserProfile, CLERK_AUTH_URLS } from '../services/authService';
import { getTranslation } from '../locales/translations';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToOnboarding?: () => void;
  language?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBackToOnboarding,
  language = 'EN',
}) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');

  const t = getTranslation(language);

  // Derived account display name preview
  const computedDisplayName = firstName.trim() && lastName.trim()
    ? `${firstName.trim()} ${lastName.trim()}`
    : firstName.trim() || (email ? email.split('@')[0] : 'Citizen');

  // Direct Google Sign In with Clerk OAuth
  const handleGoogleSignIn = async () => {
    if (loading || googleLoading) return;
    setGoogleLoading(true);
    setErrorMessage('');
    setInfoMessage('Signing in via Clerk Google OAuth (/auth-redirect)...');

    try {
      const user = await authService.signInWithGoogle();
      onLoginSuccess(user);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Google authentication failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (loading || googleLoading) return;
    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      let user: UserProfile;
      if (isSignUp) {
        if (!firstName.trim()) {
          setErrorMessage('Please enter your First Name to name your account.');
          setLoading(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMessage('Please enter a valid email address.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match. Please verify your confirm password.');
          setLoading(false);
          return;
        }

        user = await authService.signUpWithEmail(
          email,
          password,
          firstName.trim(),
          lastName.trim(),
          rememberMe
        );
      } else {
        if (!email.trim()) {
          setErrorMessage('Please enter your email address.');
          setLoading(false);
          return;
        }
        if (!password) {
          setErrorMessage('Please enter your password.');
          setLoading(false);
          return;
        }

        user = await authService.signInWithEmail(
          email,
          password,
          rememberMe
        );
      }
      onLoginSuccess(user);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter your email above to receive a password reset link.');
      return;
    }
    if (loading) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await authService.sendPasswordReset(email);
      setInfoMessage('If an account exists for this email, a password reset link has been sent. Check your inbox.');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = async () => {
    if (loading || googleLoading) return;
    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');
    try {
      onLoginSuccess(await authService.signInAnonymously());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not start a guest session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Botanical Decorative Leaf at Top Right */}
      <View style={styles.topLeafWrapper}>
        <Ionicons name="leaf" size={28} color="#94A3B8" style={{ opacity: 0.2 }} />
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          <Text style={styles.brandTagline}>{t.appTagline}</Text>
        </View>

        {/* Segmented Tab Switcher: Sign In vs Sign Up */}
        <View style={styles.tabsWrapper}>
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[styles.segmentBtn, !isSignUp && styles.segmentBtnActive]}
              onPress={() => {
                setIsSignUp(false);
                setErrorMessage('');
                setInfoMessage('');
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="log-in-outline"
                size={16}
                color={!isSignUp ? '#FFFFFF' : '#64748B'}
              />
              <Text style={[styles.segmentText, !isSignUp && styles.segmentTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segmentBtn, isSignUp && styles.segmentBtnActive]}
              onPress={() => {
                setIsSignUp(true);
                setErrorMessage('');
                setInfoMessage('');
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-add-outline"
                size={16}
                color={isSignUp ? '#FFFFFF' : '#64748B'}
              />
              <Text style={[styles.segmentText, isSignUp && styles.segmentTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Headline */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subTitle}>
            {isSignUp
              ? 'Join Kayda Sathi with Clerk authentication to access personalized legal guidance.'
              : 'Sign in with your Clerk account to continue your legal journey.'}
          </Text>
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

        {/* Form Inputs Container */}
        <View style={styles.formContainer}>
          {/* Direct Google Login with Clerk */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
            disabled={loading || googleLoading}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={isSignUp ? 'Sign up with Google via Clerk' : 'Continue with Google via Clerk'}
          >
            {googleLoading ? (
              <ActivityIndicator color="#0F172A" size="small" />
            ) : (
              <>
                <View style={styles.googleIconContainer}>
                  <Ionicons name="logo-google" size={19} color="#EA4335" />
                </View>
                <Text style={styles.googleBtnText}>
                  {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
                </Text>
                <View style={styles.clerkMiniTag}>
                  <Text style={styles.clerkMiniTagText}>Clerk OAuth</Text>
                </View>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* First Name & Last Name (Sign Up only) */}
          {isSignUp && (
            <>
              <View style={styles.nameRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>First Name *</Text>
                  <View style={styles.inputBox}>
                    <Ionicons name="person-outline" size={17} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Rahul"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="words"
                      editable={!loading && !googleLoading}
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <View style={styles.inputBox}>
                    <Ionicons name="person-outline" size={17} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Sharma"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="words"
                      editable={!loading && !googleLoading}
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
              </View>

              {/* Dynamic Account Name Preview Badge */}
              {firstName.trim().length > 0 && (
                <View style={styles.accountPreviewBox}>
                  <Ionicons name="person-circle-outline" size={16} color="#DE6027" />
                  <Text style={styles.accountPreviewText}>
                    Account Name: <Text style={styles.accountPreviewBold}>{computedDisplayName}</Text>
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading && !googleLoading}
                autoCorrect={false}
                accessibilityLabel="Email"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password (min 6 characters)"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                editable={!loading && !googleLoading}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
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

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading && !googleLoading}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Confirm Password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Remember Me & Forgot Password Row */}
          <View style={styles.rememberRow}>
            <TouchableOpacity
              style={styles.rememberLeft}
              disabled={loading || googleLoading}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.customCheckbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            {!isSignUp && (
              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={loading || googleLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Sign In / Sign Up Submit Button */}
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={handleSignIn}
            disabled={loading || googleLoading}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel={isSignUp ? 'Create Clerk Account' : 'Sign In with Clerk'}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.signInBtnText}>
                  {isSignUp ? 'Create Clerk Account' : 'Sign In with Clerk'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Sign Up / Sign In Toggle Footer */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            </Text>
            <TouchableOpacity
              disabled={loading || googleLoading}
              onPress={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage('');
                setInfoMessage('');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleLink}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue as Guest option */}
          <TouchableOpacity
            style={styles.guestLink}
            disabled={loading || googleLoading}
            accessibilityRole="button"
            onPress={handleGuestContinue}
            activeOpacity={0.7}
          >
            <Text style={styles.guestLinkText}>Explore app as Guest Citizen &rarr;</Text>
          </TouchableOpacity>

          {/* Clerk Architecture & Post-Auth DB Sync Card */}
          <View style={styles.clerkSyncCard}>
            <View style={styles.clerkSyncTopRow}>
              <View style={styles.clerkBadgePill}>
                <Ionicons name="lock-closed" size={12} color="#059669" />
                <Text style={styles.clerkBadgePillText}>Clerk Authentication</Text>
              </View>
              <Text style={styles.clerkSyncSubtext}>DB Sync Enabled</Text>
            </View>

            <Text style={styles.clerkFlowDescription}>
              All post-auth flows securely redirect to <Text style={styles.codeText}>{CLERK_AUTH_URLS.afterSignInUrl}</Text> for database user synchronization.
            </Text>

            <View style={styles.clerkEndpointsRow}>
              <View style={styles.endpointChip}>
                <Text style={styles.endpointLabel}>Sign In:</Text>
                <Text style={styles.endpointValue}>{CLERK_AUTH_URLS.signInUrl}</Text>
              </View>
              <View style={styles.endpointChip}>
                <Text style={styles.endpointLabel}>Sign Up:</Text>
                <Text style={styles.endpointValue}>{CLERK_AUTH_URLS.signUpUrl}</Text>
              </View>
              <View style={styles.endpointChip}>
                <Text style={styles.endpointLabel}>Google OAuth:</Text>
                <Text style={styles.endpointValue}>oauth_google</Text>
              </View>
              <View style={styles.endpointChip}>
                <Text style={styles.endpointLabel}>DB Sync:</Text>
                <Text style={styles.endpointValue}>{CLERK_AUTH_URLS.afterSignUpUrl}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom High Court Illustration */}
        <View style={styles.courtIllustrationContainer}>
          <Image
            source={require('../../assets/images/court_footer.jpg')}
            style={styles.courtImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 24,
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
    marginBottom: 12,
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
  tabsWrapper: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: '#DE6027',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 6px rgba(222, 96, 39, 0.35)',
      },
    }),
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
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
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 14,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        cursor: 'pointer',
      } as any,
    }),
  },
  googleIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  clerkMiniTag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  clerkMiniTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  accountPreviewText: {
    fontSize: 11.5,
    color: '#C2410C',
  },
  accountPreviewBold: {
    fontWeight: '700',
    color: '#9A3412',
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
    borderRadius: 12,
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
    borderRadius: 24,
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
  clerkSyncCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
  clerkSyncTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  clerkBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  clerkBadgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  clerkSyncSubtext: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#059669',
  },
  clerkFlowDescription: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: '#DE6027',
    backgroundColor: '#F1F5F9',
  },
  clerkEndpointsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  endpointChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4,
  },
  endpointLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  endpointValue: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: '#0F172A',
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
