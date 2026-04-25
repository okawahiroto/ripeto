import '../global.css';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { subscribeAuthState, signInAnon } from '@/src/features/auth/api';
import { useAuthStore } from '@/src/stores/authStore';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  // Firebase 認証状態を購読し、未ログインなら匿名ログインを自動実行
  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (user) => {
      if (user) {
        setUser(user);
        setStatus(user.isAnonymous ? 'anonymous' : 'linked');
      } else {
        // 未ログイン → 匿名ログインを自動実行
        try {
          await signInAnon();
        } catch (e) {
          console.error('匿名ログインに失敗しました', e);
        }
      }
    });

    return unsubscribe;
  }, [setUser, setStatus]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        {/* ゴール */}
        <Stack.Screen name="goals/new" options={{ title: 'ゴールを追加', presentation: 'modal' }} />
        <Stack.Screen name="goals/[goalId]/index" options={{ title: '曲目' }} />
        {/* 曲目 */}
        <Stack.Screen name="goals/[goalId]/pieces/new" options={{ title: '曲目を追加', presentation: 'modal' }} />
        <Stack.Screen name="goals/[goalId]/pieces/[pieceId]/index" options={{ title: '練習箇所' }} />
        {/* 練習箇所 */}
        <Stack.Screen name="goals/[goalId]/pieces/[pieceId]/sections/new" options={{ title: '練習箇所を追加', presentation: 'modal' }} />
        <Stack.Screen name="goals/[goalId]/pieces/[pieceId]/sections/[sectionId]/index" options={{ title: '練習記録' }} />
      </Stack>
    </ThemeProvider>
  );
}
