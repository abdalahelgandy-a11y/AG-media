const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'data');
const dbFile = path.join(dbDir, 'ag_media_db.json');
const backupDir = path.join(dbDir, 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

if (fs.existsSync(dbFile)) {
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}-${String(d.getMinutes()).padStart(2, '0')}-${String(d.getSeconds()).padStart(2, '0')}`;
  const backupFile = path.join(backupDir, 'ag_media_db_backup_' + dateStr + '.json');
  const latestSafe = path.join(dbDir, 'ag_media_db_LATEST_SAFE_BACKUP.json');

  fs.copyFileSync(dbFile, backupFile);
  fs.copyFileSync(dbFile, latestSafe);

  const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  console.log('Database backup created successfully:');
  console.log('- Backup file:', backupFile);
  console.log('- Latest safe backup:', latestSafe);
  console.log('- Clients saved:', (db.clients || []).length);
  console.log('- Deliverables saved:', (db.deliverables || []).length);
} else {
  console.error('dbFile does not exist!');
}
