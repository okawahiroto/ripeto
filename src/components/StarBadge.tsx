import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { getStarLevel } from '@/src/types/models';

interface StarBadgeProps {
  count: number;
  /** 大きめ表示（練習記録画面の中央）か小さめ（一覧のバッジ）か */
  size?: 'large' | 'small';
  /** カウントが変わったときにアニメーションを再生 */
  animate?: boolean;
}

const STAR_CONFIG = {
  empty: { emoji: '☆', color: '#9ca3af', bg: '#f3f4f6', label: '未練習' },
  yellow: { emoji: '⭐', color: '#f59e0b', bg: '#fef3c7', label: '練習中' },
  gold: { emoji: '🌟', color: '#d97706', bg: '#fef9c3', label: 'ゴールド' },
  rainbow: { emoji: '✨', color: '#8b5cf6', bg: '#f5f3ff', label: '虹色' },
} as const;

export function StarBadge({ count, size = 'small', animate = false }: StarBadgeProps) {
  const level = getStarLevel(count);
  const config = STAR_CONFIG[level];
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!animate) return;
    scale.value = withSequence(
      withSpring(1.4, { damping: 4, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 150 })
    );
  }, [count, animate, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (size === 'large') {
    return (
      <View style={{ alignItems: 'center' }}>
        <Animated.Text style={[{ fontSize: 72 }, animatedStyle]}>
          {config.emoji}
        </Animated.Text>
        <View style={{ backgroundColor: config.bg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, marginTop: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: config.color }}>
            {config.label}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.Text style={[{ fontSize: 28 }, animatedStyle]}>
      {config.emoji}
    </Animated.Text>
  );
}

/** 練習回数に応じた段階テキストを返す */
export function getNextMilestone(count: number): string | null {
  if (count < 10) return `あと ${10 - count} 回で🌟ゴールド`;
  if (count < 100) return `あと ${100 - count} 回で✨虹色`;
  return null;
}

/** カウントアップ時に milestone を跨いだか判定 */
export function checkMilestone(prev: number, next: number): 'gold' | 'rainbow' | null {
  if (prev < 10 && next >= 10) return 'gold';
  if (prev < 100 && next >= 100) return 'rainbow';
  return null;
}

// withTiming を使用していることを明示
void withTiming;
