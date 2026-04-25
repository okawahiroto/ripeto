import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey as string,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain as string,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId as string,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket as string,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId as string,
  appId: Constants.expoConfig?.extra?.firebaseAppId as string,
};

export const app = initializeApp(firebaseConfig);

// Phase 2 で React Native 向け永続化（AsyncStorage）を設定する
export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
