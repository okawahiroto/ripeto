import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { fetchActiveGoals, completeGoal, deleteGoal } from '@/src/features/goals/api';
import { AdBanner } from '@/src/components/BannerAd';
import type { Goal } from '@/src/types/models';

function daysUntil(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function GoalCard({
  goal,
  onComplete,
  onDelete,
}: {
  goal: Goal;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const days = daysUntil(goal.eventDate);
  const daysColor = days <= 7 ? '#ef4444' : days <= 30 ? '#f59e0b' : '#3b82f6';
  const daysBg = days <= 7 ? '#fee2e2' : days <= 30 ? '#fef3c7' : '#dbeafe';
  const daysLabel = days > 0 ? `あと${days}日` : days === 0 ? '今日！' : `${Math.abs(days)}日前`;

  return (
    <Pressable
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
      }}
      onPress={() => router.push(`/goals/${goal.id}` as Href)}
    >
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Text
          style={{ fontSize: 17, fontWeight: '600', color: '#1f2937', flex: 1, marginRight: 8 }}
          numberOfLines={1}
        >
          {goal.title}
        </Text>
        <View
          style={{
            backgroundColor: daysBg,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 99,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: daysColor }}>{daysLabel}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
        {goal.eventDate.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            style={{
              backgroundColor: '#eff6ff',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 99,
            }}
            onPress={() => router.push(`/goals/${goal.id}/edit` as Href)}
          >
            <Text style={{ fontSize: 13, color: '#3b82f6', fontWeight: '500' }}>編集</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: '#f3f4f6',
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 99,
            }}
            onPress={() => {
              if (Platform.OS === 'web') {
                if (window.confirm(`「${goal.title}」を完了にしますか？`)) onComplete(goal.id);
              } else {
                Alert.alert('完了にする', `「${goal.title}」を完了にしますか？`, [
                  { text: 'キャンセル', style: 'cancel' },
                  { text: '完了', onPress: () => onComplete(goal.id) },
                ]);
              }
            }}
          >
            <Text style={{ fontSize: 13, color: '#6b7280' }}>完了にする</Text>
          </Pressable>
        </View>
        <Pressable
          style={{
            backgroundColor: '#fee2e2',
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 99,
          }}
          onPress={() => {
              if (Platform.OS === 'web') {
                if (window.confirm(`「${goal.title}」を削除しますか？\nこの操作は取り消せません。`)) onDelete(goal.id);
              } else {
                Alert.alert('ゴールを削除', `「${goal.title}」を削除しますか？\nこの操作は取り消せません。`, [
                  { text: 'キャンセル', style: 'cancel' },
                  { text: '削除', style: 'destructive', onPress: () => onDelete(goal.id) },
                ]);
              }
            }}
        >
          <Text style={{ fontSize: 13, color: '#ef4444', fontWeight: '500' }}>削除</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { auth } = await import('@/src/lib/firebase');
      // 認証完了を待ってから Firestore を叩く
      if (!auth.currentUser) {
        await new Promise<void>((resolve) => {
          const unsub = auth.onAuthStateChanged((user) => {
            if (user) {
              unsub();
              resolve();
            }
          });
        });
      }
      const data = await fetchActiveGoals();
      setGoals(data);
    } catch (e) {
      console.error('fetchActiveGoals error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  async function handleComplete(goalId: string) {
    await completeGoal(goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }

  async function handleDelete(goalId: string) {
    await deleteGoal(goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalCard goal={item} onComplete={handleComplete} onDelete={handleDelete} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Text style={{ fontSize: 16, color: '#9ca3af' }}>ゴールがまだありません</Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 4 }}>
              ＋ボタンから追加してください
            </Text>
          </View>
        }
      />
      {/* バナー広告（下部固定） */}
      <AdBanner fixed />
      <Pressable
        style={{
          position: 'absolute',
          bottom: 70,
          right: 24,
          backgroundColor: '#3b82f6',
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => router.push('/goals/new' as Href)}
      >
        <Text style={{ color: '#fff', fontSize: 32, lineHeight: 36 }}>+</Text>
      </Pressable>
    </View>
  );
}
