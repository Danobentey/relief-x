// Firebase initialization (minimal) - will expand with auth later
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential, sendPasswordResetEmail } from 'firebase/auth';
import { env } from '../../config/env';

let app: FirebaseApp | null = null;

export function getFirebaseApp() {
  if (!app) {
    if (!getApps().length) {
      app = initializeApp({
        apiKey: env.FIREBASE_API_KEY,
        projectId: env.FIREBASE_PROJECT_ID,
        appId: env.FIREBASE_APP_ID,
        messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
      });
    } else {
      app = getApps()[0];
    }
  }
  return app!;
}

export const db = getFirestore(getFirebaseApp());
export const auth = getAuth(getFirebaseApp());

export function ensureAnonAuth(): Promise<User> {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  return signInAnonymously(auth).then(() => auth.currentUser!);
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function signInEmail(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}
export function signUpEmail(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}
export function signOutUser(): Promise<void> {
  return signOut(auth);
}
export function sendResetEmail(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export async function upsertUserProfile(uid: string, data: { fullName?: string }) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp(), createdAt: serverTimestamp() }, { merge: true });
}
