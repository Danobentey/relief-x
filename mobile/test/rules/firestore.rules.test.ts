import { initializeTestEnvironment, RulesTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { setLogLevel } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

const PROJECT_ID = 'reliefx-test';

beforeAll(async () => {
  setLogLevel('error');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(require.resolve('../../firestore.rules'), 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Firestore Security Rules', () => {
  const userA = 'userA';
  const userB = 'userB';

  function userContext(uid?: string) {
    return uid ? testEnv.authenticatedContext(uid).firestore() : testEnv.unauthenticatedContext().firestore();
  }

  async function seed(docPath: string, data: any) {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().doc(docPath).set(data);
    });
  }

  test('user can create own user doc', async () => {
    const db = userContext(userA);
    await assertSucceeds(db.collection('users').doc(userA).set({ subscriptionStatus: 'trial', createdAt: 0, updatedAt: 0 }));
  });

  test('user cannot create another user doc', async () => {
    const db = userContext(userA);
    await assertFails(db.collection('users').doc(userB).set({ subscriptionStatus: 'trial' }));
  });

  test('other user cannot read someone else profile', async () => {
    await seed(`users/${userA}`, { subscriptionStatus: 'trial', createdAt: 0, updatedAt: 0 });
    const db = userContext(userB);
    await assertFails(db.collection('users').doc(userA).get());
  });

  test('owner can CRUD painLogs with valid score', async () => {
    const db = userContext(userA);
    const ref = db.collection('users').doc(userA).collection('painLogs').doc();
    await assertSucceeds(ref.set({ date: '2025-09-18', score: 5, createdAt: 0, updatedAt: 0 }));
    await assertSucceeds(ref.update({ score: 7, updatedAt: 1 }));
  });

  test('reject painLogs with invalid score', async () => {
    const db = userContext(userA);
    const ref = db.collection('users').doc(userA).collection('painLogs').doc();
    await assertFails(ref.set({ date: '2025-09-18', score: 15 }));
  });

  test('reject painLogs missing required field', async () => {
    const db = userContext(userA);
    const ref = db.collection('users').doc(userA).collection('painLogs').doc();
    await assertFails(ref.set({ score: 5 }));
  });

  test('non-owner cannot read painLogs', async () => {
    await seed(`users/${userA}`, { subscriptionStatus: 'trial', createdAt: 0, updatedAt: 0 });
    await seed(`users/${userA}/painLogs/today`, { date: '2025-09-18', score: 5, createdAt: 0, updatedAt: 0 });
    const db = userContext(userB);
    await assertFails(db.collection('users').doc(userA).collection('painLogs').doc('today').get());
  });

  test('videoCompletions valid create/update', async () => {
    const db = userContext(userA);
    const ref = db.collection('users').doc(userA).collection('videoCompletions').doc('video-1');
    await assertSucceeds(ref.set({ completedAt: 0, lastPositionSec: 30, createdAt: 0, updatedAt: 0 }));
    await assertSucceeds(ref.update({ lastPositionSec: 60, updatedAt: 1 }));
  });

  test('videoCompletions invalid missing lastPositionSec', async () => {
    const db = userContext(userA);
    const ref = db.collection('users').doc(userA).collection('videoCompletions').doc('video-2');
    await assertFails(ref.set({ completedAt: 0 }));
  });

  test('premium video requires entitlement when user not entitled', async () => {
    await seed('videos/premium1', { isPremium: true });
    const db = userContext(userA);
    // user doc without entitlement status
    await seed(`users/${userA}`, { subscriptionStatus: 'expired', createdAt: 0, updatedAt: 0 });
    await assertFails(db.collection('videos').doc('premium1').get());
  });

  test('premium video allowed for entitled user', async () => {
    await seed('videos/premium2', { isPremium: true });
    await seed(`users/${userA}`, { subscriptionStatus: 'active', createdAt: 0, updatedAt: 0 });
    const db = userContext(userA);
    await assertSucceeds(db.collection('videos').doc('premium2').get());
  });

  test('non-premium video accessible to any signed-in user', async () => {
    await seed('videos/free1', { isPremium: false });
    await seed(`users/${userA}`, { subscriptionStatus: 'expired', createdAt: 0, updatedAt: 0 });
    const db = userContext(userA);
    await assertSucceeds(db.collection('videos').doc('free1').get());
  });
});
