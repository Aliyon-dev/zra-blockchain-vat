<#
apply_supabase.ps1
Interactive helper to stamp or apply migrations to a Supabase/Postgres DB.

Usage: run from repository backend folder in PowerShell with your venv available.
1) Create backend/.env with DATABASE_URL and SUPABASE_KEY (service_role).
2) Run: .\apply_supabase.ps1

The script will:
 - Load .env (if present)
 - Print a masked DATABASE_URL and ask for confirmation
 - Optionally run pg_dump to back up the DB (if pg_dump available)
 - Either stamp Alembic head (non-destructive) OR drop the `invoices` table and run alembic upgrade head (destructive)

Important: This script runs locally and DOES NOT store secrets in the repo.
#>

function Load-DotEnv {
    param([string]$Path = ".env")
    if (-Not (Test-Path $Path)) { return }
    Get-Content $Path | ForEach-Object {
        if ($_ -match "^\s*#") { return }
        if ($_ -match "^\s*$") { return }
        $parts = $_ -split "=", 2
        if ($parts.Length -eq 2) {
            $name = $parts[0].Trim()
            $value = $parts[1].Trim()
            if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Trim('"') }
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Definition)

Write-Host "Loading .env (if present)..."
Load-DotEnv .env

$databaseUrl = $env:DATABASE_URL
if ($null -eq $databaseUrl -or $databaseUrl -eq '') {
    Write-Error "DATABASE_URL environment variable is not set. Please create a .env file with the DATABASE_URL."
    exit 1
}

$masked = $databaseUrl
if ($masked -match "postgresql://(.*)@(.*):(\d+)/(.*)") {
    # mask user/pass
    $masked = $masked -replace "postgresql://(.*):(.*)@(.*)", 'postgresql://***:***@$3'
}

Write-Host "Target DATABASE_URL: $masked"

# ensure venv python exists
$venvPython = Join-Path (Get-Location) '.venv\Scripts\python.exe'
if (-not (Test-Path $venvPython)) {
    Write-Host "Warning: venv python not found at $venvPython. Activate your venv or create one before proceeding." -ForegroundColor Yellow
}

Write-Host "Choose action:`n 1) Stamp Alembic head (non-destructive) - records migrations as applied`n 2) Drop 'invoices' table & run migrations (destructive) - backup first`n 3) Both (backup -> drop -> migrate)" -ForegroundColor Cyan
$choice = Read-Host 'Enter 1, 2, or 3 (or q to quit)'
if ($choice -eq 'q') { Write-Host 'Aborted'; exit 0 }

if ($choice -notin @('1','2','3')) { Write-Host 'Invalid choice, aborting'; exit 1 }

# optional backup
function Run-Backup {
    if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
        Write-Host "pg_dump not found; skipping pg_dump backup. Use Supabase UI to backup if needed." -ForegroundColor Yellow
        return $false
    }
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $file = "backup_$timestamp.dump"
    Write-Host "Running pg_dump to $file ..."
    try {
        & pg_dump $env:DATABASE_URL -Fc -f $file
        if ($LASTEXITCODE -eq 0) { Write-Host "Backup saved to $file"; return $true }
        else { Write-Host "pg_dump failed with exit code $LASTEXITCODE" -ForegroundColor Red; return $false }
    } catch {
        Write-Host "pg_dump exception: $_" -ForegroundColor Red
        return $false
    }
}

# perform actions
if ($choice -in @('2','3')) {
    Write-Host "You selected a destructive action. This will DROP the 'invoices' table in the target database." -ForegroundColor Red
    $confirm = Read-Host 'Type DELETE to confirm destructive action'
    if ($confirm -ne 'DELETE') { Write-Host 'Destructive action not confirmed. Aborting.'; exit 1 }
}

if ($choice -in @('2','3')) {
    # Backup
    $didBackup = Run-Backup
    if (-not $didBackup) {
        Write-Host "Backup not completed. Proceeding will be destructive. Continue? (y/n)" -ForegroundColor Yellow
        $cont = Read-Host
        if ($cont -ne 'y') { Write-Host 'Aborted'; exit 1 }
    }
    # Drop table using psql if available, otherwise instruct user
    if (Get-Command psql -ErrorAction SilentlyContinue) {
        Write-Host "Dropping table 'invoices' using psql..."
        & psql $env:DATABASE_URL -c "DROP TABLE IF EXISTS public.invoices CASCADE;"
        if ($LASTEXITCODE -ne 0) { Write-Host "psql drop failed (exit code $LASTEXITCODE)" -ForegroundColor Red; exit 1 }
    } else {
        Write-Host "psql not found. Please run the following SQL in Supabase SQL editor to drop the invoices table and then re-run this script:" -ForegroundColor Yellow
        Write-Host "DROP TABLE IF EXISTS public.invoices CASCADE;" -ForegroundColor Magenta
        exit 1
    }
}

# Stamp or migrate
if ($choice -eq '1') {
    Write-Host "Stamping Alembic head (non-destructive)..."
    & $venvPython -m alembic stamp head
    exit $LASTEXITCODE
} elseif ($choice -eq '2') {
    Write-Host "Running alembic upgrade head (apply migrations)..."
    & $venvPython -m alembic upgrade head
    exit $LASTEXITCODE
} elseif ($choice -eq '3') {
    Write-Host "Stamping Alembic head (safe start)..."
    & $venvPython -m alembic stamp head
    Write-Host "Applying migrations (create tables)..."
    & $venvPython -m alembic upgrade head
    exit $LASTEXITCODE
}
