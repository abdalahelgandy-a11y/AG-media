const fs = require('fs');
const path = require('path');
const initialData = require('./seedData');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = process.env.DB_FILE || path.join(DATA_DIR, 'ag_media_db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const db = JSON.parse(raw);

    // Ensure new collections exist
    let modified = false;
    if (!db.quotations) {
      db.quotations = initialData.quotations || [];
      modified = true;
    }
    if (!db.proposals) {
      db.proposals = initialData.proposals || [];
      modified = true;
    }
    if (!db.treasuryTransactions) {
      db.treasuryTransactions = [];
      modified = true;
    }

    // Ensure users collection exists for authentication
    if (!db.users || !Array.isArray(db.users) || db.users.length === 0) {
      db.users = [
        {
          id: 'usr_admin',
          email: 'admin@agmedia.agency',
          password: 'admin',
          name: 'إدارة AG-media',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ];
      modified = true;
    }

    // Ensure clients have retainer / monthly subscription properties
    if (db.clients && Array.isArray(db.clients)) {
      db.clients.forEach(c => {
        if (!c.contractType) {
          c.contractType = 'monthly'; // Default for digital marketing agency
          modified = true;
        }
        if (c.monthlyRetainerFee === undefined) {
          c.monthlyRetainerFee = c.contractValue || 10000;
          modified = true;
        }
        if (!c.billingDay) {
          c.billingDay = 1;
          modified = true;
        }
        if (!c.subscriptionStatus) {
          c.subscriptionStatus = c.status === 'مكتمل' ? 'terminated' : 'active';
          modified = true;
        }
        if (!c.monthlyCycles) {
          c.monthlyCycles = [];
          modified = true;
        }
        if (!c.monthlyPackage) {
          c.monthlyPackage = (c.servicesAgreed || ['تصميم جرافيك', 'مونتاج فيديوهات وتصويرها']).map(s => ({
            serviceType: s,
            title: s.includes('تصميم') ? 'تصاميم وبوستات السوشيال ميديا' : s.includes('فيديو') || s.includes('مونتاج') ? 'فيديوهات ريلز ومونتاج' : s.includes('ai') ? 'فيديوهات ذكاء اصطناعي' : s.includes('اعلان') || s.includes('إعلان') ? 'إدارة وتحسين الحملات الإعلانية' : s,
            quantityTotal: s.includes('تصميم') ? 12 : s.includes('فيديو') || s.includes('مونتاج') ? 4 : s.includes('ai') ? 4 : 1,
            unit: s.includes('تصميم') ? 'تصميم' : s.includes('فيديو') || s.includes('مونتاج') || s.includes('ai') ? 'فيديو' : 'حملة'
          }));
          modified = true;
        }
      });
    }
    if (!db.settings.logoUrl || db.settings.primaryColor !== '#134C5C') {
      db.settings = { ...db.settings, ...initialData.settings };
      modified = true;
    }

    // Ensure paymentMethods has structured items with id and isActive
    if (db.settings.paymentMethods && Array.isArray(db.settings.paymentMethods)) {
      const updatedMethods = db.settings.paymentMethods.map((pm, idx) => ({
        id: pm.id || `pm_${idx + 1}`,
        name: pm.name || 'طريقة دفع',
        type: pm.type || (pm.name.includes('إنستاباي') ? 'instapay' : pm.name.includes('كاش') ? 'wallet' : pm.name.includes('بنك') ? 'bank' : pm.name.includes('نقدي') ? 'cash' : 'other'),
        details: pm.details || '',
        accountHolder: pm.accountHolder || 'وكالة AG-media',
        instructions: pm.instructions || '',
        isActive: pm.isActive !== undefined ? pm.isActive : true
      }));

      // Check if any item was missing id or isActive
      if (JSON.stringify(updatedMethods) !== JSON.stringify(db.settings.paymentMethods)) {
        db.settings.paymentMethods = updatedMethods;
        modified = true;
      }
    } else {
      db.settings.paymentMethods = (initialData.settings.paymentMethods || []).map((pm, idx) => ({
        id: `pm_${idx + 1}`,
        name: pm.name,
        type: pm.name.includes('إنستاباي') ? 'instapay' : pm.name.includes('كاش') ? 'wallet' : pm.name.includes('بنك') ? 'bank' : 'cash',
        details: pm.details,
        accountHolder: 'وكالة AG-media',
        instructions: '',
        isActive: true
      }));
      modified = true;
    }

    if (modified) {
      saveDb(db);
    }

    return db;
  } catch (err) {
    console.error('Error reading DB, restoring initial seed:', err);
    saveDb(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }
}

function saveDb(data) {
  const tempPath = DB_FILE + '.tmp';
  const jsonStr = JSON.stringify(data, null, 2);
  fs.writeFileSync(tempPath, jsonStr, 'utf8');
  fs.renameSync(tempPath, DB_FILE);

  // Auto-backup to safe secondary file
  try {
    const backupFile = path.join(DATA_DIR, 'ag_media_db_LATEST_SAFE_BACKUP.json');
    fs.writeFileSync(backupFile, jsonStr, 'utf8');
  } catch (e) {}

  // Auto-sync to MongoDB Atlas cloud in background
  try {
    const cloudDb = require('./cloudDb');
    cloudDb.syncToCloudDebounced(data);
  } catch (e) {
    // Non-blocking
  }
}

async function initCloudDatabase() {
  try {
    const cloudDb = require('./cloudDb');
    console.log('[DB] Initializing MongoDB Atlas cloud synchronization...');
    const cloudData = await cloudDb.fetchAllFromCloud();
    if (cloudData && cloudData.clients && cloudData.clients.length > 0) {
      console.log(`[DB] ☁️ Synced ${cloudData.clients.length} clients from MongoDB Atlas cloud!`);
      const current = loadDb();
      const merged = { ...current, ...cloudData };
      const jsonStr = JSON.stringify(merged, null, 2);
      fs.writeFileSync(DB_FILE, jsonStr, 'utf8');
      return merged;
    } else {
      console.log('[DB] Local database is active, syncing snapshot to cloud...');
      const current = loadDb();
      cloudDb.syncToCloudDebounced(current);
      return current;
    }
  } catch (err) {
    console.warn('[DB] Cloud sync initialization fallback to local:', err.message);
    return loadDb();
  }
}

module.exports = {
  loadDb,
  saveDb,
  initCloudDatabase,
  resetToDefault: () => {
    saveDb(initialData);
    return initialData;
  }
};
