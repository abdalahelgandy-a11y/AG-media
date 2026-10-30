const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('====================================================');
console.log('      نظام AG-media - التشغيل التلقائي الكامل       ');
console.log('====================================================');

const projectRoot = path.join(__dirname, '..');
const cloudflaredExe = path.join(projectRoot, 'cloudflared.exe');

// 1. Ensure node server is running
async function checkServer() {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/clients');
    if (res.ok) {
      console.log('[✓] خادم النظام (Node.js) يعمل بنجاح على المنفذ 5000.');
      return true;
    }
  } catch(e) {}
  return false;
}

async function startTunnel() {
  const isRunning = await checkServer();
  if (!isRunning) {
    console.log('[*] جاري بدء خادم النظام...');
    spawn('node', ['server/index.js'], { cwd: projectRoot, stdio: 'inherit' });
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('[*] جاري تشغيل نفق البث السحابي المشفر (Cloudflare)...');
  const cf = spawn(cloudflaredExe, ['tunnel', '--url', 'http://127.0.0.1:5000'], { cwd: projectRoot });

  cf.stderr.on('data', async (chunk) => {
    const text = chunk.toString();
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (match) {
      const liveUrl = match[0];
      console.log('\n====================================================');
      console.log('🎉 تم إنشاء الرابط السحابي المباشر بنجاح:');
      console.log('👉', liveUrl);
      console.log('====================================================\n');

      console.log('[*] جاري ربط الرابط المختصر https://ulvis.net/agmedia تلقائياً...');
      try {
        const r1 = await fetch(`https://ulvis.net/api.php?url=${encodeURIComponent(liveUrl)}&custom=agmedia`);
        const t1 = await r1.text();
        console.log('[✓] تم تحديث الرابط المختصر:', t1);

        const apkUrl = `${liveUrl}/AG-media.apk`;
        const r2 = await fetch(`https://ulvis.net/api.php?url=${encodeURIComponent(apkUrl)}&custom=agmediaapk`);
        const t2 = await r2.text();
        console.log('[✓] تم تحديث رابط تحميل التطبيق:', t2);

        console.log('\n✅ النظام الآن جاهز ويعمل 100%!');
        console.log('🔗 رابط الدخول المباشر: https://ulvis.net/agmedia');
        console.log('📱 رابط تحميل التطبيق: https://ulvis.net/agmediaapk\n');
      } catch (err) {
        console.error('Error updating short links:', err.message);
      }
    }
  });

  cf.on('exit', (code) => {
    console.log('[!] توقف نفق البث، كود الخروج:', code);
  });
}

startTunnel();
