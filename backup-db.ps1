# Backup PostgreSQL DB from source host to target host
# -------------------------------------------------------------------
# This script dumps the database from the source PostgreSQL instance,
# transfers the dump file via SCP, and restores it on the target
# PostgreSQL instance. It also sends a notification email upon success
# or failure.
# -------------------------------------------------------------------

param (
    # Source DB connection (old server)
    [string]$SrcHost        = "103.75.184.92",
    [int]   $SrcPort        = 5442,   # host‑mapped port (container uses 5432 internally)
    [string]$SrcUser        = "root",
    [string]$SrcPassword    = "NSF7pXYwX22ZFOt3NinY",
    [string]$SrcDatabase    = "quanly",

    # Target DB connection (new server)
    [string]$DstHost        = "103.72.97.86",
    [int]   $DstPort        = 5442,
    [string]$DstUser        = "root",
    [string]$DstPassword    = "NSF7pXYwX22ZFOt3NinY",
    [string]$DstDatabase    = "quanly",

    # SSH credentials for file transfer (use the same user as DB admin)
    [string]$SshUser        = "root",
    [int]   $SshPort        = 24700,

    # Email notification (Gmail SMTP – adjust if you use another provider)
    [string]$NotifyEmail    = "phamvuthuoc91@gmail.com",
    [string]$SmtpServer    = "smtp.gmail.com",
    [int]   $SmtpPort      = 587,
    [string]$SmtpUser      = "phamvuthuoc91@gmail.com",
    [string]$SmtpPassword  = "<YOUR_GMAIL_APP_PASSWORD>"
)

# Helper: write coloured output
function Write-Info   { param([string]$msg) Write-Host $msg -ForegroundColor Cyan   }
function Write-ErrorM { param([string]$msg) Write-Host $msg -ForegroundColor Red    }
function Write-Ok     { param([string]$msg) Write-Host $msg -ForegroundColor Green  }

# Ensure pg_dump is available in PATH
if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
    $pgBin = Get-ChildItem "C:\Program Files\PostgreSQL\*\bin" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName -First 1
    if ($pgBin -and (Test-Path (Join-Path $pgBin "pg_dump.exe"))) {
        $env:PATH = "$pgBin;$env:PATH"
    }
}

# -------------------------------------------------------------------
# 1. Dump source database (plain SQL format for cross-version compatibility)
# -------------------------------------------------------------------
$dumpFile = "${SrcDatabase}_$(Get-Date -Format "yyyyMMdd_HHmmss").sql"
Write-Info "[1/4] Dumping source DB '${SrcDatabase}' from ${SrcHost}:${SrcPort}..."
$env:PGPASSWORD = $SrcPassword
$pgDumpCmd = "pg_dump -h $SrcHost -p $SrcPort -U $SrcUser --clean --if-exists -f `"$dumpFile`" $SrcDatabase"
Invoke-Expression $pgDumpCmd
if ($LASTEXITCODE -ne 0) {
    Write-ErrorM "❌ pg_dump failed. Aborting."
    exit 1
}
Write-Ok "✅ Dump created: $dumpFile"

# -------------------------------------------------------------------
# 2. Transfer dump file to target host (via SCP)
# -------------------------------------------------------------------
Write-Info "[2/4] Copying dump to target host $DstHost..."
$scpArgs = @(
    '-P', $SshPort,
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ConnectTimeout=30',
    $dumpFile,
    "${SshUser}@${DstHost}:/tmp/"
)
& scp @scpArgs
if ($LASTEXITCODE -ne 0) {
    Write-ErrorM "❌ SCP transfer failed. Aborting."
    exit 1
}
Write-Ok "✅ Dump transferred to /tmp/ on $DstHost"

# -------------------------------------------------------------------
# 3. Restore on target database
# -------------------------------------------------------------------
Write-Info "[3/4] Restoring dump into target DB '${DstDatabase}' on $DstHost..."
$restoreCommand = @(
    "docker exec -i quanly-chicken-be-service-db psql -U ${DstUser} -d ${DstDatabase} < /tmp/${dumpFile};",
    "rm -f /tmp/${dumpFile}"
) -join " "
$sshArgs = @(
    '-p', $SshPort,
    '-o', 'StrictHostKeyChecking=no',
    "${SshUser}@${DstHost}",
    $restoreCommand
)
& ssh @sshArgs
if ($LASTEXITCODE -ne 0) {
    Write-ErrorM "❌ psql restore failed on target. Aborting."
    exit 1
}
Write-Ok "✅ Database restored on target host."

# -------------------------------------------------------------------
# 4. Cleanup local dump file
# -------------------------------------------------------------------
Remove-Item -Force $dumpFile -ErrorAction SilentlyContinue

# -------------------------------------------------------------------
# 5. Send notification email
# -------------------------------------------------------------------
# Email notification disabled as per user request
Write-Info "[4/4] Email notification disabled."

# Email sending removed per user request

# -------------------------------------------------------------------
# End of script
# -------------------------------------------------------------------
