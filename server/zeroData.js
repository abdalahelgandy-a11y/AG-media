const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'ag_media_db.json');
const BACKUP_FILE = path.join(__dirname, 'data', 'ag_media_db_sample_backup.json');

if (!fs.existsSync(DB_FILE)) {
  console.error('Database file not found!');
  process.exit(1);
}

const raw = fs.readFileSync(DB_FILE, 'utf8');
const db = JSON.parse(raw);

// Create backup of demo data
fs.writeFileSync(BACKUP_FILE, raw, 'utf8');
console.log('Sample demo data backed up to:', BACKUP_FILE);

// Zero out operational data for fresh agency usage
db.clients = [];
db.deliverables = [];
db.invoices = [];
db.payments = [];
db.quotations = [];
db.proposals = [];
db.treasuryTransactions = [];

// Save clean database
fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
console.log('Database successfully zeroed out! Ready for real data input.');
console.log('Active user preserved:', db.users.map(u => ({ email: u.email, name: u.name })));
console.log('Settings preserved:', db.settings.agencyName, '-', db.settings.tagline);
