# Changelog

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
