#!/bin/bash

# Cấu hình
CONTAINER_NAME="psvn-be-service-db"
DB_NAME="${POSTGRES_DB}"
DB_USER="${POSTGRES_USER}"
SQL_FILE="$1"

if [[ -z "$SQL_FILE" ]]; then
  echo "❌ Bạn cần chỉ định file .sql để restore. Ví dụ:"
  echo "./restore.sh ./backup/backup_psvn_20250805_123000.sql"
  exit 1
fi

# Xác nhận có file
if [[ ! -f "$SQL_FILE" ]]; then
  echo "❌ Không tìm thấy file: $SQL_FILE"
  exit 1
fi

# Thực hiện restore
cat "$SQL_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" "$DB_NAME"

if [[ $? -eq 0 ]]; then
  echo "✅ Restore thành công từ: $SQL_FILE"
else
  echo "❌ Restore thất bại"
fi
