import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchGoal, updateGoal } from '@/src/features/goals/api';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}

function parseDate(str: string): Date | null {
  const cleaned = str.replace(/\//g, '-');
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
}

export default function GoalEditScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [dateText, setDateText] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGoal(goalId)
      .then((goal) => {
        setTitle(goal.title);
        setDateText(formatDate(goal.eventDate));
      })
      .catch((e) => {
        console.error(e);
        Alert.alert('エラー', 'ゴールの読み込みに失敗しました');
        router.back();
      })
      .finally(() => setInitialLoading(false));
  }, [goalId, router]);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('入力エラー', 'タイトルを入力してください');
      return;
    }
    const eventDate = parseDate(dateText);
    if (!eventDate) {
      Alert.alert('入力エラー', '日付を YYYY/MM/DD 形式で入力してください');
      return;
    }

    try {
      setSaving(true);
      await updateGoal(goalId, title.trim(), eventDate);
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('エラー', `保存に失敗しました\n${e instanceof Error ? e.message : ''}`);
    } finally {
      setSaving(false);
    }
  }

  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#1f2937', marginBottom: 24 }}>
        ゴールを編集
      </Text>

      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
        タイトル
      </Text>
      <TextInput
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 16,
          color: '#1f2937',
          marginBottom: 20,
        }}
        placeholder="例: 春の発表会、JASTA コンクール"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        returnKeyType="next"
      />

      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
        本番日
      </Text>
      <TextInput
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 16,
          color: '#1f2937',
          marginBottom: 32,
        }}
        placeholder="例: 2026/08/01"
        placeholderTextColor="#9ca3af"
        value={dateText}
        onChangeText={setDateText}
        keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
        returnKeyType="done"
      />

      <Pressable
        style={{
          backgroundColor: saving ? '#93c5fd' : '#3b82f6',
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
        }}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>保存する</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
