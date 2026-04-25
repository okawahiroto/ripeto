import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Platform, View } from 'react-native';
import { usePurchaseStore } from '@/src/stores/purchaseStore';
import { getBannerAdUnitId } from '@/src/lib/admob';

interface BannerAdBannerProps {
  /** 画面下部固定用に position: absolute を使うか */
  fixed?: boolean;
}

export function AdBanner({ fixed = false }: BannerAdBannerProps) {
  const isPremium = usePurchaseStore((s) => s.isPremium);

  // プレミアムユーザーには広告を表示しない
  if (isPremium) return null;

  // Web は react-native-google-mobile-ads が非対応のため非表示
  if (Platform.OS === 'web') return null;

  const adUnitId = __DEV__ ? TestIds.BANNER : getBannerAdUnitId();

  return (
    <View style={fixed ? { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' } : { alignItems: 'center' }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
