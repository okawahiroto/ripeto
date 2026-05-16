# Coordination

セッション跨ぎの作業メモ。Claude Codeのセッションが切れた時に「どこまでやったか」を記録する場所。

## 現在のフェーズ

**v1.0 リリース済み（iOS App Store 公開中）**
2026-05-17 に iOS 審査承認。App Store 公開済み。

## 次にやること

1. App内課金（ripeto_premium）の動作確認（Sandbox テスト）
2. Android 製品版プロモート（Play Console で内部テスト → 製品版へ昇格）
3. Android サービスアカウント設定（Google Play Console の API アクセスが解放され次第）
4. App Store レビュー・ダウンロード状況のモニタリング（App Analytics）

## 直近の作業ログ

### 2026-05-07（iOS App Store 承認・v1.0 公開）
- App Review より承認メール受領
- v1.0 App Store 公開完了（人生初のiOSアプリリリース）

### 2026-05-05（iOS 審査リジェクト対応・再提出）
- 審査リジェクト理由：Apple サインイン時にエラーが発生（Guideline 2.1a）
- 対応方針：Apple/Google サインイン UI を v1.0 から削除（v1.1 で再実装予定）
  - 理由：Googleログインを残す場合 Apple ログインも必須（Guideline 4.8）のため両方削除
  - `useAppleAuth.ts` / `useGoogleAuth.ts` はコードとして保持（資産として残す）
- `app/(tabs)/settings.tsx` からアカウント連携 UI を削除
- EAS Build（ビルド番号5）→ EAS Submit で再提出完了

### 2026-05-01（Phase 7 完了・iOS 審査提出）
- プライバシーポリシー（app/legal/privacy.tsx）・利用規約（app/legal/terms.tsx）作成
- 設定タブ（app/(tabs)/settings.tsx）追加：プレミアム導線・アカウント連携・法的情報・バージョン表示
- ストアリスティング原稿作成（docs/STORE_LISTING.md）
- EAS Metadata 設定ファイル作成（store.config.json）
- GitHub リポジトリ作成・公開（https://github.com/okawahiroto/ripeto）
- GitHub Pages でプライバシーポリシー・利用規約をホスティング（docs/privacy.html, docs/terms.html）
- LICENSE 追加（All Rights Reserved）
- Apple Developer Program・Google Play Console 登録完了
- EAS eas.json に ascAppId（6763823548）・appleTeamId（8J55C67JWN）を追記
- RevenueCat Android アプリ追加・REVENUECAT_API_KEY_ANDROID を EAS 環境変数に登録
- iOS スクリーンショット撮影（1284×2778px / iPhone 17 Pro Max）
- iPad スクリーンショット撮影（2064×2752px / iPad Pro 13インチ M5）
- app.config.ts に ITSAppUsesNonExemptEncryption: false を追加（輸出コンプライアンス自動化）
- EAS Build でプロダクションビルド作成（iOS・Android）
- iOS：EAS Submit で App Store Connect に提出 → 審査提出完了
- Android：Play Console に AAB を手動アップロード → 内部テスト公開済み

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

- [ ] App内課金（ripeto_premium）App Store Connect への正式登録・Sandbox テスト
- [ ] Android サービスアカウント設定（Google Play Console API アクセス解放後）
- [ ] Android 製品版プロモート（iOS 審査通過後）
- [ ] 機能改善（審査待ち中に検討）
