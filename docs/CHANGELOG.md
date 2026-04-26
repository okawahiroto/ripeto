# Changelog

## 2026-04-26 — iOSシミュレータ動作確認

### 経緯
`expo run:ios` がシミュレータを実機として誤認識し、コード署名エラーで失敗。
原因は Xcode 26（beta）が新しすぎて Expo SDK 54 の CLI が devicectl の出力を解析できないバグ。

### 対応
Expo CLI を諦め、Xcode コマンドラインツールを直接使う方法で解決:
1. `xcodebuild -sdk iphonesimulator` でシミュレータ向けビルド
2. `xcrun simctl install` でシミュレータにインストール
3. `xcrun simctl launch` でアプリ起動

### 結果
iPhone 17 Pro シミュレータ（iOS 26）で正常起動・動作確認済み。

### 注意点
- EAS Build（本番ビルド）ではこの問題は発生しない
- Expo SDK がアップグレードされれば `expo run:ios` が直る可能性あり

---

## 2026-04-26 — アプリ名・Bundle ID変更

### 変更内容
- アプリ名: `Crescendo` → `Ripeto`（イタリア語で「繰り返す」、名前競合のため変更）
- Bundle ID: `com.crescendo.app` → `com.okawahiroto.ripeto`
- 変更ファイル: `app.config.ts` / `app/premium.tsx` / `package.json`

### 外部サービス側の対応
- Firebase: iOS/Android アプリを `com.okawahiroto.ripeto` で再登録済み
- AdMob: アプリ名を Ripeto で登録済み
- RevenueCat: `com.okawahiroto.ripeto` で登録済み

---

## 2026-04-26 — Hotfix: AdMob Web 500エラー修正

### 問題
`react-native-google-mobile-ads` が Web 非対応のため、CelebrationOverlay と同様に
Metro が Web バンドル時にネイティブ専用モジュールを require してクラッシュ。

### 対応
`admob.ts` と `BannerAd.tsx` をプラットフォーム別に分離:
- `src/lib/admob.native.ts` — iOS/Android 用（実際の AdMob 初期化）
- `src/lib/admob.ts` — Web 用スタブ（何もしない）
- `src/components/BannerAd.native.tsx` — iOS/Android 用（BannerAd コンポーネント）
- `src/components/BannerAd.tsx` — Web 用スタブ（null を返す）

---

## 2026-04-26 — Phase 6: 収益化（AdMob・RevenueCat）

### パッケージ追加
- `react-native-google-mobile-ads` — AdMob バナー広告
- `react-native-purchases` — RevenueCat 課金管理

### 外部サービス設定
- AdMob: iOS・Android アプリ登録、バナー広告ユニット作成（パートナー入札有効）
- RevenueCat: プロジェクト作成、iOS アプリ登録、P8キー設定
- 各キーを `.env` に設定済み（`ADMOB_*` 4項目、`REVENUECAT_API_KEY_IOS`）
- `REVENUECAT_API_KEY_ANDROID` は Google Play Console 登録後に設定予定

### 実装内容
- `src/lib/admob.native.ts` — AdMob 初期化・バナーID管理（未設定時はGoogleテストIDを使用）
- `src/lib/purchases.ts` — RevenueCat 初期化・premium 判定（`checkPremium()`）
- `src/stores/purchaseStore.ts` — `isPremium` を Zustand で管理
- `src/components/BannerAd.native.tsx` — バナー広告コンポーネント（premium ユーザーは非表示）
- `app/premium.tsx` — 買い切り購入・復元画面
- `app/(tabs)/index.tsx` — ゴール一覧下部にバナー広告を追加
- `app/(tabs)/two.tsx` — ダッシュボード下部にバナー広告・プレミアム導線を追加
- `app/_layout.tsx` — 起動時に AdMob・RevenueCat を初期化、premium 状態を取得

### 課金フロー
- RevenueCat の `premium` entitlement を保有しているか起動時にチェック
- 保有者は広告が完全非表示（`isPremium === true`）
- 購入・復元は `app/premium.tsx` から実行

---

## 2026-04-26 — セキュリティチェック

### 確認内容と結果（全項目クリア）

| 確認項目 | 結果 |
|---|---|
| `.env` が git 管理下か | ✅ `.gitignore` で除外済み、未追跡 |
| `.env.example` の内容 | ✅ キー名のみ、値は空 |
| `app.config.ts` にベタ書きがないか | ✅ `process.env.*` 参照のみ |
| `src/lib/firebase.ts` にベタ書きがないか | ✅ `Constants.expoConfig.extra` 経由 |
| `google-services.json` / `GoogleService-Info.plist` の混入 | ✅ ファイル自体なし |
| git 全履歴に `AIza...` 等の実キーが含まれるか | ✅ なし |
| `eas.json` の混入 | ✅ ファイル自体なし |
| `package.json` にキー・トークンの直書きがないか | ✅ なし |

### 秘匿値の流れ（設計）
```
.env（gitignore済み）
  └─ app.config.ts（process.env.* で読み込み）
       └─ expo-constants（Constants.expoConfig.extra）
            └─ src/lib/firebase.ts 等（実行時に参照）
```

