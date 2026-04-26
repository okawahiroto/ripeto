import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Purchases from 'react-native-purchases';
import { checkPremium } from '@/src/lib/purchases';
import { usePurchaseStore } from '@/src/stores/purchaseStore';

export default function PremiumScreen() {
  const router = useRouter();
  const setIsPremium = usePurchaseStore((s) => s.setIsPremium);
  const isPremium = usePurchaseStore((s) => s.isPremium);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  async function handlePurchase() {
    if (loading) return;
    try {
      setLoading(true);
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages[0];
      if (!pkg) {
        Alert.alert('エラー', '購入できる商品が見つかりません。');
        return;
      }
      await Purchases.purchasePackage(pkg);
      const premium = await checkPremium();
      setIsPremium(premium);
      if (premium) {
        Alert.alert('ありがとうございます！', '広告が非表示になりました。', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (e: unknown) {
      const err = e as { userCancelled?: boolean };
      if (!err.userCancelled) {
        Alert.alert('エラー', '購入に失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    if (restoring) return;
    try {
      setRestoring(true);
      await Purchases.restorePurchases();
      const premium = await checkPremium();
      setIsPremium(premium);
      Alert.alert(
        premium ? '復元完了' : '購入履歴なし',
        premium ? '広告が非表示になりました。' : '購入履歴が見つかりませんでした。'
      );
    } catch {
      Alert.alert('エラー', '復元に失敗しました。');
    } finally {
      setRestoring(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} contentContainerStyle={{ padding: 24 }}>
      {/* ヘッダー */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>⭐</Text>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#1f2937', marginBottom: 8 }}>
          Ripeto プレミアム
        </Text>
        <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22 }}>
          買い切りで広告を完全非表示にできます
        </Text>
      </View>

      {/* 特典リスト */}
      <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, gap: 14 }}>
        {[
          { icon: '🚫', text: '広告を完全非表示' },
          { icon: '🎵', text: '練習に集中できる環境' },
          { icon: '♾️', text: '買い切り・サブスク不要' },
          { icon: '🔄', text: '機種変更後も復元可能' },
        ].map(({ icon, text }) => (
          <View key={text} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 22 }}>{icon}</Text>
            <Text style={{ fontSize: 15, color: '#374151' }}>{text}</Text>
          </View>
        ))}
      </View>

      {isPremium ? (
        <View style={{ backgroundColor: '#d1fae5', borderRadius: 16, padding: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>✅</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#065f46', marginTop: 8 }}>
            プレミアム有効中
          </Text>
        </View>
      ) : (
        <>
          {/* 購入ボタン */}
          <Pressable
            style={{ backgroundColor: loading ? '#93c5fd' : '#3b82f6', borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 12 }}
            onPress={handlePurchase}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800' }}>
                広告を非表示にする
              </Text>
            )}
          </Pressable>

          {/* 復元ボタン */}
          <Pressable
            style={{ padding: 14, alignItems: 'center' }}
            onPress={handleRestore}
            disabled={restoring}
          >
            {restoring ? (
              <ActivityIndicator color="#6b7280" size="small" />
            ) : (
              <Text style={{ color: '#6b7280', fontSize: 14 }}>購入を復元する</Text>
            )}
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
