import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { createGoal } from '@/src/features/goals/api';

export default function NewGoalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [dateText, setDateText] = useState('');
  const [loading, setLoading] = useState(false);

  function parseDate(str: string): Date | null {
    // YYYY/MM/DD または YYYY-MM-DD を受け付ける
    const cleaned = str.replace(/\//g, '-');
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? null : d;
  }

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
      setLoading(true);
      await createGoal(title.trim(), eventDate);
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('エラー', '保存に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#1f2937', marginBottom: 24 }}>
        ゴールを追加
      </Text>

      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
        タイトル
      </Text>
      <TextInput
        style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#1f2937', marginBottom: 20 }}
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
        style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#1f2937', marginBottom: 32 }}
        placeholder="例: 2026/08/01"
        placeholderTextColor="#9ca3af"
        value={dateText}
        onChangeText={setDateText}
        keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
        returnKeyType="done"
      />

      <Pressable
        style={{ backgroundColor: loading ? '#93c5fd' : '#3b82f6', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>保存する</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
