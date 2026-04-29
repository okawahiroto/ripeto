#!/bin/bash
# .env の値を EAS 環境変数（production / preview / development 全環境）に一括登録
# 実行前に `eas login` を完了させること

if [ ! -f ".env" ]; then
  echo "Error: .env が見つかりません"
  exit 1
fi

echo "EAS 環境変数への登録を開始します..."

while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  [[ -z "$value" ]] && continue

  echo "  登録中: $key"
  eas env:create \
    --name "$key" \
    --value "$value" \
    --scope project \
    --environment production \
    --environment preview \
    --environment development \
    --visibility secret \
    --type string \
    --non-interactive \
    --force < /dev/null
done < .env

echo ""
echo "完了しました。"
echo "確認: eas env:list production"
