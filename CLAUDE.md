# Project Overview

楽器練習ログアプリ（iOS/Android）。演奏会・発表会など「本番」に向けた逆算型の練習記録アプリ。
全楽器汎用。買い切り課金で広告非表示にする収益モデル。

## Differentiation

「本番までの残り日数」を中心に据えた逆算型UI。練習箇所ごとに「自信度（星）」が積み上がる達成感を提供する。

# Tech Stack

- **Framework**: Expo (React Native) - SDK最新版
- **Language**: TypeScript (strict mode)
- **Backend**: Firebase (Authentication + Firestore)
- **State**: Zustand
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router (file-based)
- **Ads**: react-native-google-mobile-ads (AdMob)
- **In-App Purchase**: RevenueCat
- **Animation**: react-native-reanimated + lottie-react-native
- **Forms**: react-hook-form + zod

# Architecture

## Data Model (Firestore)

階層構造:
```
users/{userId}
  goals/{goalId}              # 演奏会・発表会・個人目標
    - title: string
    - eventDate: Timestamp
    - status: 'active' | 'completed'
    - createdAt: Timestamp

    pieces/{pieceId}          # 曲目
      - title: string
      - createdAt: Timestamp

      sections/{sectionId}    # 練習箇所
        - title: string       # 自由テキスト
        - practiceCount: number
        - createdAt: Timestamp

        logs/{logId}          # 練習ログ
          - note: string      # フリーテキスト
          - createdAt: Timestamp
```

## Star Display Logic

練習箇所ごとの `practiceCount` に応じて表示変化:
- 0回: グレーの星（空）
- 1〜9回: 黄色の星
- 10〜99回: ゴールドの星
- 100回〜: 虹色キラキラ星（Lottieアニメーション）

100回到達時はお祝いLottieアニメを表示する。

## Authentication

- Firebase匿名認証をデフォルト
- Google/Appleログインへのリンク（任意）でアカウント引き継ぎ可能にする
- ログイン強制はしない（買い切り課金の復元のために将来的にリンク推奨）

# Key Directories

- `app/` - Expo Router画面（ファイルベースルーティング）
- `src/components/` - 共通UIコンポーネント
- `src/features/` - 機能単位のロジック（goals, pieces, sections, logs, dashboard）
- `src/lib/` - Firebase設定、AdMob、RevenueCat初期化
- `src/stores/` - Zustand stores
- `src/types/` - TypeScript型定義
- `src/utils/` - ヘルパー関数
- `assets/lottie/` - Lottieアニメーションファイル
- `docs/` - 設計ドキュメント

# Coding Conventions

- TypeScript strict mode必須
- 関数コンポーネントのみ、class禁止
- default exportは禁止、named exportを使う
- `any`禁止、不明な型は `unknown` を使う
- Firestoreアクセスは必ず `src/features/*/api.ts` 経由（直接呼び出し禁止）
- 画面コンポーネントは `app/` 配下、ロジックは `src/features/` に分離

# Commands

```bash
# 開発
npx expo start

# iOS実機/シミュレータ
npx expo run:ios

# Android実機/エミュレータ
npx expo run:android

# 型チェック
npx tsc --noEmit

# Lint
npm run lint
```

# Important Rules

## Security
- secretsは絶対にコミットしない（`.env`使用）
- Firebase設定は `app.config.ts` の `extra` 経由で管理
- AdMob/RevenueCatのキーも環境変数化

## Firestore
- セキュリティルールは `users/{userId}` 配下を本人のみアクセス可能に設定
- オフライン対応を有効化（`enableIndexedDbPersistence`）
- 不要なリアルタイムリスナーは作らない（料金対策）

## UX
- 練習室で電波が悪くても使えること（オフライン優先設計）
- 練習ログ入力は最短3タップで完了できること
- ダッシュボードのロード時間1秒以内

## 広告
- ダッシュボードと一覧画面下部にバナー広告を表示
- ログ入力フローには広告を入れない（UX阻害になる）
- 有償版（RevenueCatで `premium` entitlement保有者）は広告完全非表示

## 不変ルール
- 既存ユーザーのデータ構造を破壊する変更は禁止（マイグレーション必須）
- 練習ログは削除可能だが、`practiceCount`との整合性を保つ

# References

- データモデル詳細: @docs/DATA_MODEL.md
- ロードマップ: @docs/ROADMAP.md
- 進捗メモ: @docs/COORDINATION.md
