const { execSync } = require('child_process');
const prs = JSON.parse(execSync('gh pr list --json number,author').toString());
prs.filter(pr => pr.author.login === 'app/dependabot').forEach(pr => {
    console.log('Recreating PR ' + pr.number);
    execSync(`gh pr comment ${pr.number} --body "@dependabot recreate"`);
});
