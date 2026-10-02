// This probe never creates an account or sends email. It uses a reserved invalid
// email domain to distinguish configured Auth from missing project configuration.
const fs = require('node:fs');
const source = fs.readFileSync('src/services/firebaseConfig.ts', 'utf8');
const key = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || source.match(/\|\| '([^']+)'/)[1];

(async () => {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'connectivity-check@example.invalid', password: 'non-account-connectivity-check', returnSecureToken: true }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  const code = data.error?.message;
  if (['INVALID_LOGIN_CREDENTIALS', 'EMAIL_NOT_FOUND', 'INVALID_PASSWORD'].includes(code)) {
    console.log('Firebase email/password endpoint is configured. A real account sign-in still needs to be tested.');
  } else {
    console.error(`Firebase authentication is not verified: ${code || response.status}`);
    process.exitCode = 1;
  }
})().catch(() => {
  console.error('Could not reach Firebase. Check network access and retry.');
  process.exitCode = 1;
});
