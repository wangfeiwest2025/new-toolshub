// Simple API tests
const http = require('http');

const BASE_URL = 'http://localhost:3002';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Running API tests...\n');

  // Test 1: Health check
  console.log('Test 1: Health Check');
  try {
    const result = await makeRequest('GET', '/api/health');
    console.log(`  Status: ${result.status}`);
    if (result.data && result.data.status === 'OK') {
      console.log(`  Response: ${JSON.stringify(result.data)}`);
      console.log('  ✓ Health check passed\n');
    } else {
      console.log('  ✗ Health check failed - unexpected response\n');
    }
  } catch (error) {
    console.log('  ✗ Health check failed:', error.message, '\n');
  }

  // Test 2: UUID Generation
  console.log('Test 2: UUID Generation');
  try {
    const result = await makeRequest('GET', '/api/uuid?count=3');
    console.log(`  Status: ${result.status}`);
    if (result.data && result.data.data && result.data.data.uuids) {
      console.log(`  Generated ${result.data.data.uuids.length} UUIDs`);
      console.log('  Sample:', result.data.data.uuids[0]);
      console.log('  ✓ UUID generation passed\n');
    } else {
      console.log('  ✗ UUID generation failed - unexpected response\n');
    }
  } catch (error) {
    console.log('  ✗ UUID generation failed:', error.message, '\n');
  }

  // Test 3: Password Generation
  console.log('Test 3: Password Generation');
  try {
    const result = await makeRequest('POST', '/api/password', {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    });
    console.log(`  Status: ${result.status}`);
    if (result.data && result.data.data && result.data.data.password) {
      console.log(`  Generated password: ${result.data.data.password}`);
      console.log('  ✓ Password generation passed\n');
    } else {
      console.log('  ✗ Password generation failed - unexpected response\n');
    }
  } catch (error) {
    console.log('  ✗ Password generation failed:', error.message, '\n');
  }

  // Test 4: Hash Generation
  console.log('Test 4: Hash Generation');
  try {
    const result = await makeRequest('POST', '/api/hash', {
      text: 'Hello, World!',
      algorithm: 'sha256'
    });
    console.log(`  Status: ${result.status}`);
    if (result.data && result.data.data && result.data.data.hash) {
      console.log(`  Hash: ${result.data.data.hash}`);
      console.log('  ✓ Hash generation passed\n');
    } else {
      console.log('  ✗ Hash generation failed - unexpected response\n');
    }
  } catch (error) {
    console.log('  ✗ Hash generation failed:', error.message, '\n');
  }

  // Test 5: URL Shortener
  console.log('Test 5: URL Shortener');
  try {
    const result = await makeRequest('POST', '/api/shorten', {
      url: 'https://example.com'
    });
    console.log(`  Status: ${result.status}`);
    if (result.data && result.data.data && result.data.data.shortUrl) {
      console.log(`  Short URL: ${result.data.data.shortUrl}`);
      console.log('  ✓ URL shortening passed\n');
    } else {
      console.log('  ✗ URL shortening failed - unexpected response\n');
    }
  } catch (error) {
    console.log('  ✗ URL shortening failed:', error.message, '\n');
  }

  console.log('All tests completed!');
}

runTests().catch(console.error);
