import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { linkWithApple } from './api';
import { useAuthStore } from '@/src/stores/authStore';

export function useAppleAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  // Apple 認証は iOS のみ対応
  const isAvailable = Platform.OS === 'ios';

  async function signInWithApple() {
    // PKCE 用の nonce を生成
    const rawNonce = Crypto.randomUUID();
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawNonce
    );

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!credential.identityToken) throw new Error('Apple identity token が取得できませんでした');

    const user = await linkWithApple(credential.identityToken, rawNonce);
    setUser(user);
    setStatus('linked');
  }

  return { signInWithApple, isAvailable };
}
