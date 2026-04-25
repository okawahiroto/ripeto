import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { linkWithGoogle } from './api';
import { useAuthStore } from '@/src/stores/authStore';

// Google OAuth クライアント ID は Firebase Console → Authentication → Sign-in method → Google で確認
const IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.GOOGLE_ANDROID_CLIENT_ID;

export function useGoogleAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  const [_request, response, promptAsync] = useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type !== 'success') return;

    const idToken = response.authentication?.idToken;
    if (!idToken) return;

    (async () => {
      const user = await linkWithGoogle(idToken);
      setUser(user);
      setStatus('linked');
    })();
  }, [response, setUser, setStatus]);

  return { promptAsync };
}

// AuthSession を使用していることを明示（未使用インポート防止）
void AuthSession;
void Crypto;
