const https = require('https');
const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'cloudflared.exe');

if (fs.existsSync(targetPath)) {
  console.log('cloudflared already exists at:', targetPath);
  process.exit(0);
}

const fileUrl = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe';

console.log('Downloading cloudflared from:', fileUrl);

function download(url, dest) {
  const file = fs.createWriteStream(dest);
  const request = https.get(url, (response) => {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      console.log('Redirecting to:', response.headers.location);
      return download(response.headers.location, dest);
    }
    if (response.statusCode !== 200) {
      console.error('Download failed with status:', response.statusCode);
      process.exit(1);
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        console.log('Successfully downloaded cloudflared.exe!');
      });
    });
  });

  request.on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error('Error downloading:', err.message);
  });
}

download(fileUrl, targetPath);
