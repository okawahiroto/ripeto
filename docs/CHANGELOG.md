# Changelog

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
