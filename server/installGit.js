const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const destDir = path.join('C:', 'Users', 'A', 'AppData', 'Local', 'Programs', 'Git');
fs.mkdirSync(destDir, { recursive: true });
const zipPath = path.join(destDir, 'mingit.zip');

console.log('Downloading MinGit to:', zipPath);

function download(url) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirecting to:', res.headers.location);
      download(res.headers.location);
      return;
    }
    const file = fs.createWriteStream(zipPath);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download complete. Extracting via tar...');
      try {
        execSync(`tar -xf "${zipPath}" -C "${destDir}"`);
        fs.unlinkSync(zipPath);
        console.log('MinGit installed successfully at:', destDir);
        const gitExe = path.join(destDir, 'cmd', 'git.exe');
        console.log('Git executable:', gitExe);
      } catch (err) {
        console.error('Extract error:', err.message);
      }
    });
  }).on('error', (err) => {
    console.error('Download error:', err.message);
  });
}

download('https://github.com/git-for-windows/git/releases/download/v2.56.0.windows.4/MinGit-2.56.0.4-64-bit.zip');
