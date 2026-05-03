import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

type CelebrationKind = 'gold' | 'rainbow';

interface CelebrationOverlayProps {
  kind: CelebrationKind | null;
  onClose: () => void;
}

const CELEBRATION_CONFIG = {
  gold: {
    emoji: '🌟',
    title: '10回達成！',
    message: 'ゴールドスターに輝きました',
    color: '#d97706',
    bg: '#fef9c3',
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    lottie: require('@/assets/lottie/confetti.json'),
  },
  rainbow: {
    emoji: '✨',
    title: '100回達成！',
    message: '虹色に輝く伝説の練習箇所！',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    lottie: require('@/assets/lottie/fireworks.json'),
  },
} as const;

export function CelebrationOverlay({ kind, onClose }: CelebrationOverlayProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (kind) {
      scale.value = withSpring(1, { damping: 12, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 200 });
      timerRef.current = setTimeout(onClose, 3000);
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [kind, onClose, scale, opacity]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  if (!kind) return null;

  const config = CELEBRATION_CONFIG[kind];

  return (
    <Modal transparent animationType="none" visible={!!kind}>
      <Animated.View
        style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' },
          backdropStyle,
        ]}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}
      >
        <LottieView source={config.lottie} autoPlay loop={false} style={{ flex: 1 }} />
      </View>
      <Pressable
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        onPress={onClose}
      >
        <Animated.View
          style={[
            {
              backgroundColor: config.bg,
              borderRadius: 24,
              padding: 36,
              alignItems: 'center',
              width: 280,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 10,
            },
            cardStyle,
          ]}
        >
          <Text style={{ fontSize: 72, marginBottom: 8 }}>{config.emoji}</Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: config.color, marginBottom: 8 }}>
            {config.title}
          </Text>
          <Text style={{ fontSize: 15, color: '#374151', textAlign: 'center', lineHeight: 22 }}>
            {config.message}
          </Text>
          <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 20 }}>タップで閉じる</Text>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
