#!/bin/bash
# .env の値を EAS Secrets（プロジェクトスコープ）に一括登録するスクリプト
# 実行前に `eas login` を完了させること

set -e

if [ ! -f ".env" ]; then
  echo "Error: .env が見つかりません"
  exit 1
fi

echo "EAS Secrets への登録を開始します..."

while IFS='=' read -r key value; do
  # コメント・空行・値が空の行はスキップ
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  [[ -z "$value" ]] && continue

  echo "  登録中: $key"
  eas secret:create --scope project --name "$key" --value "$value" --non-interactive 2>/dev/null \
    || eas secret:push --scope project --name "$key" --value "$value" --non-interactive 2>/dev/null \
    || echo "  スキップ（既存または失敗）: $key"
done < .env

echo "完了しました。"
echo "確認: eas secret:list"
