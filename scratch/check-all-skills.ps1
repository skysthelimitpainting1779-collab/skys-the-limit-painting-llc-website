$results = @()

$locations = @(
    @{ label = "GLOBAL"; path = "C:\Users\Johnny Cage\.gemini\config\skills" },
    @{ label = "PROJECT"; path = "C:\Users\Johnny Cage\DEV\skysthelimit-collab\.agents\skills" }
)

foreach ($loc in $locations) {
    $dirs = Get-ChildItem $loc.path -Directory -ErrorAction SilentlyContinue
    foreach ($dir in $dirs) {
        $skillFile = Join-Path $dir.FullName "SKILL.md"
        $exists    = Test-Path $skillFile
        $bytes     = if ($exists) { (Get-Item $skillFile).Length } else { 0 }

        # Read first line to check for valid YAML front-matter
        $firstLine = if ($exists) { (Get-Content $skillFile -TotalCount 1) } else { "" }
        $hasHeader = ($firstLine -eq "---")

        # Check for name field in front matter
        $content = if ($exists) { Get-Content $skillFile -Raw } else { "" }
        $hasName = $content -match "(?m)^name:"

        $status = if (-not $exists)    { "MISSING SKILL.md" }
                  elseif ($bytes -lt 50) { "EMPTY/CORRUPT"   }
                  elseif (-not $hasHeader) { "NO YAML HEADER" }
                  elseif (-not $hasName)   { "NO name: FIELD" }
                  else                 { "OK"               }

        $results += [PSCustomObject]@{
            Source = $loc.label
            Skill  = $dir.Name
            Bytes  = $bytes
            Status = $status
        }
    }
}

# Print summary table
$results | Format-Table -AutoSize

# Print only problems
$problems = $results | Where-Object { $_.Status -ne "OK" }
if ($problems.Count -gt 0) {
    Write-Output "`n=== PROBLEMS FOUND ==="
    $problems | Format-Table -AutoSize
} else {
    Write-Output "`nAll skills passed validation."
}
