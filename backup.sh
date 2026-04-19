#!/bin/bash

# Cấu hình
CONTAINER_NAME="psvn-be-service-db"
DB_NAME="${POSTGRES_DB}"
DB_USER="${POSTGRES_USER}"
BACKUP_DIR="./backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${DATE}.sql"

# Tạo thư mục backup nếu chưa có
mkdir -p "$BACKUP_DIR"

# Thực hiện backup
docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"

# Kiểm tra kết quả
if [[ $? -eq 0 ]]; then
  echo "✅ Backup thành công: $BACKUP_FILE"
else
  echo "❌ Backup thất bại"
fi
