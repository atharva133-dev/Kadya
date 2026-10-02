const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, dependencies = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, require: name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  }});
  return module.exports;
}
const validation = load('src/services/authValidation.ts');
const user = { uid: 'firebase-uid', email: 'citizen@example.com', displayName: null, photoURL: null, phoneNumber: null, isAnonymous: false, emailVerified: false };

function setup(overrides = {}) {
  const calls = [];
  const auth = { currentUser: user };
  const sdk = {
    inMemoryPersistence: 'memory',
    setPersistence: async (_, persistence) => { calls.push(['persistence', persistence]); },
    signInWithEmailAndPassword: async (_, email, password) => { calls.push(['signIn', email, password]); return { user }; },
    createUserWithEmailAndPassword: async () => ({ user }),
    updateProfile: async () => {},
    signInAnonymously: async () => ({ user: { ...user, email: null, isAnonymous: true } }),
    sendPasswordResetEmail: async (_, email) => { calls.push(['reset', email]); },
    sendEmailVerification: async () => {},
    signOut: async target => { assert.equal(target, auth); calls.push(['signOut']); },
    onAuthStateChanged: (_, callback) => { callback(user); return () => calls.push(['unsubscribe']); },
    ...overrides,
  };
  const { authService } = load('src/services/authService.ts', {
    'firebase/auth': sdk,
    './firebaseAuth': { firebaseAuth: auth, persistentAuthStorage: 'persistent' },
    './authValidation': validation,
  });
  return { authService, calls };
}

test('empty credentials never trigger a Firebase sign-in', async () => {
  const { authService, calls } = setup();
  await assert.rejects(authService.signInWithEmail('', ''), /valid email/);
  await assert.rejects(authService.signInWithEmail('citizen@example.com', ''), /password/);
  assert.equal(calls.length, 0);
});

test('valid credentials are trimmed and Remember me controls persistence', async () => {
  const { authService, calls } = setup();
  const result = await authService.signInWithEmail(' citizen@example.com ', 'my-password', false);
  assert.deepEqual(calls, [['persistence', 'memory'], ['signIn', 'citizen@example.com', 'my-password']]);
  assert.equal(result.uid, user.uid);
  assert.equal(result.emailVerified, false);
  assert.equal('idToken' in result, false);
  await authService.signInWithEmail('citizen@example.com', 'my-password', true);
  assert.deepEqual(calls[2], ['persistence', 'persistent']);
});

for (const [code, message] of [
  ['auth/configuration-not-found', /needs to be set up/],
  ['auth/operation-not-allowed', /has not been enabled/],
  ['auth/network-request-failed', /internet connection/],
  ['auth/invalid-credential', /email or password/],
]) {
  test(`${code} never creates a simulated signed-in user`, async () => {
    const fail = async () => { throw { code }; };
    const { authService } = setup({ signInWithEmailAndPassword: fail, createUserWithEmailAndPassword: fail, signInAnonymously: fail });
    await assert.rejects(authService.signInWithEmail('citizen@example.com', 'password'), message);
    await assert.rejects(authService.signUpWithEmail('citizen@example.com', 'password'), message);
    await assert.rejects(authService.signInAnonymously(), message);
  });
}

test('failed password reset is not reported as success', async () => {
  const { authService } = setup({ sendPasswordResetEmail: async () => { throw { code: 'auth/configuration-not-found' }; } });
  await assert.rejects(authService.sendPasswordReset('citizen@example.com'), /needs to be set up/);
});

test('signup rejects weak passwords before creating an account', async () => {
  const { authService, calls } = setup();
  await assert.rejects(authService.signUpWithEmail('citizen@example.com', '123'), /at least 6/);
  assert.equal(calls.length, 0);
});

test('guest sessions are genuine anonymous Firebase users and are temporary', async () => {
  const { authService, calls } = setup();
  const result = await authService.signInAnonymously();
  assert.equal(result.uid, user.uid);
  assert.equal(result.isAnonymous, true);
  assert.deepEqual(calls, [['persistence', 'memory']]);
});

test('restored Firebase sessions propagate and sign-out calls Firebase', async () => {
  const { authService, calls } = setup();
  let restored;
  const unsubscribe = authService.subscribe(profile => { restored = profile; }, assert.fail);
  assert.equal(restored.uid, user.uid);
  unsubscribe();
  await authService.signOut();
  assert.deepEqual(calls, [['unsubscribe'], ['signOut']]);
});
