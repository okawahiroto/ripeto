import { Platform } from 'react-native';
import Constants from 'expo-constants';
import mobileAds from 'react-native-google-mobile-ads';

// テスト用バナーID（Googleが公式に提供するテストID）
const TEST_BANNER_ANDROID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_BANNER_IOS = 'ca-app-pub-3940256099942544/2934735716';

export function getBannerAdUnitId(): string {
  if (Platform.OS === 'ios') {
    return (Constants.expoConfig?.extra?.admobBannerIos as string | undefined) ?? TEST_BANNER_IOS;
  }
  return (
    (Constants.expoConfig?.extra?.admobBannerAndroid as string | undefined) ?? TEST_BANNER_ANDROID
  );
}

export async function initializeAdMob(): Promise<void> {
  await mobileAds().initialize();
}
