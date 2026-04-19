# psvn-be-service
Backend PSVN

#LOCAL
docker compose -f docker-compose.yml --env-file .env.local up -d --build

docker compose -f docker-compose.yml --env-file .env.local up -d --force-recreate --build psvn-be-service

#SIT
docker compose -f docker-compose.yml --env-file .env.sit up -d --build

docker compose -f docker-compose.yml --env-file .env.sit up -d --force-recreate --build psvn-be-service



<!-- Backup định kỳ PostgreSQL volume bằng pg_dump, hoặc sao lưu volume: -->
docker exec psvn-be-service-db pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup.sql

<!-- Backup PostgreSQL (to .sql file) -->
<!-- Nhớ chmod +x backup.sh để có thể chạy: -->
chmod +x backup.sh
./backup.sh


<!-- Restore PostgreSQL từ file .sql -->
<!-- Nhớ chmod +x restore.sh và chạy: -->
./restore.sh ./backup/backup_psvn_20250805_123000.sql