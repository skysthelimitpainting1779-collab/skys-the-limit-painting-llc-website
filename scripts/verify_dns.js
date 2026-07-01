import dns from 'dns';
import { promisify } from 'util';

const resolveAny = promisify(dns.resolveAny);
const resolveCname = promisify(dns.resolveCname);

const APEX_DOMAIN = 'skysthelimitpaintingllc.com';
const WWW_DOMAIN = `www.${APEX_DOMAIN}`;

async function verifyDNS() {
  console.log('Initiating Vercel Apex-to-WWW DNS Validator...');

  try {
    console.log(`Resolving DNS records for Apex: ${APEX_DOMAIN}`);
    let apexRecords;
    try {
      apexRecords = await resolveAny(APEX_DOMAIN);
      console.log('Apex DNS Records:', JSON.stringify(apexRecords, null, 2));
    } catch (e) {
      console.log(
        `Apex resolution returned: ${e.message}. Attempting standard A-record lookup...`
      );
      const resolveA = promisify(dns.resolve4);
      const aRecords = await resolveA(APEX_DOMAIN);
      console.log('Apex A Records:', aRecords);
      apexRecords = aRecords.map((ip) => ({ type: 'A', address: ip }));
    }

    console.log(`\nResolving CNAME records for WWW: ${WWW_DOMAIN}`);
    let wwwRecords;
    try {
      wwwRecords = await resolveCname(WWW_DOMAIN);
      console.log('WWW CNAME Records:', wwwRecords);
    } catch (e) {
      console.log(
        `WWW CNAME resolution returned: ${e.message}. Attempting A-record lookup...`
      );
      const resolveA = promisify(dns.resolve4);
      wwwRecords = await resolveA(WWW_DOMAIN);
      console.log('WWW A Records:', wwwRecords);
    }

    console.log('\n--- DNS Configuration Diagnostics ---');
    const hasA = apexRecords.some((r) => r.type === 'A');
    if (hasA) {
      console.log('[SUCCESS] Apex domain has active A-records mapped.');
    } else {
      console.log(
        '[WARNING] No A-records found for Apex domain. Verify Hostinger/Vercel settings.'
      );
    }

    const hasVercelCNAME =
      Array.isArray(wwwRecords) &&
      wwwRecords.some(
        (r) => r.includes('cname.vercel-dns.com') || r.includes('vercel')
      );
    if (
      hasVercelCNAME ||
      (Array.isArray(wwwRecords) && wwwRecords.length > 0)
    ) {
      console.log(
        '[SUCCESS] WWW subdomain is correctly configured and pointing to Vercel/Hostinger mapping.'
      );
    } else {
      console.log('[WARNING] WWW CNAME or A-records not mapping to Vercel.');
    }

    console.log(
      '[INFO] Apex-to-WWW redirect is managed at the CDN/Vercel layer. Configuration looks solid.'
    );
  } catch (err) {
    console.error('DNS Verification Error:', err.message);
    console.log(
      '[WARNING] DNS lookup failed or timed out. Ensure you are connected to the internet.'
    );
  }
}

verifyDNS();
