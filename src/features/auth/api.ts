import {
  signInAnonymously,
  onAuthStateChanged,
  linkWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from '@/src/lib/firebase';

/** 匿名ログイン */
export async function signInAnon(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

/** 認証状態の変化を購読（アンサブスクライブ関数を返す） */
export function subscribeAuthState(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/** 匿名アカウントに Google アカウントをリンク */
export async function linkWithGoogle(idToken: string): Promise<User> {
  const user = auth.currentUser;
  if (!user) throw new Error('ログインユーザーが存在しません');

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await linkWithCredential(user, credential);
  return result.user;
}

/** 匿名アカウントに Apple アカウントをリンク */
export async function linkWithApple(idToken: string, nonce: string): Promise<User> {
  const user = auth.currentUser;
  if (!user) throw new Error('ログインユーザーが存在しません');

  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken, rawNonce: nonce });
  const result = await linkWithCredential(user, credential);
  return result.user;
}
