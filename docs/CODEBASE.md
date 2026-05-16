# Codebase 概要

このアプリのディレクトリ構成・各ファイルの役割・実装済み機能をまとめた参照ドキュメント。

---

## ディレクトリ構成

フォルダ → ファイルの順に、VS Code のエクスプローラーと同じ並びで記載。

```
ripeto/
│
│  ── 隠しフォルダ ──
├── .claude/                 Claude Code の設定フォルダ
│   ├── settings.local.json  ツール自動許可などのローカル設定
│   └── commands/
│       └── add-feature.md   /add-feature カスタムスラッシュコマンド定義
│
├── .expo/                   Expo が自動生成するキャッシュ・型定義フォルダ（Git 管理外）
│   └── types/
│       └── router.d.ts      Expo Router の画面パス型定義（自動生成）
│
├── .vscode/                 VS Code プロジェクト設定
│   ├── extensions.json      推奨拡張機能リスト
│   └── settings.json        プロジェクト用エディタ設定
│
│  ── アプリフォルダ ──
├── app/                     画面（Expo Router ファイルベースルーティング）
│   ├── _layout.tsx          ルートレイアウト。起動時に Firebase認証・AdMob・RevenueCat を初期化
│   ├── +html.tsx            Web 向け HTML テンプレート（実質未使用）
│   ├── +not-found.tsx       404 画面
│   ├── modal.tsx            汎用モーダル（現在未使用）
│   ├── premium.tsx          プレミアム購入モーダル（RevenueCat 経由の買い切り課金）
│   ├── (tabs)/              タブナビゲーション配下
│   │   ├── _layout.tsx      タブバー定義（ゴール・ダッシュボード・設定）
│   │   ├── index.tsx        【タブ1】ゴール一覧画面
│   │   ├── two.tsx          【タブ2】ダッシュボード画面
│   │   └── settings.tsx     【タブ3】設定画面
│   ├── goals/
│   │   ├── new.tsx          ゴール作成モーダル（タイトル・本番日を入力）
│   │   └── [goalId]/
│   │       ├── index.tsx    曲目一覧画面
│   │       └── pieces/
│   │           ├── new.tsx  曲目作成モーダル
│   │           └── [pieceId]/
│   │               ├── index.tsx   練習箇所一覧画面
│   │               └── sections/
│   │                   ├── new.tsx 練習箇所作成モーダル
│   │                   └── [sectionId]/
│   │                       └── index.tsx  【コア】練習記録画面
│   └── legal/
│       ├── privacy.tsx      プライバシーポリシー画面
│       └── terms.tsx        利用規約画面
│
├── assets/                  静的アセット
│   ├── fonts/
│   │   └── SpaceMono-Regular.ttf  テンプレート付属フォント（実質未使用）
│   ├── images/
│   │   ├── icon.png              iOS アイコン（1024x1024、アルファなし）
│   │   ├── adaptive-icon.png     Android アダプティブアイコン（1024x1024）
│   │   ├── splash-icon.png       スプラッシュ画面ロゴ（1024x1024、透明背景）
│   │   ├── favicon.png           Web 用ファビコン
│   │   └── old/                  旧アイコン素材（参照目的で保持）
│   └── lottie/
│       ├── confetti.json         10回達成お祝いアニメーション（紙吹雪）
│       └── fireworks.json        100回達成お祝いアニメーション（花火）
│
├── build/                   ローカルの iOS ビルド成果物（Git 管理外）
│
├── components/              Expo テンプレート由来のコンポーネント（src/components とは別）
│   ├── EditScreenInfo.tsx   テンプレートの説明 UI（未使用）
│   ├── ExternalLink.tsx     外部リンクを開くコンポーネント
│   ├── StyledText.tsx       フォント適用済みテキスト（未使用）
│   ├── Themed.tsx           ダーク/ライトテーマ対応の View/Text（未使用）
│   ├── useClientOnlyValue.ts    SSR 対策フック
│   ├── useClientOnlyValue.web.ts    Web 実装
│   ├── useColorScheme.ts    カラースキーム取得フック
│   ├── useColorScheme.web.ts    Web 実装
│   └── __tests__/
│       └── StyledText-test.js   テンプレートのサンプルテスト（未メンテ）
│
├── constants/
│   └── Colors.ts            ライト/ダークテーマのカラー定数
│
├── docs/                    設計・運用ドキュメント
│   ├── CODEBASE.md          本ファイル。コードベース全体の構成と役割
│   ├── CHANGELOG.md         実装履歴（フェーズごとの作業ログ）
│   ├── COORDINATION.md      セッション跨ぎの作業メモ・次にやること
│   ├── DATA_MODEL.md        Firestore データ構造・TypeScript 型・集計ルール
│   ├── IMPROVEMENTS.md      改善案の一時置き場（Issues 化前のメモ）
│   ├── ROADMAP.md           MVP フェーズ一覧・v1.1 以降の構想
│   ├── STORE_LISTING.md     App Store / Google Play のストア掲載原稿
│   ├── memo.md              開発中の雑メモ
│   ├── privacy.html         GitHub Pages でホスティングするプライバシーポリシー
│   └── terms.html           GitHub Pages でホスティングする利用規約
│
├── ios/                     iOS ネイティブプロジェクト（EAS Build 時に自動生成）
│   ├── Ripeto/
│   │   ├── AppDelegate.swift       iOS アプリのエントリーポイント
│   │   ├── Info.plist              iOS アプリ設定（Bundle ID・パーミッション宣言など）
│   │   ├── Ripeto.entitlements     App Store Connect 機能設定（In-App Purchase など）
│   │   ├── PrivacyInfo.xcprivacy   プライバシーマニフェスト（Apple 要件）
│   │   ├── Ripeto-Bridging-Header.h Objective-C ブリッジヘッダー
│   │   ├── SplashScreen.storyboard スプラッシュ画面レイアウト
│   │   ├── Images.xcassets/        アイコン・スプラッシュ背景の画像アセット
│   │   └── Supporting/Expo.plist   Expo ランタイム設定
│   ├── Ripeto.xcodeproj/           Xcode プロジェクトファイル
│   ├── Ripeto.xcworkspace/         CocoaPods 統合後の Xcode ワークスペース
│   ├── Podfile                     CocoaPods 依存関係定義
│   ├── Podfile.lock                CocoaPods バージョンロック
│   └── Pods/                       インストール済み iOS ライブラリ
│
├── node_modules/            npm でインストールされた依存パッケージ（Git 管理外）
│
├── screenshots/             ストア申請用スクリーンショット
│   ├── ios/      iPhone 17 Pro Max 用（1284x2778px）5枚
│   ├── ipad/     iPad Pro 13インチ M5 用（2064x2752px）5枚
│   └── android/  Android 用 5枚
│
├── scripts/
│   └── setup-eas-secrets.sh .env から EAS 環境変数を一括登録するヘルパースクリプト
│
├── src/                     アプリ本体のソースコード
│   ├── components/          共通 UI コンポーネント
│   │   ├── StarBadge.tsx            練習回数に応じた星バッジ（4段階 + バネアニメーション）
│   │   ├── CelebrationOverlay.tsx   Web 向けスタブ
│   │   ├── CelebrationOverlay.native.tsx  お祝い Lottie アニメーション（10回・100回達成時）
│   │   ├── BannerAd.tsx             Web 向けスタブ
│   │   └── BannerAd.native.tsx      AdMob バナー広告（premium なら非表示）
│   ├── features/            機能単位のビジネスロジック（Firestore アクセスはここだけ）
│   │   ├── auth/
│   │   │   ├── api.ts           匿名ログイン・認証状態の購読
│   │   │   ├── useAppleAuth.ts  Apple サインイン（v1.0 では UI 非表示、コードとして保持）
│   │   │   └── useGoogleAuth.ts Google サインイン（同上）
│   │   ├── dashboard/
│   │   │   └── api.ts       fetchDashboardStats（クライアント側で集計）
│   │   ├── goals/
│   │   │   └── api.ts       createGoal / fetchActiveGoals / completeGoal
│   │   ├── logs/
│   │   │   └── api.ts       addLog（practiceCount の increment を同時実行）/ fetchLogs
│   │   ├── pieces/
│   │   │   └── api.ts       createPiece / fetchPieces / deletePiece
│   │   └── sections/
│   │       └── api.ts       createSection / fetchSections / incrementPracticeCount / deleteSection
│   ├── lib/                 外部サービスの初期化
│   │   ├── admob.ts         AdMob 初期化（Web 向けスタブ）
│   │   ├── admob.native.ts  AdMob 初期化（ネイティブ実装）
│   │   ├── firebase.ts      Firebase 初期化（Auth + Firestore オフライン永続化）
│   │   └── purchases.ts     RevenueCat 初期化 + checkPremium()
│   ├── stores/              Zustand グローバルストア
│   │   ├── authStore.ts     認証状態（user / status: loading|anonymous|linked）
│   │   └── purchaseStore.ts RevenueCat premium entitlement の保有状態（isPremium）
│   ├── types/               TypeScript 型定義
│   │   ├── auth.ts          AuthState / AuthStatus 型
│   │   └── models.ts        Goal / Piece / Section / PracticeLog 型 + getStarLevel()
│   └── utils/               ヘルパー関数（現在は空）
│
│  ── ルートファイル ──
├── .env                     ローカル開発用の環境変数（Git 管理外）
├── .env.example             .env のサンプル（Git 管理、実際の値は含まない）
├── .gitignore               Git 管理外ファイルの設定
├── .prettierrc              Prettier コードフォーマット設定
├── app.config.ts            Expo 設定。.env を読み込み Firebase/AdMob/RevenueCat キーを extra に渡す
├── babel.config.js          Babel 設定（NativeWind の CSS 変換を有効化）
├── CLAUDE.local.md.example  ローカル専用の Claude 設定テンプレート（Git 管理外）
├── CLAUDE.md                Claude Code 向けプロジェクト指示書（コーディング規約・設計方針）
├── eas.json                 EAS Build/Submit プロファイル（development / preview / production）
├── eslint.config.js         ESLint v9 フラットコンフィグ
├── expo-env.d.ts            Expo Router の TypeScript 型定義（自動生成、編集不要）
├── global.css               NativeWind のグローバル CSS（Tailwind の @tailwind ディレクティブ）
├── LICENSE                  All Rights Reserved ライセンス
├── metro.config.js          Metro バンドラー設定（NativeWind 対応）
├── nativewind-env.d.ts      NativeWind の TypeScript 型定義（className prop の型解決）
├── package-lock.json        npm ロックファイル（Git 管理）
├── package.json             npm 依存関係・スクリプト定義
├── README.md                プロジェクト概要（GitHub 表示用）
├── store.config.json        EAS Metadata 設定（App Store / Google Play ストア情報）
├── tailwind.config.js       Tailwind / NativeWind テーマ設定
└── tsconfig.json            TypeScript 設定（strict mode、パスエイリアス @/ を定義）
```

