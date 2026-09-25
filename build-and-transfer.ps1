# Build Docker Image, Transfer to Server, and Auto-Start Container
param (
    [string]$ImageName     = "quanly-chicken-be-service",
    [string]$Tag           = "latest",
    [string]$ServerHost    = "103.72.97.86",
    [string]$ServerUser    = "root",
    [int]   $ServerPort    = 24700,
    [string]$ServerPath    = "/root/quanly-chicken/quanly-chicken-be-service",
    [string]$ContainerName = "quanly-chicken-be-service"
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$FullImage  = "$ImageName`:$Tag"
$TarFile    = "$ImageName.tar"
$EnvFile    = if (Test-Path ".env.sit") { ".env.sit" } elseif (Test-Path ".env") { ".env" } else { "" }
$SshOpts    = @("-o", "ServerAliveInterval=15", "-o", "ServerAliveCountMax=5",
                "-o", "ConnectTimeout=20",       "-o", "StrictHostKeyChecking=no",
                "-o", "BatchMode=yes",           "-o", "ConnectionAttempts=3",
                "-p", "$ServerPort")

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  🚀 BUILD -> TRANSFER -> DEPLOY TO SERVER" -ForegroundColor Cyan
Write-Host "  Server  : $ServerUser@$ServerHost`:$ServerPort" -ForegroundColor Cyan
Write-Host "  Path    : $ServerPath" -ForegroundColor Cyan
Write-Host "  Image   : $FullImage" -ForegroundColor Cyan
Write-Host "  Env File: $EnvFile" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# ─────────────────────────────────────────────
# Helper: Thử lại SSH command tối đa $MaxRetry lần
# ─────────────────────────────────────────────
function Invoke-SshWithRetry {
    param([string[]]$SshArgs, [int]$MaxRetry = 3, [int]$DelaySec = 5)
    for ($i = 1; $i -le $MaxRetry; $i++) {
        & ssh @SshArgs
        if ($LASTEXITCODE -eq 0) { return $true }
        if ($i -lt $MaxRetry) {
            Write-Host "⚠️  SSH failed (attempt $i/$MaxRetry), retrying in ${DelaySec}s..." -ForegroundColor DarkYellow
            Start-Sleep -Seconds $DelaySec
        }
    }
    return $false
}

# ─────────────────────────────────────────────
# Helper: Upload file text nhỏ qua Base64 (tránh Connection reset của SCP/SSH-stdin)
# ─────────────────────────────────────────────
function Upload-FileBase64 {
    param([string]$LocalFile, [string]$RemotePath)
    if (-not (Test-Path $LocalFile)) {
        Write-Host "⚠️  $LocalFile not found locally, skipping." -ForegroundColor DarkYellow
        return
    }
    $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($LocalFile))
    $ok = Invoke-SshWithRetry -SshArgs (@() + $SshOpts + "$ServerUser@$ServerHost" + "echo '$b64' | base64 -d > '$RemotePath'")
    if (-not $ok) {
        Write-Host "❌ Failed to upload $LocalFile after retries" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ $LocalFile uploaded." -ForegroundColor Green
}

try {
    if ([string]::IsNullOrWhiteSpace($EnvFile)) {
        Write-Host "❌ No .env or .env.sit file found in project root." -ForegroundColor Red
        exit 1
    }

    # ─────────────────────────────────────────────
    # STEP 1: Check Docker daemon
    # ─────────────────────────────────────────────
    Write-Host "`n[1/6] Checking Docker daemon..." -ForegroundColor Yellow
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker is not running. Please start Docker Desktop!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Docker is running." -ForegroundColor Green

    # ─────────────────────────────────────────────
    # STEP 2: Build Docker Image (linux/amd64)
    # ─────────────────────────────────────────────
    Write-Host "`n[2/6] Building Docker image '$FullImage' for linux/amd64..." -ForegroundColor Yellow
    docker build --platform linux/amd64 -t $FullImage .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Image built: $FullImage" -ForegroundColor Green

    # Chờ mạng/CPU ổn định sau docker build trước khi kết nối SSH
    Write-Host "⏳ Waiting 5s for network to stabilize..." -ForegroundColor Gray
    Start-Sleep -Seconds 5

    # ─────────────────────────────────────────────
    # STEP 3: Upload docker-compose.yml + .env lên server
    # Dùng Base64 encode để tránh "Connection reset" của SCP sau build dài
    # ─────────────────────────────────────────────
    Write-Host "`n[3/6] Uploading config files to server (via Base64)..." -ForegroundColor Yellow
    $ok = Invoke-SshWithRetry -SshArgs (@() + $SshOpts + "$ServerUser@$ServerHost" + "mkdir -p '$ServerPath'")
    if (-not $ok) { Write-Host "❌ Cannot connect to server" -ForegroundColor Red; exit 1 }

    Upload-FileBase64 "docker-compose.yml" "$ServerPath/docker-compose.yml"
    Upload-FileBase64 $EnvFile "$ServerPath/.env"

    # ─────────────────────────────────────────────
    # STEP 4: Export image to .tar and Upload via SCP
    # ─────────────────────────────────────────────
    Write-Host "`n[4/6] Saving image to $TarFile..." -ForegroundColor Yellow
    docker save -o $TarFile $FullImage
    if (-not (Test-Path $TarFile)) {
        Write-Host "❌ Failed to export image to $TarFile" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Image exported to $TarFile" -ForegroundColor Green

    Write-Host "`nUploading $TarFile to server via SCP (Port: $ServerPort)..." -ForegroundColor Yellow
    scp -P $ServerPort -o ServerAliveInterval=15 -o ServerAliveCountMax=5 `
        -o ConnectTimeout=20 -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectionAttempts=3 `
        $TarFile "${ServerUser}@${ServerHost}:${ServerPath}/${TarFile}"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Upload failed! Check your SSH/SCP connection." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Upload completed." -ForegroundColor Green

    # ─────────────────────────────────────────────
    # STEP 5: Load Docker image on server
    # ─────────────────────────────────────────────
    Write-Host "`n[5/6] Loading Docker image on server..." -ForegroundColor Yellow
    & ssh @SshOpts "$ServerUser@$ServerHost" "docker load -i '$ServerPath/$TarFile' && rm -f '$ServerPath/$TarFile'"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to load image on server." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Image loaded on server." -ForegroundColor Green

    # ─────────────────────────────────────────────
    # STEP 6: Start full stack via docker compose
    # ─────────────────────────────────────────────
    Write-Host "`n[6/6] Deploying full stack on server..." -ForegroundColor Yellow
    & ssh @SshOpts "$ServerUser@$ServerHost" "docker network inspect gasy-network >/dev/null 2>&1 || docker network create gasy-network; cd '$ServerPath'; docker compose --env-file .env config >/dev/null; (docker compose down --remove-orphans >/dev/null 2>&1 || true); docker compose --env-file .env up -d --force-recreate"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Full stack is now running!" -ForegroundColor Green
        & ssh @SshOpts "$ServerUser@$ServerHost" "cd '$ServerPath' && docker compose --env-file .env ps"
    } else {
        Write-Host "❌ docker compose failed! Showing logs for debugging:" -ForegroundColor Red
        & ssh @SshOpts "$ServerUser@$ServerHost" "cd '$ServerPath' && docker compose --env-file .env logs --tail=200"
        exit 1
    }

    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "  🎉 Deployment Complete!" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan

} finally {
    # Luôn dọn dẹp file tar local dù script thành công hay thất bại
    if (Test-Path $TarFile) {
        Remove-Item -Force $TarFile -ErrorAction SilentlyContinue
        Write-Host "🧹 Local $TarFile cleaned up." -ForegroundColor Gray
    }
}
