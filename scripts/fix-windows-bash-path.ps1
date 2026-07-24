#Requires -RunAsAdministrator
<#
.SYNOPSIS
  ROOT CAUSE fix: make bare bash resolve to real Git Bash, not WSL System32 stub.

.DESCRIPTION
  On Windows, Machine PATH is searched before User PATH. System32\bash.exe is a
  WSL launcher that fails when no distro is installed, so hooks calling bash
  break even when Git Bash is installed.

  This script prepends "C:\Program Files\Git\bin" (and Git\cmd) to Machine PATH
  so where bash / bare bash hit GNU bash first.

  Policy: .agents/governance/ROOT_CAUSE.md - do not soft-skip hooks instead.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/fix-windows-bash-path.ps1
#>

$ErrorActionPreference = 'Stop'

$gitBin = 'C:\Program Files\Git\bin'
$gitCmd = 'C:\Program Files\Git\cmd'
if (-not (Test-Path (Join-Path $gitBin 'bash.exe'))) {
  throw "Git Bash not found at $gitBin\bash.exe - install Git for Windows first."
}

$machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
$parts = @($machine -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$parts = @($parts | Where-Object { $_ -ne $gitBin -and $_ -ne $gitCmd })
$newMachine = (@($gitBin, $gitCmd) + $parts) -join ';'
[Environment]::SetEnvironmentVariable('Path', $newMachine, 'Machine')

$user = [Environment]::GetEnvironmentVariable('Path', 'User')
$uparts = @($user -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$uparts = @($uparts | Where-Object { $_ -ne $gitBin -and $_ -ne $gitCmd })
$winApps = Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps'
$rest = @($uparts | Where-Object { $_ -ne $winApps })
$hasWinApps = $uparts -contains $winApps
$uList = @($gitBin, $gitCmd) + $rest
if ($hasWinApps) { $uList += $winApps }
$seen = @{}
$uFinal = foreach ($p in $uList) {
  $k = $p.ToLowerInvariant()
  if (-not $seen.ContainsKey($k)) { $seen[$k] = $true; $p }
}
[Environment]::SetEnvironmentVariable('Path', ($uFinal -join ';'), 'User')

# Refresh current process
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' +
  [Environment]::GetEnvironmentVariable('Path', 'User')

Write-Host '=== VERIFY (root cause fixed when first bash is Git\bin) ===' -ForegroundColor Cyan
where.exe bash
Write-Host ''
bash --version | Select-Object -First 2
Write-Host ''
$first = (where.exe bash | Select-Object -First 1)
if ($first -notmatch 'Git\\bin\\bash\.exe') {
  Write-Host "FAIL: first bash is still: $first" -ForegroundColor Red
  exit 1
}
Write-Host 'OK: bare bash is Git Bash.' -ForegroundColor Green
Write-Host 'Open a NEW terminal / restart Claude so child processes inherit Machine PATH.'
