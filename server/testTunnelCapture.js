const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Testing Cloudflare URL capture...');
const cloudflaredPath = path.join(__dirname, '..', 'cloudflared.exe');

const cp = spawn(cloudflaredPath, ['tunnel', '--url', 'http://127.0.0.1:5000']);

cp.stderr.on('data', (data) => {
  const text = data.toString();
  const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
  if (match) {
    console.log('Captured Cloudflare URL:', match[0]);
    cp.kill();
    process.exit(0);
  }
});
