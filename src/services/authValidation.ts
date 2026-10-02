export function validateCredentials(email: string, password: string, signingUp = false) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Enter a valid email address.');
  if (!password) throw new Error('Enter your password.');
  if (signingUp && password.length < 6) throw new Error('Use a password with at least 6 characters.');
}

export function getAuthErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  switch (code) {
    case 'auth/configuration-not-found':
      return 'Sign-in is not available yet. Firebase Authentication needs to be set up for this app.';
    case 'auth/operation-not-allowed':
    case 'auth/admin-restricted-operation':
      return 'This sign-in method has not been enabled for this app.';
    case 'auth/invalid-api-key':
    case 'auth/app-not-authorized':
      return 'The app cannot connect to its authentication project. Please contact support.';
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'Choose a stronger password that meets the account password requirements.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and try again.';
    case 'auth/network-request-failed':
      return 'Could not connect. Check your internet connection and try again.';
    default:
      return 'Authentication failed. Please try again.';
  }
}
