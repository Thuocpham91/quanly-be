#!/bin/bash

# ==========================================
# Cấu hình thông tin server
# ==========================================
IMAGE_NAME="quanly-chicken-be-service"
TAR_FILE="quanly-chicken-be-service.tar"
SERVER_USER="root"
SERVER_IP="192.168.1.100" # Thay bằng IP server của bạn
SERVER_DIR="/root/quanly-chicken/quanly-chicken-be-service" # Thư mục chứa project trên server

echo "=========================================="
echo "1. Bắt đầu build Docker image ($IMAGE_NAME)..."
docker build -t $IMAGE_NAME:latest .

echo "=========================================="
echo "2. Lưu image thành file tar ($TAR_FILE)..."
docker save -o $TAR_FILE $IMAGE_NAME:latest

echo "=========================================="
echo "3. Upload file tar và file cấu hình lên server ($SERVER_IP)..."
# Tạo thư mục trên server nếu chưa có
ssh $SERVER_USER@$SERVER_IP "mkdir -p $SERVER_DIR"
scp $TAR_FILE docker-compose.yml .env.sit $SERVER_USER@$SERVER_IP:$SERVER_DIR/

echo "=========================================="
echo "4. Load image và chạy trên server..."
ssh $SERVER_USER@$SERVER_IP << EOF
    cd $SERVER_DIR

    # Load image từ file tar
    echo "Loading Docker image..."
    docker load -i $TAR_FILE

    # Xóa file tar trên server cho nhẹ
    rm -f $TAR_FILE

    # Chạy lại container bằng docker compose với file env tương ứng
    echo "Restarting container..."
    docker compose --env-file .env.sit -f docker-compose.yml up -d --no-build --force-recreate quanly-chicken-be-service
EOF

echo "=========================================="
echo "5. Dọn dẹp file tar ở local..."
rm $TAR_FILE

echo "✅ HOÀN TẤT DEPLOY!"
