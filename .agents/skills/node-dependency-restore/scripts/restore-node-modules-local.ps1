param(
  [Parameter(Mandatory = $true)]
  [string]$RepositoryPath,

  [Parameter(Mandatory = $true)]
  [string]$ExpectedTargetPath
)

$ErrorActionPreference = 'Stop'

$repository = [System.IO.Path]::GetFullPath($RepositoryPath)
$source = [System.IO.Path]::GetFullPath((Join-Path $repository 'node_modules'))
$expectedSource = "$repository\node_modules"
$expectedTarget = [System.IO.Path]::GetFullPath($ExpectedTargetPath)
$staging = "$repository\node_modules.restore-staging"

if ($source -ne $expectedSource) {
  throw "Unexpected node_modules path: $source"
}
if (-not (Test-Path -LiteralPath (Join-Path $repository 'package.json') -PathType Leaf)) {
  throw "Repository package.json not found: $repository"
}
if (
  (Test-Path -LiteralPath $staging) -and
  -not (Test-Path -LiteralPath $staging -PathType Container)
) {
  throw "Restore staging path is not a directory: $staging"
}

$sourceItem = Get-Item -LiteralPath $source -Force
if ($sourceItem.LinkType -ne 'Junction') {
  throw "Source is not a junction: $source"
}
$actualTarget = [System.IO.Path]::GetFullPath([string]$sourceItem.Target)
if (-not $actualTarget.Equals($expectedTarget, [StringComparison]::OrdinalIgnoreCase)) {
  throw "Junction target mismatch. Expected $expectedTarget but found $actualTarget"
}
if (-not (Test-Path -LiteralPath $actualTarget -PathType Container)) {
  throw "Junction target does not exist: $actualTarget"
}
if ([System.IO.Path]::GetPathRoot($source) -eq [System.IO.Path]::GetPathRoot($actualTarget)) {
  throw "Rollback helper is only for cross-drive junctions: $source -> $actualTarget"
}

$packageProcesses = Get-CimInstance Win32_Process |
  Where-Object {
    $_.Name -match '^(node|npm|npx)(\.exe|\.cmd)?$' -and
    $_.CommandLine -like "*$repository*"
  }
if ($packageProcesses) {
  throw "Refusing rollback while Node/npm uses this checkout: $($packageProcesses.ProcessId -join ', ')"
}

$sourceMeasure = Get-ChildItem -LiteralPath $actualTarget -Recurse -Force -File |
  Measure-Object -Property Length -Sum
$repositoryDrive = Get-PSDrive -Name ([System.IO.Path]::GetPathRoot($repository).TrimEnd(':\'))
$requiredBytes = [int64]$sourceMeasure.Sum + 536870912
if ([int64]$repositoryDrive.Free -lt $requiredBytes) {
  throw "Insufficient repository-drive space. Required $requiredBytes bytes; free $($repositoryDrive.Free) bytes."
}

New-Item -ItemType Directory -Path $staging -Force | Out-Null
$stagingMeasure = Get-ChildItem -LiteralPath $staging -Recurse -Force -File |
  Measure-Object -Property Length -Sum
$stagingAlreadyComplete =
  $stagingMeasure.Count -eq $sourceMeasure.Count -and
  [int64]$stagingMeasure.Sum -eq [int64]$sourceMeasure.Sum

if (-not $stagingAlreadyComplete) {
  $robocopyArgs = @(
    $actualTarget,
    $staging,
    '/E',
    '/COPY:DAT',
    '/DCOPY:DAT',
    '/SL',
    '/SJ',
    '/R:2',
    '/W:1',
    '/NFL',
    '/NDL',
    '/NJH',
    '/NJS',
    '/NP'
  )
  & robocopy.exe @robocopyArgs
  $robocopyExit = $LASTEXITCODE
  if ($robocopyExit -gt 7) {
    throw "Robocopy failed with exit code $robocopyExit. Staging preserved at $staging"
  }

  $stagingMeasure = Get-ChildItem -LiteralPath $staging -Recurse -Force -File |
    Measure-Object -Property Length -Sum
}

if (
  $stagingMeasure.Count -ne $sourceMeasure.Count -or
  [int64]$stagingMeasure.Sum -ne [int64]$sourceMeasure.Sum
) {
  throw "Staged dependency tree does not match source. Source=$($sourceMeasure.Count)/$($sourceMeasure.Sum), staging=$($stagingMeasure.Count)/$($stagingMeasure.Sum)"
}

[System.IO.Directory]::Delete($source, $false)
try {
  Move-Item -LiteralPath $staging -Destination $source
} catch {
  if (-not (Test-Path -LiteralPath $source)) {
    New-Item -ItemType Junction -Path $source -Target $actualTarget | Out-Null
  }
  throw
}

$restoredItem = Get-Item -LiteralPath $source -Force
if ($restoredItem.LinkType -or -not $restoredItem.PSIsContainer) {
  throw "Restored node_modules is not a physical directory: $source"
}

[pscustomobject]@{
  restored = $true
  source = $source
  backup = $actualTarget
  files = $stagingMeasure.Count
  bytes = [int64]$stagingMeasure.Sum
  repositoryDriveFree = [int64](Get-PSDrive -Name ([System.IO.Path]::GetPathRoot($repository).TrimEnd(':\'))).Free
}
