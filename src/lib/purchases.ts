import { Platform } from 'react-native';
import Constants from 'expo-constants';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// RevenueCat の entitlement 識別子（ダッシュボードで設定する値と合わせる）
export const PREMIUM_ENTITLEMENT_ID = 'premium';

export function initializePurchases(): void {
  const apiKey =
    Platform.OS === 'ios'
      ? (Constants.expoConfig?.extra?.revenuecatApiKeyIos as string | undefined)
      : (Constants.expoConfig?.extra?.revenuecatApiKeyAndroid as string | undefined);

  if (!apiKey) {
    console.warn('[Purchases] RevenueCat API key が未設定です。課金機能は無効化されます。');
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey });
}

/** ユーザーが premium entitlement を持っているか確認 */
export async function checkPremium(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}