---

## 画面詳細（app/）

### アプリ起動時（`app/_layout.tsx`）

アプリ全体のルートレイアウト。起動時に以下を実行する。

- AdMob の初期化（`initializeAdMob`）
- RevenueCat の初期化（`initializePurchases`）と premium チェック
- Firebase 認証状態を購読。未ログインなら**匿名ログインを自動実行**
- 認証状態を `authStore`・`purchaseStore` に反映

---

### タブ1: ゴール一覧（`app/(tabs)/index.tsx`）

アプリの起点となるメイン画面。

| 機能 | 実装 |
|---|---|
| アクティブなゴールを一覧表示 | `fetchActiveGoals()` |
| 各ゴールの残り日数をバッジ表示 | 7日以内=赤、30日以内=橙、それ以外=青 |
| ゴールタップで曲目一覧へ遷移 | `router.push('/goals/[goalId]')` |
| ゴールを「完了にする」ボタン | `completeGoal()` → リストから除外 |
| ゴール追加ボタン（右下 FAB） | `/goals/new` モーダルへ |
| バナー広告（下部固定） | `<AdBanner fixed />` |

---

### タブ2: ダッシュボード（`app/(tabs)/two.tsx`）

練習の全体像を俯瞰する画面。

| 機能 | 実装 |
|---|---|
| 直近3件のゴールまでのカウントダウン | `fetchDashboardStats()` の `upcomingGoals` |
| 統計カード（ゴール数・曲数・練習箇所数） | 同上 |
| 総練習回数 + 星表示（10回ごとに⭐1つ） | `StarDisplay` コンポーネント |
| プレミアム導線ボタン | `/premium` モーダルへ |
| バナー広告（下部固定） | `<AdBanner fixed />` |

