$skillsPath = "C:\Users\Johnny Cage\DEV\skysthelimit-collab\.agents\skills"
$globalPath  = "C:\Users\Johnny Cage\.gemini\config\skills"

Write-Output "=== PROJECT SKILLS ==="
Get-ChildItem $skillsPath -Recurse -Filter "SKILL.md" | ForEach-Object {
    $kb = [math]::Round($_.Length / 1KB, 1)
    Write-Output "$kb KB  $($_.FullName)"
}

Write-Output ""
Write-Output "=== GLOBAL SKILLS (small < 1KB may be broken) ==="
Get-ChildItem $globalPath -Recurse -Filter "SKILL.md" | Where-Object { $_.Length -lt 1024 } | ForEach-Object {
    $kb = [math]::Round($_.Length / 1KB, 1)
    Write-Output "$kb KB  $($_.FullName)"
}
