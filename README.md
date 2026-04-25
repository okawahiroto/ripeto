# Practice Log App

楽器練習ログアプリ（iOS / Android）。本番（演奏会・発表会）に向けた逆算型の練習記録ツール。

## 特徴

- 演奏会・発表会の日からの**残り日数**を中心に据えたダッシュボード
- 練習箇所ごとに**自信度（星）が積み上がる**達成感重視のUI
- 全楽器汎用
- オフライン対応（練習室で使える）

## 技術スタック

- Expo (React Native) + TypeScript
- Firebase (Authentication + Firestore)
- NativeWind (Tailwind)
- AdMob + RevenueCat

## ドキュメント

- [CLAUDE.md](./CLAUDE.md) - プロジェクト全体の指針（Claude Code用）
- [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) - データ構造定義
- [docs/ROADMAP.md](./docs/ROADMAP.md) - 開発フェーズ
- [docs/COORDINATION.md](./docs/COORDINATION.md) - 進捗メモ

## セットアップ

```bash
# 依存関係インストール
npm install

# 環境変数ファイル作成
cp .env.example .env

# Firebase / AdMob / RevenueCat のキーを.envに設定

# 開発サーバー起動
npx expo start
```

## ディレクトリ構成

```
.
├── CLAUDE.md
├── app/                  # Expo Router画面
├── src/
│   ├── components/       # 共通UI
│   ├── features/         # 機能単位のロジック
│   ├── lib/              # Firebase, AdMob, RevenueCat初期化
│   ├── stores/           # Zustand stores
│   ├── types/            # 型定義
│   └── utils/            # ヘルパー
├── assets/
│   └── lottie/           # アニメーション素材
└── docs/                 # 設計ドキュメント
```
