$envContent = Get-Content .env.local
$dbUrl = ""
foreach ($line in $envContent) {
    if ($line.StartsWith("SUPABASE_DB_URL=")) {
        $dbUrl = $line.Substring("SUPABASE_DB_URL=".Length).Trim('"', "'")
        break
    }
}

if ($dbUrl -eq "") {
    Write-Host "SUPABASE_DB_URL not found in .env.local"
    exit 1
}

Write-Host "Running supabase db push..."
cmd /c "npx supabase db push --db-url `"$dbUrl`""
