const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

if (!fs.existsSync(logoPath)) {
  console.error('Logo not found at:', logoPath);
  process.exit(1);
}

const logoData = fs.readFileSync(logoPath);
const srcPng = PNG.sync.read(logoData);
console.log(`Loaded source logo: ${srcPng.width}x${srcPng.height}`);

// Helper: Bilinear resize and draw src onto dst at (dx, dy, dw, dh)
function drawImage(dst, src, dx, dy, dw, dh) {
  for (let y = 0; y < dh; y++) {
    const srcY = (y / dh) * src.height;
    const y0 = Math.floor(srcY);
    const y1 = Math.min(y0 + 1, src.height - 1);
    const wy = srcY - y0;

    const dstY = Math.round(dy + y);
    if (dstY < 0 || dstY >= dst.height) continue;

    for (let x = 0; x < dw; x++) {
      const srcX = (x / dw) * src.width;
      const x0 = Math.floor(srcX);
      const x1 = Math.min(x0 + 1, src.width - 1);
      const wx = srcX - x0;

      const dstX = Math.round(dx + x);
      if (dstX < 0 || dstX >= dst.width) continue;

      const idx00 = (src.width * y0 + x0) << 2;
      const idx01 = (src.width * y0 + x1) << 2;
      const idx10 = (src.width * y1 + x0) << 2;
      const idx11 = (src.width * y1 + x1) << 2;

      // Alpha blending
      const a00 = src.data[idx00 + 3];
      const a01 = src.data[idx01 + 3];
      const a10 = src.data[idx10 + 3];
      const a11 = src.data[idx11 + 3];
      const a = (1 - wy) * ((1 - wx) * a00 + wx * a01) + wy * ((1 - wx) * a10 + wx * a11);

      if (a <= 5) continue;

      const r = (1 - wy) * ((1 - wx) * src.data[idx00] + wx * src.data[idx01]) + wy * ((1 - wx) * src.data[idx10] + wx * src.data[idx11]);
      const g = (1 - wy) * ((1 - wx) * src.data[idx00+1] + wx * src.data[idx01+1]) + wy * ((1 - wx) * src.data[idx10+1] + wx * src.data[idx11+1]);
      const b = (1 - wy) * ((1 - wx) * src.data[idx00+2] + wx * src.data[idx01+2]) + wy * ((1 - wx) * src.data[idx10+2] + wx * src.data[idx11+2]);

      const dstIdx = (dst.width * dstY + dstX) << 2;
      const alphaNorm = a / 255;
      const invAlpha = 1 - alphaNorm;

      dst.data[dstIdx] = Math.round(r * alphaNorm + dst.data[dstIdx] * invAlpha);
      dst.data[dstIdx + 1] = Math.round(g * alphaNorm + dst.data[dstIdx + 1] * invAlpha);
      dst.data[dstIdx + 2] = Math.round(b * alphaNorm + dst.data[dstIdx + 2] * invAlpha);
      dst.data[dstIdx + 3] = Math.min(255, Math.round(a + dst.data[dstIdx + 3] * invAlpha));
    }
  }
}

// 1. Generate Square App Icon with White Background and Padding
function createIcon(size, isRound = false) {
  const icon = new PNG({ width: size, height: size });
  // Fill background
  const rBg = 255, gBg = 255, bBg = 255;
  const radius = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      if (isRound) {
        const dist = Math.hypot(x - radius, y - radius);
        if (dist > radius) {
          icon.data[idx + 3] = 0; // transparent outside circle
          continue;
        }
      }
      icon.data[idx] = rBg;
      icon.data[idx + 1] = gBg;
      icon.data[idx + 2] = bBg;
      icon.data[idx + 3] = 255;
    }
  }

  // Draw logo with safe padding (safe width = 72% of icon size)
  const targetW = Math.round(size * 0.72);
  const targetH = Math.round((targetW / srcPng.width) * srcPng.height);
  const offsetX = Math.round((size - targetW) / 2);
  const offsetY = Math.round((size - targetH) / 2);

  drawImage(icon, srcPng, offsetX, offsetY, targetW, targetH);
  return PNG.sync.write(icon);
}

// 2. Generate Adaptive Foreground Icon (Transparent with centered logo inside 66% circle)
function createForegroundIcon(size) {
  const icon = new PNG({ width: size, height: size });
  // Safe zone for adaptive icon foreground is center 66%
  const targetW = Math.round(size * 0.58);
  const targetH = Math.round((targetW / srcPng.width) * srcPng.height);
  const offsetX = Math.round((size - targetW) / 2);
  const offsetY = Math.round((size - targetH) / 2);

  drawImage(icon, srcPng, offsetX, offsetY, targetW, targetH);
  return PNG.sync.write(icon);
}

// 3. Generate Vertical Splash Screen (High-res portrait with centered logo)
function createSplash(width, height) {
  const splash = new PNG({ width, height });
  // Clean white background
  for (let i = 0; i < splash.data.length; i += 4) {
    splash.data[i] = 255;
    splash.data[i + 1] = 255;
    splash.data[i + 2] = 255;
    splash.data[i + 3] = 255;
  }

  // Center logo: width ~60% of screen width, max 600px
  const targetW = Math.min(Math.round(width * 0.65), 650);
  const targetH = Math.round((targetW / srcPng.width) * srcPng.height);
  const offsetX = Math.round((width - targetW) / 2);
  const offsetY = Math.round((height - targetH) / 2);

  drawImage(splash, srcPng, offsetX, offsetY, targetW, targetH);
  return PNG.sync.write(splash);
}

console.log('Generating Android Launcher Icons (Square, Round, Foreground)...');

const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const fgSizes = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432
};

for (const [folder, size] of Object.entries(iconSizes)) {
  const dir = path.join(resDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), createIcon(size, false));
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), createIcon(size, true));
}

for (const [folder, size] of Object.entries(fgSizes)) {
  const dir = path.join(resDir, folder);
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), createForegroundIcon(size));
}

console.log('Generating Android Splash Screens (Clean White Background, Centered Proportional Logo)...');

const splashSizes = {
  'drawable': [800, 1200],
  'drawable-port-mdpi': [320, 480],
  'drawable-port-hdpi': [480, 800],
  'drawable-port-xhdpi': [720, 1280],
  'drawable-port-xxhdpi': [960, 1600],
  'drawable-port-xxxhdpi': [1280, 1920],
  'drawable-land-mdpi': [480, 320],
  'drawable-land-hdpi': [800, 480],
  'drawable-land-xhdpi': [1280, 720],
  'drawable-land-xxhdpi': [1600, 960],
  'drawable-land-xxxhdpi': [1920, 1280]
};

for (const [folder, [w, h]] of Object.entries(splashSizes)) {
  const dir = path.join(resDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), createSplash(w, h));
}

console.log('Successfully generated all Android icons and splash screens with perfect proportions!');
