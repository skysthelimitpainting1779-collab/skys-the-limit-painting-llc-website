import https from 'https';

function checkUrl(url) {
  return new Promise((resolve) => {
    console.log(`Checking: ${url}`);
    const req = https.get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log('Location redirect header:', res.headers.location || 'none');
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
      resolve();
    });
    
    req.on('error', (err) => {
      console.error(`Error for ${url}:`, err.message);
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log(`Timeout for ${url}`);
      req.destroy();
      resolve();
    });
  });
}

async function run() {
  await checkUrl('https://skysthelimitpaintingllc.com/');
  console.log('\n----------------------------------------\n');
  await checkUrl('https://www.skysthelimitpaintingllc.com/');
}

run();