### 将来の注意点
- EAS Build を使う際は `eas secret:create` で EAS Secrets に移行する
- `google-services.json` / `GoogleService-Info.plist` は生成されても `.gitignore` に追加すること

---

## 2026-04-26 — Hotfix: Web 500エラー修正

### 問題
`lottie-react-native` の web エントリが `@lottiefiles/dotlottie-react`（未インストール）を
`require` するため、Web バンドルで 500 Internal Server Error が発生。
Metro はランタイムの `Platform.OS` 条件に関わらず全 `require` をバンドルするため、
条件分岐だけでは回避不可。

### 対応
`CelebrationOverlay` をプラットフォーム別ファイルに分離:

- `src/components/CelebrationOverlay.native.tsx` — iOS/Android 用（LottieView を直接使用）
- `src/components/CelebrationOverlay.tsx` — Web 用（Reanimated のみ、Lottie なし）

Metro のファイル解決ルール（`.native.tsx` 優先）により自動的に振り分けられる。

---

## 2026-04-26 — Phase 5: 星演出・お祝いアニメーション

### パッケージ追加
- `react-native-reanimated@3.x` — バウンスアニメーション
- `lottie-react-native` + `assets/lottie/confetti.json` / `fireworks.json`

### コンポーネント実装
- `src/components/StarBadge.tsx`
  - `practiceCount` に応じて4段階で星絵文字・色を切り替え（empty / yellow / gold / rainbow）
  - `size="large"` — 練習記録画面の中央に大きく表示、ラベルバッジ付き
  - `size="small"` — 一覧画面のバッジ表示
  - `animate` prop が true のとき Reanimated でバウンス（`withSequence + withSpring`）
  - `getNextMilestone(count)` — 次のマイルストーンまでの残り回数テキストを返す
  - `checkMilestone(prev, next)` — カウントアップ時にマイルストーン到達を判定し `'gold' | 'rainbow' | null` を返す

- `src/components/CelebrationOverlay.native.tsx` / `.tsx`
  - Modal + 半透明バックドロップ + カードをスプリングアニメーションで表示
  - 3秒後に自動クローズ、タップでも閉じる
  - ネイティブ版: LottieView で紙吹雪（confetti）または花火（fireworks）を全画面再生
  - Web 版: Lottie なし、アニメーション演出のみ

### 既存画面への組み込み
- `app/goals/[goalId]/pieces/[pieceId]/index.tsx` — 各セクションカードに `StarBadge size="small"` を追加
- `app/goals/[goalId]/pieces/[pieceId]/sections/[sectionId]/index.tsx`
  - 画面上部に `StarBadge size="large" animate={animateStar}` を表示
  - 練習回数を大きく表示 + 次のマイルストーンまでの残り回数テキスト
  - `handleAddLog` 内で `checkMilestone` を呼び出し、達成時に300ms後に `CelebrationOverlay` を表示
  - 星バウンスは記録直後に800msで再生

---

## 2026-04-26 — Phase 4: ダッシュボード

### API
- `src/features/dashboard/api.ts` — `fetchDashboardStats()`
  - アクティブなゴール全件を取得し、pieces/sections をネスト並列で集計
  - `totalPracticeCount`（全練習回数合計）/ `totalSections`（練習箇所数）/ `totalPieces`（曲数）
  - Firestore 複合インデックスを避けるためクライアント側で集計

### 画面実装
- `app/(tabs)/two.tsx` — ダッシュボード画面
  - `CountdownCard` — 直近3件のゴールを残り日数つきで表示（色分け: 赤7日以内 / 橙30日以内 / 緑それ以外）
  - `StatCard` — ゴール数・曲数・練習箇所数の3つのカウンターをグリッド表示
  - `StarDisplay` — 総練習回数を星で表示（10回刻みの星 + 余り回数テキスト）
  - `useFocusEffect` でタブ切り替え時に自動リロード

### タブナビゲーション更新
- `app/(tabs)/_layout.tsx` — タブ2を「ダッシュボード」に変更

---

## 2026-04-26 — Phase 3: コア機能 CRUD

### パッケージ追加
- `react-hook-form` / `zod` / `@hookform/resolvers`

### 型定義
- `src/types/models.ts` — Goal / Piece / Section / PracticeLog の型と `getStarLevel()` を定義

### Firestore API
- `src/features/goals/api.ts` — `createGoal` / `fetchActiveGoals` / `completeGoal`
- `src/features/pieces/api.ts` — `createPiece` / `fetchPieces` / `deletePiece`
- `src/features/sections/api.ts` — `createSection` / `fetchSections` / `incrementPracticeCount` / `deleteSection`
- `src/features/logs/api.ts` — `addLog`（practiceCount +1 を同時実行）/ `fetchLogs`

