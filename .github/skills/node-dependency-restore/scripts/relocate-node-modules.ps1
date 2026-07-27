param(
  [Parameter(Mandatory = $true)]
  [string]$RepositoryPath,

  [Parameter(Mandatory = $true)]
  [string]$TargetPath,

  [int]$BatchSize = 75
)

$ErrorActionPreference = 'Stop'

$repository = [System.IO.Path]::GetFullPath($RepositoryPath)
$source = [System.IO.Path]::GetFullPath((Join-Path $repository 'node_modules'))
$expected = "$repository\node_modules"
$target = [System.IO.Path]::GetFullPath($TargetPath)
$residualRoot = "$target-residual"
$packageJsonPath = Join-Path $repository 'package.json'

if ($source -ne $expected) {
  throw "Unexpected node_modules path: $source"
}
if (
  -not $target.StartsWith('E:\DevCaches\node_modules\', [StringComparison]::OrdinalIgnoreCase) -or
  [System.IO.Path]::GetFileName($target) -ne 'node_modules'
) {
  throw "Target must be dedicated E:\DevCaches\node_modules storage: $target"
}
if (-not (Test-Path -LiteralPath $packageJsonPath -PathType Leaf)) {
  throw "Repository package.json not found: $packageJsonPath"
}

$packageJson = Get-Content -Raw -LiteralPath $packageJsonPath | ConvertFrom-Json
$hasNextDependency = $null -ne $packageJson.dependencies.next -or $null -ne $packageJson.devDependencies.next
$hasNextScript = @($packageJson.scripts.PSObject.Properties.Value) |
  Where-Object { $_ -match '(^|\s)next(?:\s|$)' } |
  Select-Object -First 1
$isCrossDrive = [System.IO.Path]::GetPathRoot($source) -ne [System.IO.Path]::GetPathRoot($target)
if (($hasNextDependency -or $hasNextScript) -and $isCrossDrive) {
  throw "Cross-drive node_modules relocation is prohibited for Next.js/Turbopack repositories: $source -> $target"
}

$packageProcesses = Get-CimInstance Win32_Process |
  Where-Object { $_.CommandLine -match 'npm(?:-cli\.js)?[" ]+install' }
if ($packageProcesses) {
  throw 'Refusing relocation while npm install is running.'
}

$sourceItem = Get-Item -LiteralPath $source -Force
if ($sourceItem.LinkType -eq 'Junction') {
  [pscustomobject]@{
    finalized = $true
    source = $source
    target = $sourceItem.Target
    remaining = 0
  }
  exit 0
}
if ($sourceItem.PSIsContainer -ne $true) {
  throw "Source is not a directory: $source"
}

New-Item -ItemType Directory -Path $target -Force | Out-Null
New-Item -ItemType Directory -Path $residualRoot -Force | Out-Null

$children = @(Get-ChildItem -LiteralPath $source -Force | Sort-Object Name | Select-Object -First $BatchSize)
foreach ($child in $children) {
  $destination = Join-Path $target $child.Name
  if (Test-Path -LiteralPath $destination) {
    $residual = Join-Path $residualRoot $child.Name
    if (Test-Path -LiteralPath $residual) {
      $residual = Join-Path $residualRoot "$($child.Name)-$([Guid]::NewGuid().ToString('N'))"
    }
    # The C: source is the completed post-install package. Preserve a colliding
    # E: entry as residual because it may be an incomplete prior move, then
    # promote the completed source into the canonical target.
    Move-Item -LiteralPath $destination -Destination $residual
    Move-Item -LiteralPath $child.FullName -Destination $destination
  } else {
    Move-Item -LiteralPath $child.FullName -Destination $destination
  }
}

$remaining = @(Get-ChildItem -LiteralPath $source -Force).Count
if ($remaining -eq 0) {
  Remove-Item -LiteralPath $source -Force
  New-Item -ItemType Junction -Path $source -Target $target | Out-Null
}

[pscustomobject]@{
  finalized = $remaining -eq 0
  source = $source
  target = $target
  remaining = $remaining
  movedThisRun = $children.Count
  residualRoot = $residualRoot
}
