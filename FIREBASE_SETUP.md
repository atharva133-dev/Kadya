# Firebase Authentication

The Expo app uses Firebase JS SDK 12 with native AsyncStorage persistence.
The supplied client API key is configured in `src/services/firebaseConfig.ts`.
You may override it with `EXPO_PUBLIC_FIREBASE_API_KEY` in `.env.local`.
No invented project ID, app ID, bucket or messaging sender ID is used.

The live service currently returns `CONFIGURATION_NOT_FOUND`, including when
called through the Firebase SDK. To finish setup in the project owning the key:

1. Open Firebase Console > Authentication > Get started.
2. Enable Email/Password and Anonymous under Sign-in method.
3. Run `node scripts/check-firebase.cjs` to check the email/password endpoint.
4. Test Sign Up and Sign In with an account you control in Expo Go or a development build.
5. With Remember me enabled, restart the app and confirm the session restores.
6. Sign out, restart, and confirm the account is no longer signed in.
7. Test password reset with that account, and test Explore as Guest.

No accounts or emails are created by the connectivity script. Authentication
service unit checks run with `node --test tests/auth-service.test.cjs`.
They use SDK mocks; they do not prove a live account can sign in.

Google, Apple and phone sign-in were placeholders and are not offered until
native provider credentials and flows are implemented. Firestore/Storage and
cloud persistence of drafts/cases are not part of this authentication setup.

Reference: https://docs.expo.dev/guides/using-firebase/
