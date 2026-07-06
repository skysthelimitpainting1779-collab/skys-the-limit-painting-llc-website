#!/bin/bash
set -e

echo "Running CI Health Check..."
FAILED=0

# 1. Check if .nvmrc exists and is valid
if [ ! -f .nvmrc ]; then
  echo "❌ .nvmrc missing."
  FAILED=1
else
  NVMRC_VER=$(cat .nvmrc)
  if [[ ! "$NVMRC_VER" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "❌ .nvmrc contains invalid format ($NVMRC_VER). Expected exact version like 24.0.0"
    FAILED=1
  else
    echo "✅ .nvmrc is valid ($NVMRC_VER)."
  fi
fi

# 2. Check for deprecated '24.x' patterns in workflows
if grep -q "node-version: '24.x'" .github/workflows/*.yml 2>/dev/null; then
  echo "❌ Found deprecated '24.x' node-version in workflows. Use node-version-file: '.nvmrc'"
  FAILED=1
else
  echo "✅ No deprecated '24.x' patterns found in workflows."
fi

# 3. Check if CodeQL versions are consistent in security-scan.yml
if [ -f .github/workflows/security-scan.yml ]; then
  CODEQL_VERSIONS=$(grep "uses: github/codeql-action/" .github/workflows/security-scan.yml | awk -F'@' '{print $2}' | sort | uniq | wc -l)
  if [ "$CODEQL_VERSIONS" -gt 1 ]; then
    echo "❌ Inconsistent CodeQL versions found in security-scan.yml."
    FAILED=1
  else
    echo "✅ CodeQL versions are consistent."
  fi
fi

# 4. Check if VERCEL_TOKEN is referenced in release.yml
if [ -f .github/workflows/release.yml ]; then
  if ! grep -q "VERCEL_TOKEN" .github/workflows/release.yml; then
    echo "❌ VERCEL_TOKEN is not referenced in release.yml."
    FAILED=1
  else
    echo "✅ VERCEL_TOKEN is correctly referenced."
  fi
fi

if [ "$FAILED" -eq 1 ]; then
  echo "CI Health Check FAILED. See .github/WORKFLOW_TROUBLESHOOTING.md for fixes."
  exit 1
else
  echo "CI Health Check PASSED."
  exit 0
fi
