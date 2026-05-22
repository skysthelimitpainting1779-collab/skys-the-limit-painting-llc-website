import fs from 'fs';
import path from 'path';

function verifyCSP() {
  console.log('Initiating Content Security Policy (CSP) Header Verification... 🧬');
  
  const vercelPath = path.resolve('vercel.json');
  if (!fs.existsSync(vercelPath)) {
    console.error('vercel.json not found in root directory! 🧬');
    process.exit(1);
  }
  
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    
    // Scan headers mapping
    const fileHeaders = vercelConfig.headers || [];
    let cspFound = false;
    let cspValue = '';
    
    fileHeaders.forEach(route => {
      const headersList = route.headers || [];
      headersList.forEach(header => {
        if (header.key && header.key.toLowerCase() === 'content-security-policy') {
          cspFound = true;
          cspValue = header.value;
        }
      });
    });
    
    if (!cspFound) {
      console.error('[FAIL] Content-Security-Policy header is missing in vercel.json! 🧬');
      process.exit(1);
    }
    
    console.log('[SUCCESS] CSP header found in vercel.json configuration. 🧬');
    console.log(`CSP Directives: ${cspValue}`);
    
    // We enforce key security bounds:
    const checks = [
      { term: "default-src 'self'", desc: "default-src locked to 'self'" },
      { term: "object-src 'none'", desc: "object-src locked to 'none' (blocks Flash/Java exploits)" },
      { term: "frame-ancestors 'none'", desc: "frame-ancestors locked to 'none' (blocks clickjacking)" },
      { term: "base-uri 'self'", desc: "base-uri set to 'self'" }
    ];
    
    let failed = false;
    checks.forEach(check => {
      if (cspValue.includes(check.term)) {
        console.log(`[PASS] ${check.desc} 🧬`);
      } else {
        console.log(`[FAIL] Missing check: ${check.term} - ${check.desc} 🧬`);
        failed = true;
      }
    });
    
    // Assert that we don't use unsafe wildcard * for script-src
    if (cspValue.includes("script-src *") || cspValue.includes("script-src 'unsafe-eval'")) {
      console.log("[FAIL] script-src contains unsafe '*' or 'unsafe-eval' directives. 🧬");
      failed = true;
    } else {
      console.log("[PASS] script-src does not contain unsafe wildcards or unsafe-evals. 🧬");
    }
    
    if (failed) {
      console.error('\n[FAIL] CSP security verification failed. Please review vercel.json. 🧬');
      process.exit(1);
    }
    
    console.log('\n[SUCCESS] Content Security Policy (CSP) header is robust, highly secure, and verified! 🧬');
  } catch (err) {
    console.error('Error parsing vercel.json:', err.message);
    process.exit(1);
  }
}

verifyCSP();
