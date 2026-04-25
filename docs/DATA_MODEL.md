# Data Model

## 概要

Firestore のNoSQL構造を採用。階層は `users/{userId}/goals/{goalId}/pieces/{pieceId}/sections/{sectionId}/logs/{logId}`。

## TypeScript型定義

```typescript
// src/types/models.ts

export type GoalStatus = 'active' | 'completed';

export interface Goal {
  id: string;
  title: string;           // 例: "春の発表会", "JASRACコンクール"
  eventDate: Date;         // 本番日
  status: GoalStatus;
  createdAt: Date;
  completedAt?: Date;      // 手動完了マーク時
}

export interface Piece {
  id: string;
  goalId: string;
  title: string;           // 曲名
  createdAt: Date;
}

export interface Section {
  id: string;
  pieceId: string;
  goalId: string;          // 集計効率のため重複保持
  title: string;           // "冒頭8小節" など自由テキスト
  practiceCount: number;   // 練習回数（星表示の元データ）
  createdAt: Date;
}

export interface PracticeLog {
  id: string;
  sectionId: string;
  pieceId: string;
  goalId: string;
  note: string;            // フリーテキスト
  createdAt: Date;
}
```

## 集計ルール

### 星の段階表示

```typescript
function getStarLevel(count: number): 'empty' | 'yellow' | 'gold' | 'rainbow' {
  if (count === 0) return 'empty';
  if (count < 10) return 'yellow';
  if (count < 100) return 'gold';
  return 'rainbow';
}
```

### お祝いアニメーション発火条件

- `practiceCount` が `10` または `100` を「跨いだ」瞬間にLottieアニメーションを再生
- 既に超えている数値での再ログ追加では発火しない

## ダッシュボード集計

ダッシュボードに必要な数値:

| 表示項目 | 算出方法 |
|---|---|
| 直近3つのゴールの残り日数 | `status='active'` のgoalを `eventDate` 昇順で3件取得、現在日時との差分 |
| ゴール総数 | `status='active'` のgoal件数 |
| 曲数 | アクティブgoal配下のpiece総数 |
| 練習箇所数 | アクティブgoal配下のsection総数 |
| 練習回数（10回） | 全sectionの `practiceCount` 合計を10刻みで星表示 |

集計はクライアント側で実行（無料枠で運用するため）。データ量が増えてきたら Cloud Functions での事前集計に切替検討。

## Firestore セキュリティルール

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## インデックス

以下の複合インデックスが必要になる想定:

- `goals`: `status` + `eventDate`（昇順）
- `pieces`: `goalId` + `createdAt`
- `sections`: `pieceId` + `createdAt`
- `logs`: `sectionId` + `createdAt`（降順、最新ログ表示用）

実機テスト時にFirestore側でインデックス作成リンクが出るので、そこで作成する。
