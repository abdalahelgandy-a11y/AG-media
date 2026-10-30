const fs = require('fs');
const path = require('path');

async function buildApk() {
  const host = 'https://dating-arizona-selections-newman.trycloudflare.com';
  const iconUrl = `${host}/logo.png`;
  const manifestUrl = `${host}/manifest.json`;

  const payload = {
    packageId: 'agency.agmedia.crm',
    name: 'AG-media',
    launcherName: 'AG-media',
    host: host,
    startUrl: '/',
    webManifestUrl: manifestUrl,
    themeColor: '#134C5C',
    navigationColor: '#134C5C',
    backgroundColor: '#134C5C',
    splashScreenColor: '#134C5C',
    splashScreenFadeOutDuration: 1000,
    signingMode: 'new',
    signing: {
      file: null,
      alias: 'agmedia',
      keyPassword: 'FyWrQtxLj5CO',
      storePassword: 'FyWrQtxLj5CO',
      fullName: 'AG Media Admin',
      organization: 'AG-media Agency',
      organizationalUnit: 'IT Dept',
      countryCode: 'EG'
    },
    iconUrl: iconUrl,
    maskableIconUrl: iconUrl,
    appVersion: '2.1.0.0',
    appVersionCode: 3,
    display: 'fullscreen',
    orientation: 'portrait-primary',
    enableNotifications: true,
    enableSiteSettingsShortcut: false,
    fallbackType: 'webview',
    includeSourceCode: false,
    features: {
      locationDelegation: { enabled: false },
      playBilling: { enabled: false }
    }
  };

  console.log('Sending request to PWABuilder CloudAPK service...');
  const res = await fetch('https://pwabuilder-cloudapk.azurewebsites.net/generateAppPackage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0'
    },
    body: JSON.stringify(payload)
  });

  console.log('Response status:', res.status, res.statusText);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error response:', errorText);
    process.exit(1);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const zipPath = path.join(__dirname, '..', 'agmedia-android-package-v2.zip');
  fs.writeFileSync(zipPath, buffer);
  console.log(`Saved Android package zip (${(buffer.length / 1024 / 1024).toFixed(2)} MB) to:`, zipPath);
}

buildApk().catch(err => {
  console.error('Build APK failed:', err);
  process.exit(1);
});
