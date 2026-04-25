# Coordination

セッション跨ぎの作業メモ。Claude Codeのセッションが切れた時に「どこまでやったか」を記録する場所。

## 現在のフェーズ

**Phase 2: 完了 / Phase 3（コア機能 CRUD）着手前**

## 次にやること

1. Phase 3: ゴール・曲目・練習箇所・練習ログの CRUD 実装
2. Google ログイン用 OAuth クライアント ID を `.env` に追加（任意、後回し可）
   - `GOOGLE_IOS_CLIENT_ID` / `GOOGLE_ANDROID_CLIENT_ID`

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
