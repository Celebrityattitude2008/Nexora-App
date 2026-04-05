import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyCyhW2KX-efNYoskSTsi0y-1iBmeFM4DSA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'nexora-app-e9f55.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'nexora-app-e9f55',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'nexora-app-e9f55.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '218850835883',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:218850835883:web:9f84400fce7c417e87e6ee',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-RWYM8T9R54',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app);
export const userTasksRef = (uid: string) => ref(database, `users/${uid}/tasks`);
export const userCalendarEventsRef = (uid: string) => ref(database, `users/${uid}/calendarEvents`);
export const userGoalsRef = (uid: string) => ref(database, `users/${uid}/goals`);
export const userProfilePicRef = (uid: string) => ref(database, `users/${uid}/profilePic`);
export const userExpensesRef = (uid: string) => ref(database, `users/${uid}/expenses`);
