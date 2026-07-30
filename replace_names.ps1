$directory = "c:\Users\WINDOWS 11\Documents\GitHub\evoraa.net"
Get-ChildItem -Path $directory -Recurse -Filter *.md | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content) {
        $newContent = $content -ireplace '\beden\.net\b', 'KELIAA'
        $newContent = $newContent -ireplace '\beden\b', 'KELIAA'
        $newContent = $newContent -ireplace '\bevoraa\b', 'KELIAA'
        if ($content -cne $newContent) {
            Set-Content -Path $_.FullName -Value $newContent -NoNewline
        }
    }
}