---

### タブ3: 設定（`app/(tabs)/settings.tsx`）

| 項目 | 内容 |
|---|---|
| プレミアム | 購入状態を表示。タップで `/premium` モーダルへ |
| アカウント | 匿名 or 連携済みのステータス表示 |
| プライバシーポリシー | `/legal/privacy` へ遷移 |
| 利用規約 | `/legal/terms` へ遷移 |
| バージョン | `app.config.ts` の `version` を表示 |

---

### ゴール作成（`app/goals/new.tsx`）

モーダルで表示。

- 入力: タイトル（テキスト）、本番日（`YYYY/MM/DD` または `YYYY-MM-DD`）
- 保存: `createGoal()` → `router.back()`
- 認証未完了時は最大5秒待機してから保存

---

### 曲目一覧（`app/goals/[goalId]/index.tsx`）

指定ゴール配下の曲目を一覧表示。

- `fetchPieces(goalId)` で取得
- 曲目タップで練習箇所一覧へ遷移
- 右下 FAB で曲目作成モーダルへ

---

### 練習箇所一覧（`app/goals/[goalId]/pieces/[pieceId]/index.tsx`）

指定曲目配下の練習箇所を一覧表示。

- `fetchSections(goalId, pieceId)` で取得
- 各カードに `StarBadge`（練習回数に応じた星）を表示
- 練習箇所タップで練習記録画面へ遷移
- 右下 FAB で練習箇所作成モーダルへ

