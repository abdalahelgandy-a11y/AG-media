const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appData = process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Roaming');
const startupDir = path.join(appData, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
const vbsPath = 'D:\\AG-media system\\run-background.vbs';
const batPath = path.join(startupDir, 'agmedia-autostart.bat');

const batContent = `@echo off\r\nstart "" wscript.exe "${vbsPath}"\r\n`;

try {
  fs.writeFileSync(batPath, batContent, 'utf8');
  console.log('Successfully created auto-start bat in Startup folder:', batPath);
} catch (e) {
  console.error('Error creating autostart:', e.message);
}
