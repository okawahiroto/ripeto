import { View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { useAuthStore } from '@/src/stores/authStore';
import { usePurchaseStore } from '@/src/stores/purchaseStore';
import { useGoogleAuth } from '@/src/features/auth/useGoogleAuth';
import { useAppleAuth } from '@/src/features/auth/useAppleAuth';
import Constants from 'expo-constants';

function Row({
  label,
  value,
  onPress,
  chevron = true,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: pressed && onPress ? '#f3f4f6' : '#fff',
      })}
    >
      <Text style={{ fontSize: 15, color: '#1f2937' }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {value && <Text style={{ fontSize: 14, color: '#9ca3af' }}>{value}</Text>}
        {chevron && onPress && <Text style={{ fontSize: 16, color: '#d1d5db' }}>›</Text>}
      </View>
    </Pressable>
  );
}

function SectionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: '#6b7280',
          marginBottom: 6,
          paddingHorizontal: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#f3f4f6',
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#f3f4f6', marginLeft: 16 }} />;
}

export { SettingsScreen as default };

function SettingsScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const isPremium = usePurchaseStore((s) => s.isPremium);
  const { promptAsync: promptGoogle } = useGoogleAuth();
  const { signInWithApple, isAvailable: isAppleAvailable } = useAppleAuth();

  const isLinked = status === 'linked';
  const version = (Constants.expoConfig?.version ?? '1.0.0') as string;

  async function handleGoogleLink() {
    try {
      await promptGoogle();
    } catch {
      Alert.alert('エラー', 'Googleアカウントの連携に失敗しました。');
    }
  }

  async function handleAppleLink() {
    try {
      await signInWithApple();
    } catch {
      Alert.alert('エラー', 'Appleアカウントの連携に失敗しました。');
    }
  }

  const accountLabel = isLinked ? (user?.email ?? '連携済み') : '未連携（匿名）';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
    >
      {/* プレミアム */}
      <SectionGroup title="プレミアム">
        <Row
          label={isPremium ? '✅ プレミアム有効中' : '⭐ 広告を非表示にする'}
          onPress={() => router.push('/premium' as Href)}
        />
      </SectionGroup>

      {/* アカウント */}
      <SectionGroup title="アカウント">
        <Row label="ステータス" value={accountLabel} chevron={false} />
        {!isLinked && (
          <>
            <Divider />
            <Row label="Googleアカウントで引き継ぐ" onPress={handleGoogleLink} />
            {isAppleAvailable && Platform.OS === 'ios' && (
              <>
                <Divider />
                <Row label="Appleアカウントで引き継ぐ" onPress={handleAppleLink} />
              </>
            )}
          </>
        )}
      </SectionGroup>

      {/* 法的情報 */}
      <SectionGroup title="法的情報">
        <Row label="プライバシーポリシー" onPress={() => router.push('/legal/privacy' as Href)} />
        <Divider />
        <Row label="利用規約" onPress={() => router.push('/legal/terms' as Href)} />
      </SectionGroup>

      {/* バージョン */}
      <SectionGroup title="アプリ情報">
        <Row label="バージョン" value={`v${version}`} chevron={false} />
      </SectionGroup>
    </ScrollView>
  );
}