---

### 練習記録画面（`app/goals/.../sections/[sectionId]/index.tsx`）

**アプリのコアとなる画面**。練習1回ごとにここで記録する。

| 機能 | 実装 |
|---|---|
| 練習回数 + 星バッジを大きく表示 | `StarBadge size="large"` |
| 次のマイルストーンまでの回数表示 | `getNextMilestone()` |
| メモ入力 + 記録ボタン | `addLog()` + `incrementPracticeCount()` を同時実行 |
| 記録時の星バネアニメーション | `react-native-reanimated` の `withSpring` |
| 10回・100回達成でお祝いオーバーレイ | `checkMilestone()` → `CelebrationOverlay` |
| 過去ログ一覧（新しい順） | `fetchLogs()` |

---

### プレミアム（`app/premium.tsx`）

RevenueCat 経由の買い切り課金画面。広告非表示の購入・復元が可能。

---

## ビジネスロジック（src/features/）

### `auth/api.ts`

| 関数 | 内容 |
|---|---|
| `signInAnon()` | Firebase 匿名ログイン |
| `subscribeAuthState(cb)` | 認証状態の変化を購読（`onAuthStateChanged` のラッパー） |

### `goals/api.ts`

| 関数 | 内容 |
|---|---|
| `createGoal(title, eventDate)` | ゴールを Firestore に追加 |
| `fetchActiveGoals()` | `status=active` のゴールを `eventDate` 昇順で取得 |
| `completeGoal(goalId)` | `status` を `completed` に更新 |
| ~~`updateGoal`~~ | **未実装**（Issue #1） |
| ~~`deleteGoal`~~ | **未実装**（Issue #2） |

### `pieces/api.ts`

| 関数 | 内容 |
|---|---|
| `createPiece(goalId, title)` | 曲目を追加 |
| `fetchPieces(goalId)` | 曲目一覧を取得 |
| `deletePiece(goalId, pieceId)` | 曲目を削除 |

### `sections/api.ts`

