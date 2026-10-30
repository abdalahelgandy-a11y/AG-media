const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Automatically load .env if present
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  try {
    if (typeof process.loadEnvFile === 'function') {
      process.loadEnvFile(envPath);
    } else {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim();
            if (!process.env[key]) process.env[key] = val;
          }
        }
      });
    }
  } catch (e) {
    console.warn('[Env] Notice loading .env:', e.message);
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abdalahelgandy_db_user:01205512323@cluster0.pn4ox09.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = process.env.MONGODB_DB_NAME || 'agmedia_crm';

let client = null;
let dbInstance = null;
let isConnected = false;
let isConnecting = false;

const COLLECTIONS = [
  'clients',
  'deliverables',
  'invoices',
  'payments',
  'quotations',
  'proposals',
  'treasuryTransactions',
  'users',
  'settings',
  'servicesCatalog',
  'acquisitionChannelsList'
];

async function connectCloudDb() {
  if (dbInstance && isConnected) return dbInstance;
  if (!MONGODB_URI) return null;
  if (isConnecting) return null;

  isConnecting = true;
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000
      });
    }
    await client.connect();
    dbInstance = client.db(DB_NAME);
    isConnected = true;
    isConnecting = false;
    console.log('[Cloud DB] ✅ Connected successfully to MongoDB Atlas ☁️');
    return dbInstance;
  } catch (err) {
    isConnecting = false;
    isConnected = false;
    console.error('[Cloud DB] ⚠️ Connection error (using local fallback):', err.message);
    return null;
  }
}

// Fetch all data from MongoDB Atlas
async function fetchAllFromCloud() {
  const db = await connectCloudDb();
  if (!db) return null;

  try {
    const cloudData = {};
    let foundDocs = false;

    for (const colName of COLLECTIONS) {
      const col = db.collection(colName);
      if (colName === 'settings') {
        const doc = await col.findOne({ _id: 'main_settings' });
        if (doc) {
          const { _id, ...rest } = doc;
          cloudData[colName] = rest;
          foundDocs = true;
        }
      } else {
        const docs = await col.find({}).toArray();
        if (docs && docs.length > 0) {
          cloudData[colName] = docs.map(d => {
            const { _id, ...rest } = d;
            return rest;
          });
          foundDocs = true;
        } else {
          cloudData[colName] = [];
        }
      }
    }

    if (!foundDocs) {
      console.log('[Cloud DB] Atlas is currently empty.');
      return null;
    }

    return cloudData;
  } catch (err) {
    console.error('[Cloud DB] Error fetching from Atlas:', err.message);
    return null;
  }
}

// Save full dataset or modified parts to MongoDB Atlas in background
let syncTimeout = null;
let pendingData = null;

function syncToCloudDebounced(fullDb) {
  pendingData = fullDb;
  if (syncTimeout) clearTimeout(syncTimeout);

  syncTimeout = setTimeout(async () => {
    if (!pendingData) return;
    const dataToSave = pendingData;
    pendingData = null;

    try {
      const db = await connectCloudDb();
      if (!db) return;

      for (const colName of COLLECTIONS) {
        const col = db.collection(colName);
        const data = dataToSave[colName];

        if (colName === 'settings') {
          if (data && typeof data === 'object') {
            await col.updateOne(
              { _id: 'main_settings' },
              { $set: { ...data, _id: 'main_settings', updatedAt: new Date().toISOString() } },
              { upsert: true }
            );
          }
        } else if (Array.isArray(data)) {
          // Replace collection documents cleanly
          await col.deleteMany({});
          if (data.length > 0) {
            const docs = data.map(item => ({ ...item, _id: item.id || undefined }));
            await col.insertMany(docs);
          }
        }
      }
      console.log(`[Cloud DB] ☁️ Successfully synchronized data to MongoDB Atlas at ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      console.error('[Cloud DB] ⚠️ Background sync to Atlas failed:', err.message);
    }
  }, 1000); // 1-second debounce to batch rapid updates
}

async function migrateLocalToCloud(targetUri) {
  const uri = targetUri || MONGODB_URI;
  if (!uri) throw new Error('MongoDB URI is required for migration');

  const c = new MongoClient(uri);
  await c.connect();
  const db = c.db(DB_NAME);

  const { loadDb } = require('./db');
  const localData = loadDb();

  console.log('Migrating local data to MongoDB Atlas...');
  for (const colName of COLLECTIONS) {
    const data = localData[colName];
    if (data) {
      const col = db.collection(colName);
      await col.deleteMany({});
      if (Array.isArray(data) && data.length > 0) {
        const docs = data.map(item => ({ ...item, _id: item.id || undefined }));
        await col.insertMany(docs);
        console.log(`[✓] Migrated ${data.length} records to '${colName}'`);
      } else if (!Array.isArray(data) && Object.keys(data).length > 0) {
        await col.insertOne({ ...data, _id: 'main_settings' });
        console.log(`[✓] Migrated '${colName}' object`);
      }
    }
  }

  await c.close();
  console.log('🎉 Migration to MongoDB Atlas completed successfully!');
  return true;
}

module.exports = {
  connectCloudDb,
  fetchAllFromCloud,
  syncToCloudDebounced,
  migrateLocalToCloud,
  getStatus: () => ({ isConnected, isConnecting, uriConfigured: !!MONGODB_URI, dbName: DB_NAME })
};
