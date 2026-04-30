# Coordination

セッション跨ぎの作業メモ。Claude Codeのセッションが切れた時に「どこまでやったか」を記録する場所。

## 現在のフェーズ

**Phase 7: リリース準備（着手中）**
Phase 1〜6（基盤・認証・CRUD・ダッシュボード・星演出・収益化）はすべて完了済み。

## 次にやること

1. ~~プライバシーポリシー・利用規約~~ ✅
2. App Store 申請準備（スクリーンショット・説明文）
3. EAS Submit 設定（`eas.json` の `ascAppId` / `appleTeamId` 追記）
4. `REVENUECAT_API_KEY_ANDROID` の設定（Google Play Console 登録後）

## 直近の作業ログ

### 2026-05-01
- Android エミュレータ・実機の両方で動作確認済み
- プライバシーポリシー（app/legal/privacy.tsx）・利用規約（app/legal/terms.tsx）作成
- 設定タブ（app/(tabs)/settings.tsx）追加：プレミアム導線・アカウント連携・法的情報・バージョン表示

### 2026-04-30 (Phase 7 着手)
- EAS Build 設定完了（eas.json / EAS 環境変数11件登録）
- iOS シミュレータ・実機の両方でインストール・動作確認済み
- 詳細は docs/CHANGELOG.md の「2026-04-30 — Phase 7」を参照

### 2026-04-26 (Phase 1 完了)
- Expo SDK 54 + Expo Router 6 でプロジェクト初期化（タブ構成）
- NativeWind v4 + Tailwind CSS セットアップ（global.css, babel.config.js, metro.config.js, tailwind.config.js）
- Firebase SDK v12 インストール、src/lib/firebase.ts 雛形作成
  - Auth の React Native 永続化（AsyncStorage）は Phase 2 で実装
- app.config.ts で環境変数管理（Firebase / AdMob / RevenueCat キー）
- ESLint v9（フラットコンフィグ）+ Prettier 設定
- TypeScript strict mode で型エラー 0 件を確認

### 2026-04-25
- プロジェクト設計完了
- CLAUDE.md / DATA_MODEL.md / ROADMAP.md 作成
- 技術スタック確定（Expo + Firebase + RevenueCat）
- MVP仕様確定

## 未解決事項・要決定事項

- [ ] アプリ名を決める
- [ ] アプリアイコンのデザイン方針
- [ ] ブランドカラー
- [ ] 買い切り価格（¥500 / ¥980 / ¥1,500 など）
- [ ] AdMob アカウント開設
- [ ] Apple Developer Program 登録（年$99）
- [ ] Google Play Console 登録（一回$25）
