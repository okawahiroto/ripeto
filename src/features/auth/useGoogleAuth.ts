import { useAuthRequest } from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import Constants from 'expo-constants';
import { linkWithGoogle } from './api';
import { useAuthStore } from '@/src/stores/authStore';

const extra = Constants.expoConfig?.extra as Record<string, string | undefined> | undefined;
const IOS_CLIENT_ID = extra?.googleIosClientId;
const ANDROID_CLIENT_ID = extra?.googleAndroidClientId;

// useAuthRequest は iosClientId が falsy だと iOS でクラッシュするため、
// 未設定時はプレースホルダーを渡して isAvailable フラグで機能を無効化する
const isGoogleAvailable = !!(IOS_CLIENT_ID || ANDROID_CLIENT_ID);

export function useGoogleAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  const [_request, response, promptAsync] = useAuthRequest({
    iosClientId: IOS_CLIENT_ID ?? 'not-configured',
    androidClientId: ANDROID_CLIENT_ID ?? 'not-configured',
  });

  useEffect(() => {
    if (!isGoogleAvailable) return;
    if (response?.type !== 'success') return;

    const idToken = response.authentication?.idToken;
    if (!idToken) return;

    (async () => {
      const user = await linkWithGoogle(idToken);
      setUser(user);
      setStatus('linked');
    })();
  }, [response, setUser, setStatus]);

  return {
    promptAsync: isGoogleAvailable ? promptAsync : async () => {},
    isAvailable: isGoogleAvailable,
  };
}
