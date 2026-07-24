# Apply Supabase migrations using SUPABASE_DB_URL from .env.local
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

Write-Host "Running supabase db push..."
npx --yes supabase db push --db-url $dbUrl
exit $LASTEXITCODE
