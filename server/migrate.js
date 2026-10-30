const { migrateLocalToCloud } = require('./cloudDb');

const uri = process.argv[2] || process.env.MONGODB_URI;

if (!uri) {
  console.log('يرجى تمرير رابط الاتصال بـ MongoDB:');
  console.log('node server/migrate.js "mongodb+srv://<username>:<password>@cluster0.mongodb.net/..."');
  process.exit(1);
}

migrateLocalToCloud(uri)
  .then(() => {
    console.log('تم نقل جميع بيانات العملاء والإعدادات إلى السيرفر السحابي بنجاح!');
    process.exit(0);
  })
  .catch(err => {
    console.error('فشل النقل:', err.message);
    process.exit(1);
  });
