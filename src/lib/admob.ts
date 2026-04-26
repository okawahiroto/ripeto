// Web用スタブ（react-native-google-mobile-adsはWeb非対応）
export function getBannerAdUnitId(): string {
  return '';
}

export async function initializeAdMob(): Promise<void> {
  // Web では何もしない
}
