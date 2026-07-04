const http = require('http');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';

async function verifyServerActive() {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}/api/health`, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function run() {
  console.log('\x1b[35m%s\x1b[0m', '=== FIELDFLOW INTEGRATION TEST SUITE ===\n');
  
  const active = await verifyServerActive();
  if (!active) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error: The backend server is not running on http://localhost:5000.');
    console.error('Please start the backend server first (e.g. using `npm start` in the backend folder).');
    process.exit(1);
  }

  console.log('\x1b[36m%s\x1b[0m', '✅ Backend server is active at http://localhost:5000.');
  console.log('Starting execution of test modules...\n');

  const testFiles = ['auth.test.js', 'weather.test.js', 'outbreaks.test.js', 'technologies.test.js', 'pests.test.js', 'predict.test.js'];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failuresList = [];

  // Helper context passed to tests (e.g. to share tokens between auth and other tests)
  const context = {
    baseUrl: BASE_URL,
    token: null,
    registerAssertion: (desc, passed, errorMsg = '') => {
      totalTests++;
      if (passed) {
        passedTests++;
        console.log(`  \x1b[32m✔\x1b[0m ${desc}`);
      } else {
        failedTests++;
        console.log(`  \x1b[31m✘ ${desc}\x1b[0m`);
        if (errorMsg) {
          console.log(`    \x1b[90m└─ Error: ${errorMsg}\x1b[0m`);
        }
        failuresList.push({ desc, errorMsg });
      }
    }
  };

  for (const file of testFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log('\x1b[33m%s\x1b[0m', `\n--- Executing Test Suite: ${file} ---`);
      try {
        const testSuite = require(filePath);
        await testSuite(context);
      } catch (err) {
        console.error(`\x1b[31mFatal error running test suite ${file}:\x1b[0m`, err);
      }
    }
  }

  console.log('\x1b[35m%s\x1b[0m', '\n========================================');
  console.log('\x1b[35m%s\x1b[0m', '===        TEST RESULTS SUMMARY      ===');
  console.log('\x1b[35m%s\x1b[0m', '========================================');
  console.log(`Total Assertions Run: ${totalTests}`);
  console.log(`Passed: \x1b[32m${passedTests}\x1b[0m`);
  console.log(`Failed: \x1b[31m${failedTests}\x1b[0m`);

  if (failuresList.length > 0) {
    console.log('\x1b[31m%s\x1b[0m', '\n--- Detailed List of Failures: ---');
    failuresList.forEach((fail, i) => {
      console.log(`\x1b[31m${i + 1}. ${fail.desc}\x1b[0m`);
      console.log(`   \x1b[90m${fail.errorMsg}\x1b[0m`);
    });
    process.exit(1);
  } else {
    console.log('\x1b[32m%s\x1b[0m', '\n🏆 SUCCESS: All assertions completed successfully!');
    process.exit(0);
  }
}

run();
