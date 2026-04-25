import { useCallback, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { addLog, fetchLogs } from '@/src/features/logs/api';
import { fetchSections } from '@/src/features/sections/api';
import { StarBadge, getNextMilestone, checkMilestone } from '@/src/components/StarBadge';
import { CelebrationOverlay } from '@/src/components/CelebrationOverlay';
import type { PracticeLog, Section } from '@/src/types/models';

function LogItem({ log }: { log: PracticeLog }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#f3f4f6' }}>
      {log.note ? (
        <Text style={{ fontSize: 14, color: '#374151' }}>{log.note}</Text>
      ) : (
        <Text style={{ fontSize: 14, color: '#d1d5db', fontStyle: 'italic' }}>メモなし</Text>
      )}
      <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
        {log.createdAt.toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

export default function SectionDetailScreen() {
  const { goalId, pieceId, sectionId } = useLocalSearchParams<{
    goalId: string;
    pieceId: string;
    sectionId: string;
  }>();

  const [section, setSection] = useState<Section | null>(null);
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [celebration, setCelebration] = useState<'gold' | 'rainbow' | null>(null);
  const [animateStar, setAnimateStar] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [sections, logsData] = await Promise.all([
        fetchSections(goalId, pieceId),
        fetchLogs(goalId, pieceId, sectionId),
      ]);
      setSection(sections.find((s) => s.id === sectionId) ?? null);
      setLogs(logsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [goalId, pieceId, sectionId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  async function handleAddLog() {
    if (saving) return;
    try {
      setSaving(true);
      const newLog = await addLog(goalId, pieceId, sectionId, note.trim());
      const prevCount = section?.practiceCount ?? 0;
      const newCount = prevCount + 1;

      setLogs((prev) => [newLog, ...prev]);
      setNote('');
      setSection((prev) => (prev ? { ...prev, practiceCount: newCount } : prev));

      // 星アニメーション
      setAnimateStar(true);
      setTimeout(() => setAnimateStar(false), 800);

      // マイルストーン達成チェック
      const milestone = checkMilestone(prevCount, newCount);
      if (milestone) {
        setTimeout(() => setCelebration(milestone), 300);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !section) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const nextMilestone = getNextMilestone(section.practiceCount);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* 星と練習回数 */}
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', alignItems: 'center' }}>
        <StarBadge count={section.practiceCount} size="large" animate={animateStar} />
        <Text style={{ fontSize: 36, fontWeight: '800', color: '#1f2937', marginTop: 12 }}>
          {section.practiceCount}
        </Text>
        <Text style={{ fontSize: 13, color: '#9ca3af' }}>回練習</Text>
        {nextMilestone && (
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>{nextMilestone}</Text>
        )}
      </View>

      {/* ログ入力 */}
      <View style={{ backgroundColor: '#fff', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TextInput
          style={{ flex: 1, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: '#1f2937' }}
          placeholder="メモを入力（任意）"
          placeholderTextColor="#9ca3af"
          value={note}
          onChangeText={setNote}
          returnKeyType="done"
          onSubmitEditing={handleAddLog}
        />
        <Pressable
          style={{ backgroundColor: saving ? '#93c5fd' : '#3b82f6', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 }}
          onPress={handleAddLog}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>記録</Text>
          )}
        </Pressable>
      </View>

      {/* ログ一覧 */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogItem log={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 14, color: '#9ca3af' }}>まだ練習ログがありません</Text>
          </View>
        }
      />

      {/* お祝いオーバーレイ */}
      <CelebrationOverlay kind={celebration} onClose={() => setCelebration(null)} />
    </View>
  );
}
