$output = & npm test 2>&1
$output | Where-Object { $_ -match "not ok|# fail" } | ForEach-Object { Write-Output $_ }