| 関数 | 内容 |
|---|---|
| `createSection(goalId, pieceId, title)` | 練習箇所を追加（`practiceCount=0` で初期化） |
| `fetchSections(goalId, pieceId)` | 練習箇所一覧を取得 |
| `incrementPracticeCount(...)` | `practiceCount` を +1（`logs/api.ts` から呼ばれる） |
| `deleteSection(...)` | 練習箇所を削除 |

### `logs/api.ts`

| 関数 | 内容 |
|---|---|
| `addLog(goalId, pieceId, sectionId, note)` | ログ追加 + `incrementPracticeCount` を**同時実行** |
| `fetchLogs(goalId, pieceId, sectionId)` | ログ一覧を新しい順で取得 |

### `dashboard/api.ts`

`fetchDashboardStats()` 1関数のみ。以下を**クライアント側で集計**（Firestore 読み取りコスト削減）。

- 直近3件のゴール + 残り日数
- ゴール数・曲数・練習箇所数・総練習回数

---

## コンポーネント（src/components/）

### `StarBadge.tsx`

練習回数に応じた星を表示する中核コンポーネント。

| 回数 | 見た目 | ラベル |
|---|---|---|
| 0 | ☆（グレー） | 未練習 |
| 1〜9 | ⭐（黄） | 練習中 |
| 10〜99 | 🌟（ゴールド） | ゴールド |
| 100〜 | ✨（紫） | 虹色 |

`size="large"` で練習記録画面の大きな星、`size="small"` で一覧のバッジ表示。
`animate=true` でカウントアップ時にバネアニメーション。

補助関数:
- `getNextMilestone(count)` — 次のマイルストーンまでの残り回数テキスト
- `checkMilestone(prev, next)` — `'gold'` / `'rainbow'` / `null` を返す

### `CelebrationOverlay.native.tsx`

10回（gold）・100回（rainbow）達成時に全画面で表示するお祝いアニメーション。
Lottie ファイル（`assets/lottie/`）を再生。`.native.tsx` でネイティブのみ動作。

### `BannerAd.native.tsx` / `BannerAd.tsx`

AdMob バナー広告。`fixed` prop で画面下部に固定表示。
`purchaseStore.isPremium === true` の場合は非表示。
`.native.tsx` がネイティブ用、`.tsx` が Web 用のスタブ。

---

## グローバルストア（src/stores/）

### `authStore.ts`

| 状態 | 型 | 意味 |
|---|---|---|
| `user` | `User \| null` | Firebase ユーザーオブジェクト |
| `status` | `'loading' \| 'anonymous' \| 'linked'` | 認証ステータス |

### `purchaseStore.ts`

| 状態 | 型 | 意味 |
|---|---|---|
| `isPremium` | `boolean` | RevenueCat premium entitlement の保有状態 |

---

## 外部サービス初期化（src/lib/）

### `firebase.ts`

- `app.config.ts` の `extra` フィールドから環境変数を読み込んで Firebase を初期化
- Auth: Web は `browserLocalPersistence`、Native は AsyncStorage による永続化
- Firestore: `persistentLocalCache()` でオフライン永続化を有効化

### `admob.ts` / `admob.native.ts`

AdMob SDK の初期化。`.native.ts` がネイティブ用実装。

### `purchases.ts`

RevenueCat SDK の初期化 + `checkPremium()`（premium entitlement の確認）。

---

## 型定義（src/types/）

### `models.ts`

Firestore のデータ構造に対応する型: `Goal` `Piece` `Section` `PracticeLog`
および `getStarLevel(count)` ユーティリティ関数。

### `auth.ts`

`AuthState`（authStore の型）と `AuthStatus`。

---

## 環境変数・設定ファイル

| ファイル | 役割 |
|---|---|
| `.env` | ローカル開発用の環境変数（Git 管理外） |
| `app.config.ts` | Expo 設定。`.env` を読み込み `extra` フィールドに渡す |
| `eas.json` | EAS Build/Submit プロファイル設定 |
| `babel.config.js` | NativeWind（Tailwind）対応の Babel 設定 |
| `metro.config.js` | NativeWind 対応の Metro 設定 |
| `tailwind.config.js` | Tailwind テーマ（現状はデフォルトに近い） |