### 画面実装
- `app/(tabs)/index.tsx` — ゴール一覧（残り日数バッジ・完了ボタン）
- `app/(tabs)/_layout.tsx` — タブアイコン・タイトルを変更
- `app/goals/new.tsx` — ゴール作成（タイトル + 本番日入力）
- `app/goals/[goalId]/index.tsx` — 曲目一覧
- `app/goals/[goalId]/pieces/new.tsx` — 曲目作成
- `app/goals/[goalId]/pieces/[pieceId]/index.tsx` — 練習箇所一覧（星絵文字表示）
- `app/goals/[goalId]/pieces/[pieceId]/sections/new.tsx` — 練習箇所作成
- `app/goals/[goalId]/pieces/[pieceId]/sections/[sectionId]/index.tsx` — 練習記録（星 + カウンター + ログ一覧）
  - 10回・100回達成時にアラート表示
  - メモ入力 → 「記録」ボタンで3タップ完了

### ナビゲーション
- `app/_layout.tsx` に全 Stack.Screen を登録
- modal presentation で作成画面をスライドアップ

---

## 2026-04-26 — Phase 2: 認証

### パッケージ追加

- `zustand@5.0.12` — 認証状態管理
- `expo-auth-session` / `expo-crypto` — Google OAuth
- `expo-apple-authentication` — Apple Sign In

### 実装内容

- `src/types/auth.ts` — `AuthStatus`（loading / anonymous / linked）と `AuthState` 型を定義
- `src/stores/authStore.ts` — Zustand で `user` / `status` を管理
- `src/lib/firebase.ts` — `initializeAuth` に AsyncStorage 永続化を追加
  - `getReactNativePersistence` は Metro が実行時に react-native 条件で解決
  - TypeScript 型解決の問題は `require` + 型キャストで回避
- `src/features/auth/api.ts`
  - `signInAnon()` — Firebase 匿名ログイン
  - `subscribeAuthState()` — 認証状態変化の購読
  - `linkWithGoogle()` — Google アカウントリンク
  - `linkWithApple()` — Apple アカウントリンク（PKCE nonce 付き）
- `src/features/auth/useGoogleAuth.ts` — Google OAuth フック（expo-auth-session）
- `src/features/auth/useAppleAuth.ts` — Apple Sign In フック（iOS のみ）
- `app/_layout.tsx` — 認証ガード追加
  - アプリ起動時に `onAuthStateChanged` を購読
  - 未ログイン時は `signInAnon()` を自動実行

### 引継ぎ事項

- Google ログインには Firebase Console で OAuth クライアント ID の発行が必要
  - `GOOGLE_IOS_CLIENT_ID` / `GOOGLE_ANDROID_CLIENT_ID` を `.env` に追加
- Apple ログインは iOS のみ（`expo-apple-authentication` は Android 非対応）
- Google / Apple リンクの UI 画面は Phase 3 以降に作成予定

## 2026-04-26 — Phase 1: プロジェクト基盤構築

### Expo プロジェクト初期化

- `create-expo-app@3.5.3` の `tabs` テンプレートで初期化
- Expo SDK 54 / Expo Router 6 / React Native 0.81.5 / React 19
- `app.json` を削除し `app.config.ts` に一本化
- アプリ名・スラッグ・スキームを `crescendo` に設定
- New Architecture (`newArchEnabled: true`) 有効

### NativeWind セットアップ

- `nativewind@4.2.3` + `tailwindcss@3.4.19` インストール
- `tailwind.config.js` 作成（`app/`, `src/`, `components/` をコンテンツ対象）
- `babel.config.js` 作成（`jsxImportSource: 'nativewind'` + `nativewind/babel` プリセット）
- `metro.config.js` 作成（`withNativeWind` でビルドに組み込み）
- `global.css` 作成（`@tailwind base/components/utilities`）
- `app/_layout.tsx` の先頭で `global.css` をインポート

### Firebase セットアップ

- `firebase@12.12.1` + `@react-native-async-storage/async-storage@3.0.2` インストール
- `src/lib/firebase.ts` を作成
  - `initializeApp` でアプリ初期化
  - `getAuth` で認証インスタンス生成（AsyncStorage 永続化は Phase 2 で実装）
  - `initializeFirestore` + `persistentLocalCache` でオフライン対応

### 環境変数管理

- `app.config.ts` の `extra` フィールドで全キーを管理
  - Firebase（6項目）、AdMob（4項目）、RevenueCat（2項目）
- `.env` を `.gitignore` に追加（コミット防止）
- `.env.example` は既存ファイルをそのまま活用

### ESLint / Prettier 設定

- ESLint v9 フラットコンフィグ（`eslint.config.js`）で設定
  - `@typescript-eslint` / `react` / `react-hooks` / `prettier` プラグイン
  - `any` 禁止、未使用変数エラー
- `.prettierrc` 作成（singleQuote, trailingComma: es5, printWidth: 100）
- `package.json` に `lint` / `format` スクリプト追加

### その他

- `src/` ディレクトリ構成を作成（`lib/`, `stores/`, `types/`, `features/`, `utils/`, `components/`）
- `tsconfig.json` に `customConditions: ["react-native"]` を追加
- TypeScript strict mode で型エラー 0 件を確認

### 次フェーズへの引継ぎ事項

- Firebase Console でプロジェクト作成が必要（手動）
- `.env` に Firebase キーを設定してから開発開始
- Auth の React Native 永続化（`getReactNativePersistence` + AsyncStorage）は Phase 2 で実装
