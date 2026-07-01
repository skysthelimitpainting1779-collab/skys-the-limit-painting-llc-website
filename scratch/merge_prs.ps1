$prs = gh pr list --json number,mergeable,statusCheckRollup | ConvertFrom-Json
foreach ($pr in $prs) {
    if ($pr.mergeable -eq 'MERGEABLE') {
        $hasFailure = $false
        if ($pr.statusCheckRollup) {
            foreach ($check in $pr.statusCheckRollup) {
                if ($check.conclusion -eq 'FAILURE' -or $check.conclusion -eq 'ACTION_REQUIRED') {
                    $hasFailure = $true
                }
            }
        }
        if (-not $hasFailure) {
            Write-Host "Merging PR $($pr.number)"
            gh pr merge $pr.number --squash --delete-branch
        } else {
            Write-Host "Skipping PR $($pr.number) due to failing checks"
        }
    } else {
        Write-Host "Skipping PR $($pr.number) due to mergeability $($pr.mergeable)"
    }
}
