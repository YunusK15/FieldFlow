const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const pythonExe = process.platform === 'win32'
  ? path.join(projectRoot, 'venv', 'Scripts', 'python.exe')
  : path.join(projectRoot, 'venv', 'bin', 'python');
const scrapeScript = path.join(projectRoot, 'scrape_news.py');

console.log('projectRoot:', projectRoot);
console.log('pythonExe:', pythonExe, 'exists:', fs.existsSync(pythonExe));
console.log('scrapeScript:', scrapeScript, 'exists:', fs.existsSync(scrapeScript));

const pythonProcess = spawn(pythonExe, [scrapeScript], {
  cwd: projectRoot
});

let resultData = '';
let errorData = '';

pythonProcess.stdout.on('data', (data) => {
  resultData += data.toString();
});

pythonProcess.stderr.on('data', (data) => {
  errorData += data.toString();
});

pythonProcess.on('close', (code) => {
  console.log('Exit code:', code);
  console.log('Stdout:', resultData);
  console.log('Stderr:', errorData);
  try {
    const parsed = JSON.parse(resultData.trim());
    console.log('Parsed JSON count:', parsed.length);
  } catch (err) {
    console.error('JSON Parse error:', err);
  }
});
