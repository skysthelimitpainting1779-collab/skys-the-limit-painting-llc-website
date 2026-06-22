$pluginsPath = "C:\Users\Johnny Cage\.gemini\config\plugins"
Get-ChildItem $pluginsPath -Recurse -Filter "plugin.json" | ForEach-Object {
    Write-Output "=== $($_.FullName) ==="
    Get-Content $_.FullName
    Write-Output ""
}
