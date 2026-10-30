# دليل إطلاق نظام AG-media لايف وتحويله لتطبيق أندرويد 🚀📱

---

## الجزء الأول: رفع النظام أونلاين (Live Deployment) 🌐

النظام مصمم كـ Full-Stack موحد (واجهة React + خادم Node.js / Express مع قاعدة بيانات JSON مدمجة). خادم الـ Node يقوم تلقائياً ببناء وتقديم واجهة المستخدم وتشغيل الـ API معاً على منفذ واحد.

### الخيار 1: الرفع السحابي الأسهل والمجاني (Render.com) ⭐ [موصى به للبدء الفوري]
1. أنشئ حساباً مجانياً على [Render.com](https://render.com).
2. ارفع مجلد المشروع على حسابك في GitHub (مستودع خاص Private Repository).
3. في Render، اختر **New +** ثم **Web Service**.
4. اربط مستودع المشروع واضبط الإعدادات التالية:
   - **Name:** `agmedia-crm`
   - **Environment:** `Node`
   - **Region:** Frankfurt (أقرب للشرق الأوسط ومصر)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. **مهم جداً لحفظ البيانات (Persistent Disk):**
   - اذهب إلى تبويب **Disks** في إعدادات الخدمة.
   - اضغط **Add Disk**.
   - حدد المسار: `/app/server/data` (حجم 1 GB مجاناً كافٍ لسنوات).
6. اضغط **Create Web Service**.
7. سيعطيك Render رابطاً حياً مجانياً فورياً بشهادة أمان SSL:
   `https://agmedia-crm.onrender.com`
8. **ربط دومين الوكالة الخاص (Custom Domain):**
   - يمكنك ربط دومين مثل `crm.agmedia.agency` بسهولة عبر تبويب **Settings -> Custom Domains** وإضافة CNAME في لوحة تحكم الدومين.

---

### الخيار 2: الرفع على سيرفر VPS خاص (Hostinger / Hetzner / DigitalOcean) 🖥️
إذا كان لديك سيرفر خاص يعمل بنظام Ubuntu:

1. **تثبيت Node.js و PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx git
   sudo npm install -g pm2
   ```

2. **رفع وتشغيل المشروع:**
   ```bash
   cd /var/www/agmedia-system
   npm install
   npm run build
   pm2 start server/index.js --name "agmedia-crm"
   pm2 save
   pm2 startup
   ```

3. **إعداد Nginx وربط الدومين وشهادة SSL المجانية (Certbot):**
   - توجيه الـ Reverse Proxy لمنفذ 5000:
   ```nginx
   server {
       server_name crm.agmedia.agency;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   - تفعيل SSL:
   ```bash
   sudo certbot --nginx -d crm.agmedia.agency
   ```

---

### الخيار 3: التشغيل عبر Docker 🐳
تم تضمين ملفي `Dockerfile` و `docker-compose.yml` في المشروع:
```bash
docker compose up -d --build
```

---

## الجزء الثاني: تحويل النظام إلى تطبيق أندرويد (Android App - APK) 📱

### الطريقة 1: التثبيت الفوري كتطبيق PWA (بدون متجر وبدون برمجة) ⚡
النظام مجهز بالكامل بملف `manifest.json` وشعار AG-media وألوان البراند:
1. بعد رفع الموقع لايف، افتح الرابط (مثلاً: `https://crm.agmedia.agency`) من هاتف أندرويد عبر متصفح **Google Chrome**.
2. ستظهر لك رسالة تلقائية أسفل الشاشة: **"إضافة AG-media إلى الشاشة الرئيسية"** أو افتح قائمة المتصفح (⋮) واختر **"تثبيت التطبيق" (Install App)**.
3. سيتم تثبيت التطبيق فوراً كأيقونة على الشاشة الرئيسية للهاتف:
   - يفتح في وضع **شاشة كاملة (Standalone)** بدون شريط المتصفح.
   - سريع جداً ويدعم الإشعارات والعمل في الخلفية.

---

### الطريقة 2: استخراج ملف APK رسمي عبر أداة PWABuilder (أداة مايكروسوفت/جوجل) 🎯 [الأسرع]
1. بعد رفع الموقع، افتح موقع: [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. ضع رابط موقعك الحي (مثال: `https://crm.agmedia.agency`) واضغط **Start**.
3. سيقوم بفحص الموقع وسيعطيك تقييم ممتاز PWA جاهز.
4. اضغط على زر **"Package for Android"**.
5. سيطلب منك اسم التطبيق وأيقونته (سيقرأها تلقائياً من النظام).
6. اضغط **Generate APK**:
   - سيعطيك ملف `.apk` يمكنك إرساله لفريقك وتثبيته مباشرة على هواتف الأندرويد.
   - وسيعطيك ملف `.aab` جاهز إذا رغبت برفعه على متجر Google Play.

---

### الطريقة 3: بناء تطبيق أندرويد أصلي (Native APK) عبر Capacitor 🛠️
إذا رغبت في بناء ملف APK محلياً عبر Android Studio:
1. تثبيت حزم كاباسيتور:
   ```bash
   npm install @capacitor/core @capacitor/android
   npm install -D @capacitor/cli
   ```
2. إنشاء ملف إعدادات أندرويد:
   ```bash
   npx cap add android
   npm run build
   npx cap sync
   ```
3. فتح المشروع في Android Studio:
   ```bash
   npx cap open android
   ```
4. من شريط القوائم في Android Studio، اختر:
   **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
5. ستحصل على ملف `app-debug.apk` أو `app-release.apk` جاهز للتثبيت على أي جهاز أندرويد.
