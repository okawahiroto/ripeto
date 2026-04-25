import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createPiece } from '@/src/features/pieces/api';

export default function NewPieceScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('入力エラー', '曲名を入力してください');
      return;
    }
    try {
      setLoading(true);
      await createPiece(goalId, title.trim());
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
        曲目を追加
      </Text>

      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
        曲名
      </Text>
      <TextInput
        style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#1f2937', marginBottom: 32 }}
        placeholder="例: ショパン バラード第1番"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        returnKeyType="done"
        autoFocus
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
