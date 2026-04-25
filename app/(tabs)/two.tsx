import { useCallback, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { fetchDashboardStats } from '@/src/features/dashboard/api';
import { auth } from '@/src/lib/firebase';
import { AdBanner } from '@/src/components/BannerAd';
import type { DashboardStats } from '@/src/features/dashboard/api';

function CountdownCard({ goal }: { goal: DashboardStats['upcomingGoals'][number] }) {
  const { daysUntil } = goal;
  const isUrgent = daysUntil <= 7;
  const isNear = daysUntil <= 30;
  const accentColor = isUrgent ? '#ef4444' : isNear ? '#f59e0b' : '#3b82f6';
  const bgColor = isUrgent ? '#fef2f2' : isNear ? '#fffbeb' : '#eff6ff';
  const label = daysUntil > 0 ? `あと ${daysUntil} 日` : daysUntil === 0 ? '今日！' : `${Math.abs(daysUntil)} 日前`;

  return (
    <View style={{ backgroundColor: bgColor, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: accentColor + '33' }}>
      <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
        {goal.eventDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
      </Text>
      <Text style={{ fontSize: 17, fontWeight: '600', color: '#1f2937', marginBottom: 8 }} numberOfLines={1}>
        {goal.title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={{ fontSize: 36, fontWeight: '800', color: accentColor, lineHeight: 40 }}>
          {daysUntil > 0 ? daysUntil : daysUntil === 0 ? '🎵' : Math.abs(daysUntil)}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: accentColor, marginLeft: 4 }}>
          {daysUntil > 0 ? '日' : daysUntil === 0 ? '' : '日前'}
        </Text>
      </View>
      {daysUntil > 0 && (
        <Text style={{ fontSize: 12, color: accentColor, marginTop: 2 }}>まで</Text>
      )}
    </View>
  );
}

function StatCard({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6' }}>
      <Text style={{ fontSize: 24 }}>{emoji}</Text>
      <Text style={{ fontSize: 26, fontWeight: '700', color: '#1f2937', marginTop: 4 }}>{value}</Text>
      <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function StarDisplay({ totalCount }: { totalCount: number }) {
  const starCount = Math.floor(totalCount / 10);
  const remainder = totalCount % 10;

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f3f4f6' }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
        総練習回数
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 }}>
        <Text style={{ fontSize: 40, fontWeight: '800', color: '#1f2937' }}>{totalCount}</Text>
        <Text style={{ fontSize: 18, color: '#6b7280', marginLeft: 4 }}>回</Text>
      </View>
      {starCount > 0 && (
        <View>
          <Text style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>
            🌟 × {starCount}（10回ごとに1つ）
          </Text>
          <Text style={{ fontSize: 28, letterSpacing: 2 }}>
            {'⭐'.repeat(Math.min(starCount, 20))}
            {starCount > 20 ? ` +${starCount - 20}` : ''}
          </Text>
        </View>
      )}
      {totalCount > 0 && remainder > 0 && (
        <View style={{ marginTop: 8, backgroundColor: '#f9fafb', borderRadius: 8, padding: 8 }}>
          <Text style={{ fontSize: 12, color: '#9ca3af' }}>
            次の⭐まであと {10 - remainder} 回
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View
                key={i}
                style={{ width: 8, height: 8, borderRadius: 4, marginRight: 3, backgroundColor: i < remainder ? '#f59e0b' : '#e5e7eb' }}
              />
            ))}
          </View>
        </View>
      )}
      {totalCount === 0 && (
        <Text style={{ fontSize: 13, color: '#9ca3af' }}>まだ練習記録がありません</Text>
      )}
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      if (!auth.currentUser) {
        await new Promise<void>((resolve) => {
          const unsub = auth.onAuthStateChanged((user) => {
            if (user) { unsub(); resolve(); }
          });
        });
      }
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (e) {
      console.error('dashboard error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <Text style={{ color: '#9ca3af' }}>データを取得できませんでした</Text>
        <Pressable onPress={() => void load()} style={{ marginTop: 12 }}>
          <Text style={{ color: '#3b82f6' }}>再読み込み</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>

      {/* 直近ゴール カウントダウン */}
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 12 }}>
        本番まで
      </Text>
      {stats.upcomingGoals.length > 0 ? (
        stats.upcomingGoals.map((g) => <CountdownCard key={g.id} goal={g} />)
      ) : (
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' }}>
          <Text style={{ color: '#9ca3af', fontSize: 14 }}>ゴールがまだありません</Text>
        </View>
      )}

      {/* 統計カード */}
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 8, marginBottom: 12 }}>
        現在の状況
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        <StatCard label="ゴール" value={stats.goalCount} emoji="🎯" />
        <StatCard label="曲目" value={stats.pieceCount} emoji="🎵" />
        <StatCard label="練習箇所" value={stats.sectionCount} emoji="📍" />
      </View>

      {/* 総練習回数 & 星 */}
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 8, marginBottom: 12 }}>
        積み上げ
      </Text>
      <StarDisplay totalCount={stats.totalPracticeCount} />

      {/* プレミアムへの導線 */}
      <Pressable
        style={{ marginTop: 24, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' }}
        onPress={() => router.push('/premium' as Href)}
      >
        <Text style={{ fontSize: 13, color: '#6b7280' }}>⭐ 広告を非表示にする</Text>
      </Pressable>

    </ScrollView>
    {/* バナー広告（下部固定） */}
    <AdBanner fixed />
    </View>
  );
}
