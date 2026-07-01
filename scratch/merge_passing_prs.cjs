const { execSync } = require('child_process');
const prs = JSON.parse(execSync('gh pr list --json number,mergeable,statusCheckRollup').toString());

let mergedCount = 0;
prs.forEach(pr => {
  let canMerge = true;
  if (pr.mergeable !== 'MERGEABLE') canMerge = false;
  
  if (pr.statusCheckRollup && pr.statusCheckRollup.length > 0) {
    pr.statusCheckRollup.forEach(check => {
      // If a check failed or requires action, we can't merge
      if (check.conclusion === 'FAILURE' || check.conclusion === 'ACTION_REQUIRED' || check.conclusion === 'CANCELLED' || check.conclusion === 'TIMED_OUT') {
        canMerge = false;
      }
      // If a check is still running, we can't merge
      if (check.status !== 'COMPLETED') {
        canMerge = false;
      }
    });
  } else {
    // If there are no checks at all, we might want to wait, but let's assume it's mergeable if mergeable status is MERGEABLE.
    // Actually, usually we wait for checks. Let's be safe.
  }

  if (canMerge) {
    console.log(`Attempting to merge PR ${pr.number}...`);
    try {
      execSync(`gh pr merge ${pr.number} --squash --delete-branch`);
      console.log(`Successfully merged PR ${pr.number}`);
      mergedCount++;
    } catch (e) {
      console.error(`Failed to merge PR ${pr.number}`);
    }
  } else {
    console.log(`PR ${pr.number} is not ready to merge yet (checks pending/failing or not mergeable).`);
  }
});

if (mergedCount === 0) {
  console.log("No PRs were ready to be merged at this exact moment.");
}
