import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// ANSI escape codes for coloring
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

async function getHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getHtmlFiles(fullPath)));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function validateSchemas() {
  const distDir = path.resolve('dist');
  console.log(
    `\n${BLUE}[Schema Validator] Scanning directory: ${distDir}${RESET}`
  );

  let htmlFiles;
  try {
    htmlFiles = await getHtmlFiles(distDir);
  } catch (err) {
    console.error(
      `${RED}Error reading dist directory. Has the site been built? (${err.message})${RESET}`
    );
    process.exit(1);
  }

  if (htmlFiles.length === 0) {
    console.log(
      `${YELLOW}No HTML files found to validate. Run a production build first.${RESET}`
    );
    process.exit(1);
  }

  console.log(
    `[Schema Validator] Found ${htmlFiles.length} HTML files to inspect.`
  );
  let totalSchemasChecked = 0;
  let invalidSchemasCount = 0;

  for (const file of htmlFiles) {
    const relativePath = path.relative(distDir, file);
    const content = await readFile(file, 'utf8');

    // Find all application/ld+json scripts
    const scriptRegex =
      /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let fileSchemasCount = 0;

    while ((match = scriptRegex.exec(content)) !== null) {
      const jsonContent = match[1].trim();
      fileSchemasCount++;

      try {
        const parsed = JSON.parse(jsonContent);
        const schemas = Array.isArray(parsed) ? parsed : [parsed];

        for (const schema of schemas) {
          totalSchemasChecked++;

          // Basic schema.org integrity checks
          if (!schema['@context']) {
            console.error(
              `${RED}  [FAIL] ${relativePath}: Schema is missing @context.${RESET}`
            );
            invalidSchemasCount++;
            continue;
          }

          const context = schema['@context'];
          if (
            context !== 'https://schema.org' &&
            context !== 'http://schema.org'
          ) {
            console.error(
              `${RED}  [FAIL] ${relativePath}: Invalid @context value "${context}".${RESET}`
            );
            invalidSchemasCount++;
            continue;
          }

          if (!schema['@type']) {
            console.error(
              `${RED}  [FAIL] ${relativePath}: Schema is missing @type.${RESET}`
            );
            invalidSchemasCount++;
            continue;
          }

          // Output check detail based on type
          const type = schema['@type'];
          if (type === 'HousePainter') {
            if (!schema.name || !schema.telephone || !schema.email) {
              console.error(
                `${RED}  [FAIL] ${relativePath} (HousePainter): Missing name, phone, or email.${RESET}`
              );
              invalidSchemasCount++;
            }
          } else if (type === 'BreadcrumbList') {
            if (
              !schema.itemListElement ||
              !Array.isArray(schema.itemListElement)
            ) {
              console.error(
                `${RED}  [FAIL] ${relativePath} (BreadcrumbList): Missing or invalid itemListElement array.${RESET}`
              );
              invalidSchemasCount++;
            }
          } else if (type === 'Service') {
            if (!schema.name || !schema.provider) {
              console.error(
                `${RED}  [FAIL] ${relativePath} (Service): Missing service name or provider block.${RESET}`
              );
              invalidSchemasCount++;
            }
          }
        }
      } catch (err) {
        console.error(
          `${RED}  [FAIL] ${relativePath}: Invalid JSON format inside schema script tag. Error: ${err.message}${RESET}`
        );
        invalidSchemasCount++;
      }
    }
  }

  console.log(`\n${BLUE}[Schema Validator] Validation complete:${RESET}`);
  console.log(`  - Total HTML files parsed: ${htmlFiles.length}`);
  console.log(`  - Total JSON-LD schemas validated: ${totalSchemasChecked}`);

  if (invalidSchemasCount > 0) {
    console.log(
      `  - Status: ${RED}FAILED (${invalidSchemasCount} invalid schemas found)${RESET}\n`
    );
    process.exit(1);
  } else {
    console.log(
      `  - Status: ${GREEN}SUCCESS (All schemas are syntactically valid and compliant)${RESET}\n`
    );
    process.exit(0);
  }
}

validateSchemas();
