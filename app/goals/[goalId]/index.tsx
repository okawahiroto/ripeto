import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { fetchPieces } from '@/src/features/pieces/api';
import type { Piece } from '@/src/types/models';

function PieceCard({ piece }: { piece: Piece }) {
  const router = useRouter();
  return (
    <Pressable
      style={{
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f3f4f6',
      }}
      onPress={() => router.push(`/goals/${piece.goalId}/pieces/${piece.id}` as Href)}
    >
      <Text style={{ fontSize: 16, fontWeight: '500', color: '#1f2937' }}>{piece.title}</Text>
    </Pressable>
  );
}

export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const router = useRouter();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPieces(goalId);
      setPieces(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

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
        data={pieces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PieceCard piece={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Text style={{ fontSize: 16, color: '#9ca3af' }}>曲目がまだありません</Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 4 }}>
              ＋ボタンから追加してください
            </Text>
          </View>
        }
      />
      <Pressable
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: '#3b82f6',
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => router.push(`/goals/${goalId}/pieces/new` as Href)}
      >
        <Text style={{ color: '#fff', fontSize: 32, lineHeight: 36 }}>+</Text>
      </Pressable>
    </View>
  );
}
