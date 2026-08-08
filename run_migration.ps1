# Apply Supabase SQL. Usage:
#   .\run_migration.ps1                  # try supabase db push (all pending)
#   .\run_migration.ps1 -File path.sql   # apply one SQL file (statements one-by-one)
#   .\run_migration.ps1 -OnlyD8          # apply privacy profiles migration 00032
param(
    [string]$File = "",
    [switch]$OnlyD8
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$envPath = Join-Path $root ".env.local"
if (-not (Test-Path $envPath)) {
    Write-Host "Fichier .env.local introuvable."
    exit 1
}

# Strip UTF-8 BOM if Cursor/Windows reintroduced it (breaks supabase dotenv parser)
$bytes = [System.IO.File]::ReadAllBytes($envPath)
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    $bytes = $bytes[3..($bytes.Length - 1)]
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    [System.IO.File]::WriteAllText($envPath, $text, $utf8NoBom)
    Write-Host "BOM UTF-8 retire de .env.local"
}

$dbUrl = ""
foreach ($line in [System.IO.File]::ReadAllLines($envPath)) {
    if ($line.StartsWith("SUPABASE_DB_URL=")) {
        $dbUrl = $line.Substring("SUPABASE_DB_URL=".Length).Trim().Trim('"', "'")
        break
    }
}

if ($dbUrl -eq "") {
    Write-Host "SUPABASE_DB_URL introuvable dans .env.local"
    exit 1
}

# Sanitize: trim password and URL-encode special characters
if ($dbUrl -match '^(postgres(?:ql)?://)([^:]+):(.+)@([^/]+)(/.*)?$') {
    $scheme = $Matches[1]
    $user = $Matches[2]
    $password = $Matches[3].Trim()
    $hostPart = $Matches[4]
    $pathPart = if ($Matches[5]) { $Matches[5] } else { "/postgres" }
    $encodedPassword = [uri]::EscapeDataString($password)
    $dbUrl = "$scheme$user`:$encodedPassword@$hostPart$pathPart"
    Write-Host "URL DB normalisee (mot de passe nettoye/encode)"
}

function Apply-SqlFile([string]$sqlPath) {
    if (-not (Test-Path $sqlPath)) {
        throw "Fichier SQL introuvable: $sqlPath"
    }
    $raw = [System.IO.File]::ReadAllText($sqlPath)
    $parts = [regex]::Split($raw, '(?<=;)\s*') | Where-Object { $_.Trim() -ne "" }
    $i = 0
    foreach ($part in $parts) {
        $stmt = $part.Trim()
        if ($stmt -eq "") { continue }
        $withoutComments = ($stmt -split "`n" | Where-Object { $_.Trim() -notmatch '^\s*--' }) -join "`n"
        if ($withoutComments.Trim() -eq "") { continue }
        $i++
        $tmp = Join-Path $env:TEMP ("keliaa_mig_{0}_{1}.sql" -f (Get-Date -Format "HHmmss"), $i)
        [System.IO.File]::WriteAllText($tmp, $stmt, (New-Object System.Text.UTF8Encoding $false))
        Write-Host "  -> statement $i"
        npx --yes supabase db query --db-url $dbUrl -f $tmp
        if ($LASTEXITCODE -ne 0) {
            Remove-Item $tmp -ErrorAction SilentlyContinue
            throw "Echec statement $i dans $sqlPath"
        }
        Remove-Item $tmp -ErrorAction SilentlyContinue
    }
    Write-Host "OK: $sqlPath ($i statement(s))"
}

if ($OnlyD8) {
    $File = Join-Path $root "supabase\migrations\20240101000032_profiles_select_privacy.sql"
}

if ($File -ne "") {
    Write-Host "Applying single file: $File"
    Apply-SqlFile $File
    exit 0
}

Write-Host "Running supabase db push..."
npx --yes supabase db push --db-url $dbUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "db push a echoue (souvent: anciennes migrations deja partielles)."
    Write-Host "Pour la migration privacy seule: .\run_migration.ps1 -OnlyD8"
    exit $LASTEXITCODE
}
exit 0
