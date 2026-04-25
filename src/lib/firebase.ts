import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { Platform } from 'react-native';

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

// Web: browserLocalPersistence / Native: AsyncStorage（getReactNativePersistence）
function buildAuth() {
  if (Platform.OS === 'web') {
    return initializeAuth(app, { persistence: browserLocalPersistence });
  }

  // getReactNativePersistence は Metro が実行時に react-native 条件で解決する。
  // TypeScript の型解決が browser 版を向くため require で回避。
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getReactNativePersistence } = require('@firebase/auth') as {
    getReactNativePersistence: (s: unknown) => import('firebase/auth').Persistence;
  };

  return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
}

export const auth = buildAuth();

// Firestore: オフライン永続化を有効化（練習室の電波不良対策）
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
