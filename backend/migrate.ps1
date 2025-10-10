# PowerShell helper to run alembic migrations using .env
# Usage: .\migrate.ps1
# This will load .env (if present), activate the venv and run alembic upgrade head

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

# load .env into environment if file exists
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match "^\s*#") { return }
        if ($_ -match "^\s*$") { return }
        $parts = $_ -split "=", 2
        if ($parts.Length -eq 2) {
            $name = $parts[0].Trim()
            $value = $parts[1].Trim()
            if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Trim('"') }
            # Use env: provider to set environment variables dynamically
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

# Activate venv and run alembic
$venvPython = Join-Path $ScriptDir '.venv\Scripts\python.exe'
if (-Not (Test-Path $venvPython)) {
    Write-Error "Virtualenv python not found at $venvPython. Activate your venv or create one."
    exit 1
}

# Run migrations
& $venvPython -m alembic upgrade head

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Migrations applied (or stamped) successfully."
