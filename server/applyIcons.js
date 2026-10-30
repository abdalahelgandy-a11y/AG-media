const fs = require('fs');
const path = require('path');

const srcLogo = path.join(__dirname, '..', 'public', 'logo.png');
const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

if (!fs.existsSync(srcLogo)) {
  console.error('Source logo does not exist:', srcLogo);
  process.exit(1);
}

const targets = [
  'drawable/splash.png',
  'drawable-port-hdpi/splash.png',
  'drawable-port-mdpi/splash.png',
  'drawable-port-xhdpi/splash.png',
  'drawable-port-xxhdpi/splash.png',
  'drawable-port-xxxhdpi/splash.png',
  'drawable-land-hdpi/splash.png',
  'drawable-land-mdpi/splash.png',
  'drawable-land-xhdpi/splash.png',
  'drawable-land-xxhdpi/splash.png',
  'drawable-land-xxxhdpi/splash.png',
  'mipmap-hdpi/ic_launcher.png',
  'mipmap-mdpi/ic_launcher.png',
  'mipmap-xhdpi/ic_launcher.png',
  'mipmap-xxhdpi/ic_launcher.png',
  'mipmap-xxxhdpi/ic_launcher.png',
  'mipmap-hdpi/ic_launcher_round.png',
  'mipmap-mdpi/ic_launcher_round.png',
  'mipmap-xhdpi/ic_launcher_round.png',
  'mipmap-xxhdpi/ic_launcher_round.png',
  'mipmap-xxxhdpi/ic_launcher_round.png',
  'mipmap-hdpi/ic_launcher_foreground.png',
  'mipmap-mdpi/ic_launcher_foreground.png',
  'mipmap-xhdpi/ic_launcher_foreground.png',
  'mipmap-xxhdpi/ic_launcher_foreground.png',
  'mipmap-xxxhdpi/ic_launcher_foreground.png'
];

targets.forEach(rel => {
  const dest = path.join(resDir, rel);
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(srcLogo, dest);
});

console.log(`Successfully applied AG-media logo to ${targets.length} Android resource targets!`);
