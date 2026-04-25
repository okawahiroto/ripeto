import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

// expo-constants 経由で環境変数を取得（app.config.ts の extra フィールド）
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey as string,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain as string,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId as string,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket as string,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId as string,
  appId: Constants.expoConfig?.extra?.firebaseAppId as string,
};

export const app = initializeApp(firebaseConfig);

// getReactNativePersistence は @firebase/auth の react-native 条件付きエクスポート。
// Metro は実行時に正しく解決するが TypeScript の型解決が browser 版を向くため require で回避。
// getReactNativePersistence は @firebase/auth の react-native 条件付きエクスポート。
// Metro は実行時に正しく解決するが TypeScript の型解決が browser 版を向くため require で回避。
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require('@firebase/auth') as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => import('firebase/auth').Persistence;
};

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore: オフライン永続化を有効化（練習室の電波不良対策）
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
