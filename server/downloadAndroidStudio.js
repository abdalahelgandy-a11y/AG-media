const https = require('https');
const fs = require('fs');
const path = require('path');

const targetPath = 'D:\\AG-media system\\android-studio-installer.exe';
const downloadUrl = 'https://edgedl.me.gvt1.com/android/studio/install/2026.2.1.8/android-studio-rabbit1-windows.exe';

if (fs.existsSync(targetPath)) {
  const stat = fs.statSync(targetPath);
  if (stat.size > 500 * 1024 * 1024) {
    console.log(`Android Studio installer already exists (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    process.exit(0);
  }
}

console.log('Starting Android Studio download...');
console.log('Target:', targetPath);

function download(url, dest) {
  const file = fs.createWriteStream(dest);
  const req = https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirecting to:', res.headers.location);
      return download(res.headers.location, dest);
    }
    if (res.statusCode !== 200) {
      console.error('Failed with status code:', res.statusCode);
      process.exit(1);
    }

    const total = parseInt(res.headers['content-length'] || '0', 10);
    let downloaded = 0;
    let lastLog = Date.now();

    res.on('data', (chunk) => {
      downloaded += chunk.length;
      if (Date.now() - lastLog > 5000) {
        lastLog = Date.now();
        const pct = total ? ((downloaded / total) * 100).toFixed(1) : '?';
        const mb = (downloaded / 1024 / 1024).toFixed(1);
        const totalMb = (total / 1024 / 1024).toFixed(1);
        console.log(`Progress: ${mb} MB / ${totalMb} MB (${pct}%)`);
      }
    });

    res.pipe(file);

    file.on('finish', () => {
      file.close(() => {
        console.log('Android Studio installer downloaded successfully!');
      });
    });
  });

  req.on('error', (err) => {
    console.error('Download error:', err.message);
    process.exit(1);
  });
}

download(downloadUrl, targetPath);
