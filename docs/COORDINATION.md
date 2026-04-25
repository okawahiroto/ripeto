# Coordination

セッション跨ぎの作業メモ。Claude Codeのセッションが切れた時に「どこまでやったか」を記録する場所。

## 現在のフェーズ

**Phase 1: 完了 / Phase 2（認証）着手前**

## 次にやること

1. Firebase プロジェクトの作成（Firebase Console で手動）
2. `.env` に Firebase キーを設定
3. Phase 2: Firebase 匿名認証 + Zustand 認証状態管理の実装

## 直近の作業ログ

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
