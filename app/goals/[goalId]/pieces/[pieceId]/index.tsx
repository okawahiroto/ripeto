import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { fetchSections } from '@/src/features/sections/api';
import { StarBadge } from '@/src/components/StarBadge';
import type { Section } from '@/src/types/models';

function SectionCard({ section }: { section: Section }) {
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      onPress={() =>
        router.push(
          `/goals/${section.goalId}/pieces/${section.pieceId}/sections/${section.id}` as Href
        )
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: '#1f2937' }}>{section.title}</Text>
        <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
          {section.practiceCount}回練習
        </Text>
      </View>
      <StarBadge count={section.practiceCount} size="small" />
    </Pressable>
  );
}

export default function PieceDetailScreen() {
  const { goalId, pieceId } = useLocalSearchParams<{ goalId: string; pieceId: string }>();
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSections(goalId, pieceId);
      setSections(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [goalId, pieceId]);

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
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SectionCard section={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <Text style={{ fontSize: 16, color: '#9ca3af' }}>練習箇所がまだありません</Text>
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
        onPress={() => router.push(`/goals/${goalId}/pieces/${pieceId}/sections/new` as Href)}
      >
        <Text style={{ color: '#fff', fontSize: 32, lineHeight: 36 }}>+</Text>
      </Pressable>
    </View>
  );
}
