const express = require('express');
const cors = require('cors');
const path = require('path');
const { loadDb, saveDb, resetToDefault, initCloudDatabase } = require('./db');
const cloudDb = require('./cloudDb');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve public directory for logo.png and static assets
const publicPath = path.join(__dirname, '..', 'public');
if (require('fs').existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// ----------------- AUTHENTICATION ENDPOINTS -----------------
app.post('/api/auth/login', (req, res) => {
  const db = loadDb();
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
  }

  // Ensure users collection exists in database
  if (!db.users || !db.users.length) {
    db.users = [{
      id: 'usr_admin',
      email: 'admin@agmedia.agency',
      password: 'admin',
      name: 'إدارة AG-media',
      role: 'admin',
      createdAt: new Date().toISOString()
    }];
    saveDb(db);
  }

  const users = db.users || [];
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  
  // Find matching user strictly by stored email and stored password (NO BACKDOORS / NO HARDCODED FALLBACKS)
  const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور'
    });
  }

  const token = `ag_token_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name || 'إدارة AG-media',
      role: user.role || 'admin'
    },
    message: 'تم تسجيل الدخول بنجاح'
  });
});

app.get('/api/auth/me', (req, res) => {
  const db = loadDb();
  const users = db.users || [];
  const user = users[0] || {
    id: 'usr_admin',
    email: 'admin@agmedia.agency',
    name: 'إدارة AG-media',
    role: 'admin'
  };

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

app.put('/api/auth/update-credentials', (req, res) => {
  const db = loadDb();
  if (!db.users || !db.users.length) {
    db.users = [{
      id: 'usr_admin',
      email: 'admin@agmedia.agency',
      password: 'admin',
      name: 'إدارة AG-media',
      role: 'admin'
    }];
  }

  const { email, password, name } = req.body;
  if (email) db.users[0].email = email.trim().toLowerCase();
  if (password && password.trim().length >= 3) db.users[0].password = password.trim();
  if (name) db.users[0].name = name.trim();
  db.users[0].updatedAt = new Date().toISOString();

  saveDb(db);

  res.json({
    success: true,
    user: {
      id: db.users[0].id,
      email: db.users[0].email,
      name: db.users[0].name,
      role: db.users[0].role
    },
    message: 'تم تحديث بيانات الدخول بنجاح'
  });
});

// Helper to calculate client financial stats
function getClientFinancials(clientId, db) {
  const clientInvoices = db.invoices.filter(inv => inv.clientId === clientId);
  const clientDeliverables = db.deliverables.filter(d => d.clientId === clientId);

  const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
  const totalPaid = clientInvoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  const remainingBalance = totalInvoiced - totalPaid;

  const totalDeliverablesCount = clientDeliverables.length;
  const completedDeliverablesCount = clientDeliverables.filter(d => d.status === 'تم التسليم').length;
  
  const totalUnits = clientDeliverables.reduce((sum, d) => sum + (Number(d.quantityTotal) || 0), 0);
  const completedUnits = clientDeliverables.reduce((sum, d) => sum + (Number(d.quantityCompleted) || 0), 0);
  const progressPercent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return {
    totalInvoiced,
    totalPaid,
    remainingBalance,
    totalDeliverablesCount,
    completedDeliverablesCount,
    totalUnits,
    completedUnits,
    progressPercent
  };
}

// ----------------- CLIENTS ENDPOINTS -----------------
app.get('/api/clients', (req, res) => {
  const db = loadDb();
  const clientsWithStats = db.clients.map(client => {
    const stats = getClientFinancials(client.id, db);
    return { ...client, ...stats };
  });
  res.json({ success: true, data: clientsWithStats });
});

app.get('/api/clients/:id', (req, res) => {
  const db = loadDb();
  const client = db.clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ success: false, message: 'العميل غير موجود' });
  }

  const deliverables = db.deliverables.filter(d => d.clientId === client.id);
  const invoices = db.invoices.filter(i => i.clientId === client.id);
  const payments = db.payments.filter(p => p.clientId === client.id);
  const quotations = (db.quotations || []).filter(q => q.clientId === client.id);
  const proposals = (db.proposals || []).filter(p => p.clientId === client.id);
  const stats = getClientFinancials(client.id, db);

  res.json({
    success: true,
    data: {
      ...client,
      ...stats,
      deliverables,
      invoices,
      payments,
      quotations,
      proposals
    }
  });
});

app.post('/api/clients', (req, res) => {
  const db = loadDb();
  const {
    name,
    companyName,
    phone,
    email,
    acquisitionChannel,
    startDate,
    contractValue,
    contractType = 'monthly',
    monthlyRetainerFee,
    billingDay = 1,
    status = 'نشط',
    subscriptionStatus = 'active',
    notes = '',
    servicesAgreed = [],
    monthlyPackage = []
  } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'اسم العميل مطلوب' });
  }

  const baseFee = monthlyRetainerFee !== undefined ? Number(monthlyRetainerFee) : Number(contractValue) || 0;

  const newClient = {
    id: 'cli_' + Date.now(),
    name,
    companyName: companyName || '',
    phone: phone || '',
    email: email || '',
    acquisitionChannel: acquisitionChannel || 'تواصل مباشر عبر واتساب',
    startDate: startDate || new Date().toISOString().split('T')[0],
    contractValue: baseFee,
    contractType, // 'monthly' (اشتراك شهري مستمر) or 'project' (مشروع محدد)
    monthlyRetainerFee: baseFee,
    billingDay: Number(billingDay) || 1,
    status,
    subscriptionStatus, // 'active' | 'paused' | 'terminated'
    notes,
    servicesAgreed,
    serviceQuantities: Array.isArray(req.body.serviceQuantities) && req.body.serviceQuantities.length
      ? req.body.serviceQuantities
      : (Array.isArray(monthlyPackage) && monthlyPackage.length ? monthlyPackage : servicesAgreed.map(s => ({
          serviceType: s,
          title: s.includes('تصميم') ? 'تصاميم وبوستات السوشيال ميديا' : s.includes('فيديو') || s.includes('مونتاج') ? 'فيديوهات ريلز ومونتاج' : s.includes('ai') ? 'فيديوهات ذكاء اصطناعي' : s.includes('اعلان') || s.includes('إعلان') ? 'إدارة وتحسين الحملات الإعلانية' : s,
          quantityTotal: s.includes('تصميم') ? 12 : s.includes('فيديو') || s.includes('مونتاج') ? 4 : s.includes('ai') ? 4 : 1,
          unit: s.includes('تصميم') ? 'تصميم' : s.includes('فيديو') || s.includes('مونتاج') || s.includes('ai') ? 'فيديو' : 'حملة'
        }))),
    monthlyPackage: Array.isArray(monthlyPackage) && monthlyPackage.length ? monthlyPackage : servicesAgreed.map(s => ({
      serviceType: s,
      title: s.includes('تصميم') ? 'تصاميم وبوستات السوشيال ميديا' : s.includes('فيديو') || s.includes('مونتاج') ? 'فيديوهات ريلز ومونتاج' : s.includes('ai') ? 'فيديوهات ذكاء اصطناعي' : s.includes('اعلان') || s.includes('إعلان') ? 'إدارة وتحسين الحملات الإعلانية' : s,
      quantityTotal: s.includes('تصميم') ? 12 : s.includes('فيديو') || s.includes('مونتاج') ? 4 : s.includes('ai') ? 4 : 1,
      unit: s.includes('تصميم') ? 'تصميم' : s.includes('فيديو') || s.includes('مونتاج') || s.includes('ai') ? 'فيديو' : 'حملة'
    })),
    monthlyCycles: [],
    createdAt: new Date().toISOString()
  };

  // Synchronize deliverables in db.deliverables for each service with quantityTotal
  const packageToSync = newClient.serviceQuantities || newClient.monthlyPackage || [];
  if (Array.isArray(packageToSync) && packageToSync.length > 0) {
    packageToSync.forEach(sq => {
      const qTotal = Number(sq.quantityTotal) || 1;
      const existingDel = db.deliverables.find(d => d.clientId === newClient.id && d.serviceType === sq.serviceType);
      if (existingDel) {
        existingDel.quantityTotal = qTotal;
        if (sq.unit) existingDel.unit = sq.unit;
        if (sq.title) existingDel.title = sq.title;
      } else {
        db.deliverables.unshift({
          id: 'del_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          clientId: newClient.id,
          serviceType: sq.serviceType,
          title: sq.title || (sq.serviceType.includes('تصميم') ? 'تصاميم وبوستات السوشيال ميديا' : sq.serviceType.includes('فيديو') || sq.serviceType.includes('مونتاج') ? 'فيديوهات ريلز ومونتاج' : sq.serviceType.includes('ai') ? 'فيديوهات ذكاء اصطناعي' : sq.serviceType.includes('اعلان') || sq.serviceType.includes('إعلان') ? 'إدارة وتحسين الحملات الإعلانية' : sq.serviceType),
          description: sq.notes || `مخرجات ${sq.serviceType} المتفق عليها مع العميل`,
          quantityTotal: qTotal,
          quantityCompleted: 0,
          status: 'لم يبدأ',
          unit: sq.unit || 'عنصر',
          dueDate: newClient.startDate || '',
          notes: sq.notes || '',
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  db.clients.unshift(newClient);
  saveDb(db);
  res.status(201).json({ success: true, data: newClient });
});

app.put('/api/clients/:id', (req, res) => {
  const db = loadDb();
  const index = db.clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'العميل غير موجود' });
  }

  const existing = db.clients[index];
  const monthlyRetainerFee = req.body.monthlyRetainerFee !== undefined 
    ? Number(req.body.monthlyRetainerFee) 
    : (req.body.contractValue !== undefined ? Number(req.body.contractValue) : existing.monthlyRetainerFee);

  db.clients[index] = {
    ...existing,
    ...req.body,
    contractValue: req.body.contractValue !== undefined ? Number(req.body.contractValue) : existing.contractValue,
    monthlyRetainerFee,
    billingDay: req.body.billingDay !== undefined ? Number(req.body.billingDay) : (existing.billingDay || 1),
    updatedAt: new Date().toISOString()
  };

  // Synchronize deliverables in db.deliverables if serviceQuantities or monthlyPackage provided
  const packageToSync = Array.isArray(req.body.serviceQuantities) && req.body.serviceQuantities.length
    ? req.body.serviceQuantities
    : (Array.isArray(req.body.monthlyPackage) ? req.body.monthlyPackage : []);

  if (packageToSync.length > 0) {
    packageToSync.forEach(sq => {
      const qTotal = Number(sq.quantityTotal) || 1;
      const existingDel = db.deliverables.find(d => d.clientId === req.params.id && d.serviceType === sq.serviceType);
      if (existingDel) {
        existingDel.quantityTotal = qTotal;
        if (sq.unit) existingDel.unit = sq.unit;
        if (sq.title) existingDel.title = sq.title;
        if (existingDel.quantityCompleted >= qTotal && qTotal > 0) {
          existingDel.status = 'تم التسليم';
        }
      } else {
        db.deliverables.unshift({
          id: 'del_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          clientId: req.params.id,
          serviceType: sq.serviceType,
          title: sq.title || (sq.serviceType.includes('تصميم') ? 'تصاميم وبوستات السوشيال ميديا' : sq.serviceType.includes('فيديو') || sq.serviceType.includes('مونتاج') ? 'فيديوهات ريلز ومونتاج' : sq.serviceType.includes('ai') ? 'فيديوهات ذكاء اصطناعي' : sq.serviceType.includes('اعلان') || sq.serviceType.includes('إعلان') ? 'إدارة وتحسين الحملات الإعلانية' : sq.serviceType),
          description: sq.notes || `مخرجات ${sq.serviceType} المتفق عليها مع العميل`,
          quantityTotal: qTotal,
          quantityCompleted: 0,
          status: 'لم يبدأ',
          unit: sq.unit || 'عنصر',
          dueDate: db.clients[index].startDate || '',
          notes: sq.notes || '',
          createdAt: new Date().toISOString()
        });
      }
    });
  }

  // If services were deselected/cancelled, remove any unstarted deliverables for those services
  if (Array.isArray(req.body.servicesAgreed)) {
    const agreedSet = new Set(req.body.servicesAgreed);
    db.deliverables = db.deliverables.filter(d => {
      if (d.clientId !== req.params.id) return true;
      if (agreedSet.has(d.serviceType)) return true;
      return (Number(d.quantityCompleted) || 0) > 0;
    });
  }

  saveDb(db);
  res.json({ success: true, data: db.clients[index] });
});

// ----------------- MONTHLY RETAINER & RENEWAL ENDPOINTS -----------------
app.post('/api/clients/:id/renew', (req, res) => {
  const db = loadDb();
  const index = db.clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'العميل غير موجود' });
  }

  const client = db.clients[index];
  const {
    monthLabel = 'دورة شهرية جديدة',
    newContractValue = client.monthlyRetainerFee || client.contractValue || 0,
    newStartDate = new Date().toISOString().split('T')[0],
    dueDate = '',
    notes = '',
    // Deliverables for this month (flexible tasks mix without changing base fee)
    deliverables = [],
    // Extra out-of-scope work for this month (with extra pricing)
    extraDeliverables = [],
    autoCreateInvoice = true
  } = req.body;

  const baseFee = Number(newContractValue) || 0;
  const extraTotal = (extraDeliverables || []).reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantityTotal) || 1)), 0);
  const totalMonthFee = baseFee + extraTotal;

  // 1. Create monthly invoice if requested
  let generatedInvoice = null;
  if (autoCreateInvoice && totalMonthFee > 0) {
    const invNumber = `AG-INV-${Date.now().toString().slice(-4)}`;
    const invoiceItems = [];

    // Base retainer item
    if (baseFee > 0) {
      invoiceItems.push({
        service: 'اشتراك شهري متفق عليه',
        description: `اشتراك ${monthLabel} - باقة التسويق والميديا والإنتاج المتفق عليها`,
        quantity: 1,
        unitPrice: baseFee,
        total: baseFee
      });
    }

    // Extra deliverables items
    (extraDeliverables || []).forEach(extra => {
      const q = Number(extra.quantityTotal) || 1;
      const p = Number(extra.price) || 0;
      invoiceItems.push({
        service: extra.serviceType || 'خدمة إضافية',
        description: `[عمل إضافي استثنائي لشهر ${monthLabel}]: ${extra.title || 'بند إضافي'}`,
        quantity: q,
        unitPrice: p,
        total: q * p
      });
    });

    generatedInvoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      clientId: client.id,
      invoiceNumber: invNumber,
      date: newStartDate,
      dueDate: dueDate || newStartDate,
      items: invoiceItems,
      discount: 0,
      tax: 0,
      paidAdsNetBudget: 0,
      paidAdsTax: 0,
      paidAdsCommission: 0,
      paidAdsTotal: 0,
      subtotal: totalMonthFee,
      total: totalMonthFee,
      paidAmount: 0,
      status: 'معلقة',
      notes: `فاتورة ${monthLabel} للعميل ${client.name}. ${notes || ''}`,
      cycleMonth: monthLabel,
      createdAt: new Date().toISOString()
    };

    if (!db.invoices) db.invoices = [];
    db.invoices.unshift(generatedInvoice);
  }

  // 2. Insert standard deliverables for this month (customizable tasks mix)
  const createdDeliverables = [];
  if (Array.isArray(deliverables) && deliverables.length) {
    deliverables.forEach(d => {
      const del = {
        id: 'del_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        clientId: client.id,
        serviceType: d.serviceType || 'تصميم جرافيك',
        title: d.title || 'مهمة دورية جديدة',
        description: d.description || `ضمن باقة ${monthLabel}`,
        quantityTotal: Number(d.quantityTotal) || 1,
        quantityCompleted: 0,
        status: 'لم يبدأ',
        unit: d.unit || 'عنصر',
        dueDate: d.dueDate || dueDate || '',
        notes: d.notes || '',
        cycleMonth: monthLabel,
        createdAt: new Date().toISOString()
      };
      db.deliverables.unshift(del);
      createdDeliverables.push(del);
    });
  }

  // 3. Insert extra deliverables for this month
  if (Array.isArray(extraDeliverables) && extraDeliverables.length) {
    extraDeliverables.forEach(ed => {
      const del = {
        id: 'del_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        clientId: client.id,
        serviceType: ed.serviceType || 'عمل إضافي',
        title: `[إضافي] ${ed.title}`,
        description: `عمل إضافي استثنائي لشهر ${monthLabel} بقيمة ${(Number(ed.price) || 0).toLocaleString()} ج.م`,
        quantityTotal: Number(ed.quantityTotal) || 1,
        quantityCompleted: 0,
        status: 'لم يبدأ',
        unit: ed.unit || 'عنصر',
        dueDate: ed.dueDate || dueDate || '',
        notes: ed.notes || '',
        isExtraWork: true,
        extraPrice: Number(ed.price) || 0,
        cycleMonth: monthLabel,
        createdAt: new Date().toISOString()
      };
      db.deliverables.unshift(del);
      createdDeliverables.push(del);
    });
  }

  // 4. Record Cycle in Client History
  const monthlyCycles = client.monthlyCycles || [];
  monthlyCycles.unshift({
    cycleId: `cyc_${Date.now()}`,
    monthLabel,
    startDate: newStartDate,
    dueDate: dueDate || newStartDate,
    baseFee,
    extraFee: extraTotal,
    totalFee: totalMonthFee,
    extraItems: extraDeliverables,
    deliverablesCount: createdDeliverables.length,
    invoiceId: generatedInvoice ? generatedInvoice.id : null,
    isPaid: false,
    notes,
    createdAt: new Date().toISOString()
  });

  const renewalHistory = client.renewalHistory || [];
  renewalHistory.push({
    renewedAt: new Date().toISOString(),
    monthLabel,
    baseFee,
    extraTotal,
    totalMonthFee,
    previousContractValue: client.contractValue,
    previousStartDate: client.startDate,
    notes
  });

  db.clients[index] = {
    ...client,
    status: 'نشط',
    subscriptionStatus: 'active',
    contractValue: totalMonthFee,
    monthlyRetainerFee: baseFee,
    startDate: newStartDate,
    currentCycle: monthLabel,
    notes: notes ? `${notes}\n---\nدورة ${monthLabel} بتاريخ: ${newStartDate}` : client.notes,
    renewalCount: (client.renewalCount || 0) + 1,
    renewalHistory,
    monthlyCycles,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  res.json({
    success: true,
    data: db.clients[index],
    invoice: generatedInvoice,
    deliverables: createdDeliverables,
    message: `تم تجديد دورة ${monthLabel} وإصدار الفاتورة والمخرجات بنجاح!`
  });
});

app.put('/api/clients/:id/subscription-status', (req, res) => {
  const db = loadDb();
  const index = db.clients.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'العميل غير موجود' });
  }

  const { subscriptionStatus, reason = '' } = req.body;
  // 'active' | 'paused' | 'terminated'
  const client = db.clients[index];
  let clientStatus = 'نشط';
  if (subscriptionStatus === 'paused') clientStatus = 'معلق';
  if (subscriptionStatus === 'terminated') clientStatus = 'مكتمل';

  const statusHistory = client.subscriptionStatusHistory || [];
  statusHistory.push({
    status: subscriptionStatus,
    changedAt: new Date().toISOString(),
    reason
  });

  db.clients[index] = {
    ...client,
    subscriptionStatus,
    status: clientStatus,
    subscriptionStatusHistory: statusHistory,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  res.json({
    success: true,
    data: db.clients[index],
    message: `تم تغيير حالة الاشتراك إلى "${subscriptionStatus === 'active' ? 'نشط ومستمر' : subscriptionStatus === 'paused' ? 'متوقف مؤقتاً' : 'تم إنهاء التعاقد'}" بنجاح`
  });
});

app.post('/api/clients/:id/monthly-cycle/pay', (req, res) => {
  const db = loadDb();
  const clientIndex = db.clients.findIndex(c => c.id === req.params.id);
  if (clientIndex === -1) {
    return res.status(404).json({ success: false, message: 'العميل غير موجود' });
  }

  const client = db.clients[clientIndex];
  const { invoiceId, paymentMethod = 'إنستاباي (InstaPay)', date = new Date().toISOString().split('T')[0], notes = '' } = req.body;

  let invoice = null;
  let invIndex = -1;

  if (invoiceId) {
    invIndex = db.invoices.findIndex(i => i.id === invoiceId);
    if (invIndex !== -1) invoice = db.invoices[invIndex];
  }

  if (!invoice) {
    // Find latest unpaid invoice for this client
    invIndex = db.invoices.findIndex(i => i.clientId === client.id && i.status !== 'مدفوعة بالكامل');
    if (invIndex !== -1) invoice = db.invoices[invIndex];
  }

  if (!invoice) {
    return res.status(404).json({ success: false, message: 'لم يتم العثور على فاتورة مستحقة للعميل' });
  }

  const remaining = Math.max(0, (Number(invoice.total) || 0) - (Number(invoice.paidAmount) || 0));

  if (remaining <= 0) {
    return res.json({ success: true, message: 'الفاتورة مسددة بالكامل بالفعل!', invoice });
  }

  // Record payment in payments
  const newPayment = {
    id: `pay_${Date.now()}`,
    invoiceId: invoice.id,
    clientId: client.id,
    amount: remaining,
    paymentMethod,
    date,
    notes: notes || `سداد اشتراك شهري - فاتورة #${invoice.invoiceNumber}`,
    createdAt: new Date().toISOString()
  };

  if (!db.payments) db.payments = [];
  db.payments.unshift(newPayment);

  // Update invoice
  db.invoices[invIndex] = {
    ...invoice,
    paidAmount: Number(invoice.total) || 0,
    status: 'مدفوعة بالكامل',
    paymentMethod,
    paidAt: new Date().toISOString()
  };

  // Update client cycles
  if (client.monthlyCycles) {
    client.monthlyCycles = client.monthlyCycles.map(c => {
      if (c.invoiceId === invoice.id || !c.isPaid) {
        return { ...c, isPaid: true, paidAt: new Date().toISOString(), paymentMethod };
      }
      return c;
    });
  }

  saveDb(db);

  // Generate WhatsApp Receipt text
  const whatsappReceipt = `مرحباً ${client.name} 🌹\n` +
    `تم بحمد الله استلام وتسوية دفعة اشتراككم الشهري مع وكالة *AG-media* بنجاح ✅\n\n` +
    `📄 *تفاصيل الإيصال:*\n` +
    `- الفاتورة: #${invoice.invoiceNumber}\n` +
    `- البيان: ${invoice.cycleMonth || 'اشتراك شهري'}\n` +
    `- المبلغ المسدد: ${remaining.toLocaleString()} ج.م\n` +
    `- طريقة الدفع: ${paymentMethod}\n` +
    `- التاريخ: ${date}\n` +
    `- حالة الحساب: *مسدد بالكامل (0 ج.م متبقي)* ✓\n\n` +
    `شكراً لثقتكم المستمرة في AG-media ("we create your thinking")! 🚀`;

  res.json({
    success: true,
    data: {
      client: db.clients[clientIndex],
      invoice: db.invoices[invIndex],
      payment: newPayment,
      whatsappReceipt
    },
    message: 'تم تسجيل استلام الدفعة الشهرية بنجاح!'
  });
});

app.delete('/api/clients/:id', (req, res) => {
  const db = loadDb();
  const clientId = req.params.id;
  
  db.clients = db.clients.filter(c => c.id !== clientId);
  db.deliverables = db.deliverables.filter(d => d.clientId !== clientId);
  db.invoices = db.invoices.filter(i => i.clientId !== clientId);
  db.payments = db.payments.filter(p => p.clientId !== clientId);
  if (db.quotations) db.quotations = db.quotations.filter(q => q.clientId !== clientId);
  if (db.proposals) db.proposals = db.proposals.filter(p => p.clientId !== clientId);

  saveDb(db);
  res.json({ success: true, message: 'تم حذف العميل وكافة سجلاته المرتبطة بنجاح' });
});

// ----------------- DELIVERABLES / TASKS ENDPOINTS -----------------
app.get('/api/deliverables', (req, res) => {
  const db = loadDb();
  const { clientId, serviceType, status } = req.query;

  let list = db.deliverables;
  if (clientId) list = list.filter(d => d.clientId === clientId);
  if (serviceType) list = list.filter(d => d.serviceType === serviceType);
  if (status) list = list.filter(d => d.status === status);

  const enriched = list.map(d => {
    const client = db.clients.find(c => c.id === d.clientId);
    return {
      ...d,
      clientName: client ? client.name : 'عميل غير معروف',
      companyName: client ? client.companyName : ''
    };
  });

  res.json({ success: true, data: enriched });
});

app.post('/api/deliverables', (req, res) => {
  const db = loadDb();
  const {
    clientId,
    serviceType,
    title,
    description = '',
    quantityTotal = 1,
    quantityCompleted = 0,
    status = 'لم يبدأ',
    unit = 'عنصر',
    dueDate = '',
    notes = ''
  } = req.body;

  if (!clientId || !serviceType || !title) {
    return res.status(400).json({ success: false, message: 'بيانات المخرج/المهمة غير مكتملة' });
  }

  const newDeliverable = {
    id: 'del_' + Date.now(),
    clientId,
    serviceType,
    title,
    description,
    quantityTotal: Math.max(1, Number(quantityTotal) || 1),
    quantityCompleted: Math.max(0, Number(quantityCompleted) || 0),
    status,
    unit,
    dueDate,
    notes,
    createdAt: new Date().toISOString()
  };

  db.deliverables.unshift(newDeliverable);
  saveDb(db);
  res.status(201).json({ success: true, data: newDeliverable });
});

app.put('/api/deliverables/:id', (req, res) => {
  const db = loadDb();
  const index = db.deliverables.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'المهمة غير موجودة' });
  }

  const existing = db.deliverables[index];
  const qTotal = req.body.quantityTotal !== undefined ? Math.max(1, Number(req.body.quantityTotal)) : existing.quantityTotal;
  let qCompleted = req.body.quantityCompleted !== undefined ? Math.max(0, Number(req.body.quantityCompleted)) : existing.quantityCompleted;
  if (qCompleted > qTotal) qCompleted = qTotal;

  let newStatus = req.body.status || existing.status;
  if (req.body.quantityCompleted !== undefined && !req.body.status) {
    if (qCompleted === qTotal) newStatus = 'تم التسليم';
    else if (qCompleted > 0) newStatus = 'قيد التنفيذ';
  }

  db.deliverables[index] = {
    ...existing,
    ...req.body,
    quantityTotal: qTotal,
    quantityCompleted: qCompleted,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  res.json({ success: true, data: db.deliverables[index] });
});

app.delete('/api/deliverables/:id', (req, res) => {
  const db = loadDb();
  db.deliverables = db.deliverables.filter(d => d.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'تم حذف المخرج بنجاح' });
});

// ----------------- INVOICES ENDPOINTS -----------------
function computeInvoiceStatus(total, paidAmount) {
  if (paidAmount >= total && total > 0) return 'مدفوعة';
  if (paidAmount > 0 && paidAmount < total) return 'جزئي';
  return 'غير مدفوعة';
}

app.get('/api/invoices', (req, res) => {
  const db = loadDb();
  const invoicesWithClient = db.invoices.map(inv => {
    const client = db.clients.find(c => c.id === inv.clientId);
    return {
      ...inv,
      clientName: client ? client.name : 'عميل غير محدد',
      companyName: client ? client.companyName : '',
      clientPhone: client ? client.phone : ''
    };
  });
  res.json({ success: true, data: invoicesWithClient });
});

app.post('/api/invoices', (req, res) => {
  const db = loadDb();
  const {
    clientId,
    invoiceNumber,
    date,
    dueDate,
    items = [],
    discount = 0,
    tax = 0,
    notes = ''
  } = req.body;

  if (!clientId || !items.length) {
    return res.status(400).json({ success: false, message: 'يرجى تحديد العميل وبنود الفاتورة' });
  }

  const subtotal = items.reduce((sum, item) => sum + ((Number(item.quantity) || 1) * (Number(item.unitPrice) || 0)), 0);
  const total = Math.max(0, subtotal - (Number(discount) || 0) + (Number(tax) || 0));
  const invNumber = invoiceNumber || `AG-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(3, '0')}`;

  const newInvoice = {
    id: 'inv_' + Date.now(),
    invoiceNumber: invNumber,
    clientId,
    date: date || new Date().toISOString().split('T')[0],
    dueDate: dueDate || '',
    items: items.map((it, idx) => ({
      id: it.id || `item_${idx + 1}`,
      service: it.service || 'خدمة ميديا وتسويق',
      description: it.description || '',
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unitPrice) || 0,
      total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0)
    })),
    subtotal,
    discount: Number(discount) || 0,
    tax: Number(tax) || 0,
    total,
    paidAmount: 0,
    status: 'غير مدفوعة',
    notes,
    createdAt: new Date().toISOString()
  };

  db.invoices.unshift(newInvoice);
  saveDb(db);
  res.status(201).json({ success: true, data: newInvoice });
});

app.put('/api/invoices/:id', (req, res) => {
  const db = loadDb();
  const index = db.invoices.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'الفاتورة غير موجودة' });
  }

  const existing = db.invoices[index];
  const items = req.body.items || existing.items;
  const subtotal = items.reduce((sum, item) => sum + ((Number(item.quantity) || 1) * (Number(item.unitPrice) || 0)), 0);
  const discount = req.body.discount !== undefined ? Number(req.body.discount) : existing.discount;
  const tax = req.body.tax !== undefined ? Number(req.body.tax) : existing.tax;
  const total = Math.max(0, subtotal - discount + tax);
  const paidAmount = req.body.paidAmount !== undefined ? Number(req.body.paidAmount) : existing.paidAmount;
  const status = req.body.status || computeInvoiceStatus(total, paidAmount);

  db.invoices[index] = {
    ...existing,
    ...req.body,
    items,
    subtotal,
    discount,
    tax,
    total,
    paidAmount,
    status,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  res.json({ success: true, data: db.invoices[index] });
});

app.delete('/api/invoices/:id', (req, res) => {
  const db = loadDb();
  db.invoices = db.invoices.filter(i => i.id !== req.params.id);
  db.payments = db.payments.filter(p => p.invoiceId !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'تم حذف الفاتورة بنجاح' });
});

// ----------------- QUOTATIONS ENDPOINTS (عروض الأسعار) -----------------
app.get('/api/quotations', (req, res) => {
  const db = loadDb();
  const quotations = (db.quotations || []).map(q => {
    const client = db.clients.find(c => c.id === q.clientId);
    return {
      ...q,
      clientName: client ? client.name : q.clientName || 'عميل محتمل',
      companyName: client ? client.companyName : q.companyName || '',
      clientPhone: client ? client.phone : ''
    };
  });
  res.json({ success: true, data: quotations });
});

app.post('/api/quotations', (req, res) => {
  const db = loadDb();
  if (!db.quotations) db.quotations = [];

  const {
    clientId,
    clientName,
    companyName,
    quotationNumber,
    date,
    validUntil,
    projectDuration,
    items = [],
    discount = 0,
    paymentTerms = '',
    notes = '',
    status = 'تم الإرسال'
  } = req.body;

  const subtotal = items.reduce((sum, item) => sum + ((Number(item.quantity) || 1) * (Number(item.unitPrice) || 0)), 0);
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  const client = clientId ? db.clients.find(c => c.id === clientId) : null;
  const qNumber = quotationNumber || `QT-${new Date().getFullYear()}-${String(db.quotations.length + 1).padStart(3, '0')}`;

  const newQuotation = {
    id: 'qt_' + Date.now(),
    quotationNumber: qNumber,
    clientId: clientId || '',
    clientName: client ? client.name : clientName || 'عميل محتمل',
    companyName: client ? client.companyName : companyName || '',
    date: date || new Date().toISOString().split('T')[0],
    validUntil: validUntil || '',
    projectDuration: projectDuration || '15 يوم عمل',
    status,
    items: items.map((it, idx) => ({
      id: it.id || `qti_${idx + 1}`,
      service: it.service || 'خدمة إنتاج وتسويق',
      description: it.description || '',
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unitPrice) || 0,
      total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0)
    })),
    subtotal,
    discount: Number(discount) || 0,
    total,
    paymentTerms,
    notes,
    createdAt: new Date().toISOString()
  };

  db.quotations.unshift(newQuotation);
  saveDb(db);
  res.status(201).json({ success: true, data: newQuotation });
});

app.put('/api/quotations/:id', (req, res) => {
  const db = loadDb();
  if (!db.quotations) db.quotations = [];
  const index = db.quotations.findIndex(q => q.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'عرض السعر غير موجود' });
  }

  const existing = db.quotations[index];
  const items = req.body.items || existing.items;
  const subtotal = items.reduce((sum, item) => sum + ((Number(item.quantity) || 1) * (Number(item.unitPrice) || 0)), 0);
  const discount = req.body.discount !== undefined ? Number(req.body.discount) : existing.discount;
  const total = Math.max(0, subtotal - discount);

  db.quotations[index] = {
    ...existing,
    ...req.body,
    items,
    subtotal,
    discount,
    total,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  res.json({ success: true, data: db.quotations[index] });
});

app.delete('/api/quotations/:id', (req, res) => {
  const db = loadDb();
  if (!db.quotations) db.quotations = [];
  db.quotations = db.quotations.filter(q => q.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'تم حذف عرض السعر بنجاح' });
});

// Convert quotation to Invoice
app.post('/api/quotations/:id/convert-to-invoice', (req, res) => {
  const db = loadDb();
  if (!db.quotations) db.quotations = [];
  const q = db.quotations.find(item => item.id === req.params.id);
  if (!q) {
    return res.status(404).json({ success: false, message: 'عرض السعر غير موجود' });
  }

  q.status = 'مقبول';

  const newInvoice = {
    id: 'inv_' + Date.now(),
    invoiceNumber: `AG-${new Date().getFullYear()}-${String(db.invoices.length + 1).padStart(3, '0')}`,
    clientId: q.clientId,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: JSON.parse(JSON.stringify(q.items)),
    subtotal: q.subtotal,
    discount: q.discount,
    tax: 0,
    total: q.total,
    paidAmount: 0,
    status: 'غير مدفوعة',
    notes: `تم إصدار الفاتورة بناءً على عرض السعر المقبول رقم: ${q.quotationNumber}`,
    createdAt: new Date().toISOString()
  };

  db.invoices.unshift(newInvoice);
  saveDb(db);
  res.json({ success: true, data: newInvoice, message: 'تم تحويل عرض السعر إلى فاتورة رسمية بنجاح' });
});

// ----------------- PROPOSALS / PITCH DECKS ENDPOINTS (العروض التقديمية) -----------------
app.get('/api/proposals', (req, res) => {
  const db = loadDb();
  const proposals = (db.proposals || []).map(p => {
    const client = db.clients.find(c => c.id === p.clientId);
    return {
      ...p,
      clientName: client ? client.name : p.clientName || 'العميل',
      companyName: client ? client.companyName : p.companyName || ''
    };
  });
  res.json({ success: true, data: proposals });
});

app.post('/api/proposals', (req, res) => {
  const db = loadDb();
  if (!db.proposals) db.proposals = [];

  const {
    clientId,
    clientName,
    companyName,
    title,
    subtitle,
    date,
    primaryService,
    budget,
    timeline,
    objective,
    creativeConcept,
    deliverablesList = [],
    executionPhases = [],
    whyUsPoints = []
  } = req.body;

  const client = clientId ? db.clients.find(c => c.id === clientId) : null;
  const pNumber = `PRP-${new Date().getFullYear()}-${String(db.proposals.length + 1).padStart(3, '0')}`;

  const newProposal = {
    id: 'prop_' + Date.now(),
    proposalNumber: pNumber,
    clientId: clientId || '',
    clientName: client ? client.name : clientName || 'العميل المستهدف',
    companyName: client ? client.companyName : companyName || '',
    title: title || 'العرض التقديمي للإنتاج والتسويق الإبداعي',
    subtitle: subtitle || 'استراتيجية عمل متكاملة - AG-media',
    date: date || new Date().toISOString().split('T')[0],
    primaryService: primaryService || 'إنتاج ميديا وتسويق شامل',
    budget: Number(budget) || 0,
    timeline: timeline || '3-4 أسابيع',
    objective: objective || '',
    creativeConcept: creativeConcept || '',
    deliverablesList: deliverablesList.length ? deliverablesList : [
      'تصميمات جرافيك إبداعية للسوشيال ميديا',
      'فيديوهات ريلز وتيك توك بجودة سينمائية',
      'فيديو موشن جرافيك توضيحي مع فويس أوفر',
      'إدارة حملات إعلانية ممولة للوصول والمبيعات'
    ],
    executionPhases: executionPhases.length ? executionPhases : [
      { phase: 'المرحلة 1: البحث والاسكريبت', duration: 'الأسبوع 1', details: 'تحليل البراند وصياغة الاسكريبتات والرسائل الإعلانية' },
      { phase: 'المرحلة 2: التصوير والإنتاج', duration: 'الأسبوع 2', details: 'جلسات التصوير وتوليد عناصر AI ورسوم الموشن' },
      { phase: 'المرحلة 3: المونتاج والتصميم', duration: 'الأسبوع 3', details: 'مونتاج سينمائي مع هندسة صوتية وتصميم البوستات' },
      { phase: 'المرحلة 4: المراجعة والإطلاق', duration: 'الأسبوع 4', details: 'اعتماد العميل النهائي وإطلاق الحملات الممولة ومتابعة الأداء' }
    ],
    whyUsPoints: whyUsPoints.length ? whyUsPoints : [
      'جودة إنتاج سينمائية 4K واستخدام تقنيات الذكاء الاصطناعي المبتكرة',
      'فريق متكامل يجمع بين الإبداع الفني والأرقام والتسويق الموجه',
      'التزام صارم بمواعيد التسليم ودقة التنفيذ',
      'شعارنا: we create your thinking - شريك نجاحك الحقيقي'
    ],
    createdAt: new Date().toISOString()
  };

  db.proposals.unshift(newProposal);
  saveDb(db);
  res.status(201).json({ success: true, data: newProposal });
});

app.put('/api/proposals/:id', (req, res) => {
  const db = loadDb();
  if (!db.proposals) db.proposals = [];
  const index = db.proposals.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'العرض التقديمي غير موجود' });
  }

  db.proposals[index] = {
    ...db.proposals[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  res.json({ success: true, data: db.proposals[index] });
});

app.delete('/api/proposals/:id', (req, res) => {
  const db = loadDb();
  if (!db.proposals) db.proposals = [];
  db.proposals = db.proposals.filter(p => p.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'تم حذف العرض التقديمي بنجاح' });
});

// ----------------- PAYMENTS ENDPOINTS -----------------
app.get('/api/payments', (req, res) => {
  const db = loadDb();
  const enrichedPayments = db.payments.map(pay => {
    const client = db.clients.find(c => c.id === pay.clientId);
    const invoice = db.invoices.find(i => i.id === pay.invoiceId);
    return {
      ...pay,
      clientName: client ? client.name : 'عميل غير محدد',
      companyName: client ? client.companyName : '',
      invoiceNumber: invoice ? invoice.invoiceNumber : 'بدون فاتورة'
    };
  });
  res.json({ success: true, data: enrichedPayments });
});

app.post('/api/payments', (req, res) => {
  const db = loadDb();
  const {
    invoiceId,
    clientId,
    amount,
    paymentDate,
    method,
    referenceNumber = '',
    notes = ''
  } = req.body;

  const payAmount = Number(amount);
  if (!clientId || !payAmount || payAmount <= 0) {
    return res.status(400).json({ success: false, message: 'المبلغ والعميل مطلوبان' });
  }

  const newPayment = {
    id: 'pay_' + Date.now(),
    invoiceId: invoiceId || '',
    clientId,
    amount: payAmount,
    paymentDate: paymentDate || new Date().toISOString().split('T')[0],
    method: method || 'إنستاباي (InstaPay)',
    referenceNumber,
    notes,
    createdAt: new Date().toISOString()
  };

  db.payments.unshift(newPayment);

  if (invoiceId) {
    const invIndex = db.invoices.findIndex(i => i.id === invoiceId);
    if (invIndex !== -1) {
      const inv = db.invoices[invIndex];
      const newPaid = (Number(inv.paidAmount) || 0) + payAmount;
      inv.paidAmount = newPaid;
      inv.status = computeInvoiceStatus(inv.total, newPaid);
    }
  }

  saveDb(db);
  res.status(201).json({ success: true, data: newPayment });
});

app.delete('/api/payments/:id', (req, res) => {
  const db = loadDb();
  const pay = db.payments.find(p => p.id === req.params.id);
  if (!pay) {
    return res.status(404).json({ success: false, message: 'الدفعة غير موجودة' });
  }

  if (pay.invoiceId) {
    const invIndex = db.invoices.findIndex(i => i.id === pay.invoiceId);
    if (invIndex !== -1) {
      const inv = db.invoices[invIndex];
      const newPaid = Math.max(0, (Number(inv.paidAmount) || 0) - Number(pay.amount));
      inv.paidAmount = newPaid;
      inv.status = computeInvoiceStatus(inv.total, newPaid);
    }
  }

  db.payments = db.payments.filter(p => p.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'تم حذف الدفعة وتحديث رصيد الفاتورة بنجاح' });
});

// ----------------- FINANCIAL AUDITOR / SUMMARY ENDPOINT -----------------
app.get('/api/financial-summary', (req, res) => {
  const db = loadDb();

  const totalContracted = db.clients.reduce((sum, c) => sum + (Number(c.contractValue) || 0), 0);
  const totalInvoiced = db.invoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const totalCollected = db.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const outstandingReceivables = Math.max(0, totalInvoiced - totalCollected);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const channelBreakdown = {};
  db.clients.forEach(c => {
    const ch = c.acquisitionChannel || 'أخرى';
    if (!channelBreakdown[ch]) {
      channelBreakdown[ch] = { channel: ch, count: 0, contractTotal: 0, invoicedTotal: 0, collectedTotal: 0 };
    }
    channelBreakdown[ch].count += 1;
    channelBreakdown[ch].contractTotal += (Number(c.contractValue) || 0);

    const clientInvoices = db.invoices.filter(i => i.clientId === c.id);
    const clientPayments = db.payments.filter(p => p.clientId === c.id);
    channelBreakdown[ch].invoicedTotal += clientInvoices.reduce((s, i) => s + (Number(i.total) || 0), 0);
    channelBreakdown[ch].collectedTotal += clientPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  });

  const serviceBreakdown = {};
  db.servicesCatalog.forEach(srv => {
    serviceBreakdown[srv.name] = {
      service: srv.name,
      category: srv.category,
      deliverablesCount: 0,
      completedCount: 0,
      totalUnits: 0,
      completedUnits: 0,
      revenueEstimated: 0
    };
  });

  db.deliverables.forEach(d => {
    if (!serviceBreakdown[d.serviceType]) {
      serviceBreakdown[d.serviceType] = {
        service: d.serviceType,
        deliverablesCount: 0,
        completedCount: 0,
        totalUnits: 0,
        completedUnits: 0,
        revenueEstimated: 0
      };
    }
    const item = serviceBreakdown[d.serviceType];
    item.deliverablesCount += 1;
    if (d.status === 'تم التسليم') item.completedCount += 1;
    item.totalUnits += (Number(d.quantityTotal) || 0);
    item.completedUnits += (Number(d.quantityCompleted) || 0);
  });

  db.invoices.forEach(inv => {
    inv.items.forEach(it => {
      if (serviceBreakdown[it.service]) {
        serviceBreakdown[it.service].revenueEstimated += (Number(it.total) || 0);
      }
    });
  });

  const totalDeliverables = db.deliverables.length;
  const completedDeliverables = db.deliverables.filter(d => d.status === 'تم التسليم').length;

  const totalWithdrawals = (db.treasuryTransactions || []).reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const treasuryBalance = Math.max(0, totalCollected - totalWithdrawals);

  res.json({
    success: true,
    data: {
      metrics: {
        totalClients: db.clients.length,
        activeClients: db.clients.filter(c => c.status === 'نشط').length,
        totalContracted,
        totalInvoiced,
        totalCollected,
        totalWithdrawals,
        treasuryBalance,
        outstandingReceivables,
        collectionRate,
        totalDeliverables,
        completedDeliverables,
        totalQuotations: (db.quotations || []).length,
        totalProposals: (db.proposals || []).length
      },
      treasuryTransactions: db.treasuryTransactions || [],
      channelBreakdown: Object.values(channelBreakdown),
      serviceBreakdown: Object.values(serviceBreakdown)
    }
  });
});

// ----------------- TREASURY & WITHDRAWALS / EXPENSES -----------------
app.get('/api/treasury', (req, res) => {
  const db = loadDb();
  const transactions = db.treasuryTransactions || [];
  const totalCollected = db.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalWithdrawals = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const treasuryBalance = Math.max(0, totalCollected - totalWithdrawals);

  res.json({
    success: true,
    data: {
      transactions,
      totalCollected,
      totalWithdrawals,
      treasuryBalance
    }
  });
});

app.post('/api/treasury', (req, res) => {
  const db = loadDb();
  if (!db.treasuryTransactions) {
    db.treasuryTransactions = [];
  }

  const {
    type = 'سحب أرباح',
    amount,
    date = new Date().toISOString().split('T')[0],
    recipient = 'المؤسس / الشركاء',
    paymentMethod = 'إنستاباي (InstaPay)',
    notes = ''
  } = req.body;

  const numAmount = Number(amount);
  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال مبلغ صحيح' });
  }

  const newTransaction = {
    id: `tr_${Date.now()}`,
    type,
    amount: numAmount,
    date,
    recipient,
    paymentMethod,
    notes,
    createdAt: new Date().toISOString()
  };

  db.treasuryTransactions.unshift(newTransaction);
  saveDb(db);

  const totalCollected = db.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalWithdrawals = db.treasuryTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const treasuryBalance = Math.max(0, totalCollected - totalWithdrawals);

  res.status(201).json({
    success: true,
    data: newTransaction,
    treasuryBalance,
    totalWithdrawals
  });
});

app.post('/api/treasury/reset-zero', (req, res) => {
  const db = loadDb();
  if (!db.treasuryTransactions) {
    db.treasuryTransactions = [];
  }

  const totalCollected = db.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const currentWithdrawals = db.treasuryTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const remaining = Math.max(0, totalCollected - currentWithdrawals);

  if (remaining <= 0) {
    return res.json({
      success: true,
      message: 'الخزينة مسواة ومصفرة بالفعل!',
      treasuryBalance: 0
    });
  }

  const {
    recipient = 'سحب أرباح كاملة / تسوية دورية',
    paymentMethod = 'إنستاباي (InstaPay)',
    notes = 'تصفير وتسوية رصيد الخزينة بالكامل'
  } = req.body || {};

  const settlementTransaction = {
    id: `tr_${Date.now()}`,
    type: 'تسوية وتصفير الخزينة',
    amount: remaining,
    date: new Date().toISOString().split('T')[0],
    recipient,
    paymentMethod,
    notes,
    createdAt: new Date().toISOString()
  };

  db.treasuryTransactions.unshift(settlementTransaction);
  saveDb(db);

  res.json({
    success: true,
    data: settlementTransaction,
    treasuryBalance: 0,
    message: 'تم تصفير الخزينة وتسوية كافة المبالغ بنجاح'
  });
});

app.delete('/api/treasury/:id', (req, res) => {
  const db = loadDb();
  if (!db.treasuryTransactions) {
    db.treasuryTransactions = [];
  }

  const initialLen = db.treasuryTransactions.length;
  db.treasuryTransactions = db.treasuryTransactions.filter(t => t.id !== req.params.id);

  if (db.treasuryTransactions.length === initialLen) {
    return res.status(404).json({ success: false, message: 'العملية غير موجودة' });
  }

  saveDb(db);
  res.json({ success: true, message: 'تم حذف العملية بنجاح' });
});

// ----------------- SETTINGS & BACKUP -----------------
app.get('/api/settings', (req, res) => {
  const db = loadDb();
  res.json({
    success: true,
    data: {
      settings: db.settings,
      servicesCatalog: db.servicesCatalog,
      acquisitionChannelsList: db.acquisitionChannelsList
    }
  });
});

app.put('/api/settings', (req, res) => {
  const db = loadDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  res.json({ success: true, data: db.settings });
});

app.get('/api/backup', (req, res) => {
  const db = loadDb();
  res.setHeader('Content-disposition', `attachment; filename=ag_media_backup_${new Date().toISOString().split('T')[0]}.json`);
  res.setHeader('Content-type', 'application/json');
  res.send(JSON.stringify(db, null, 2));
});

app.post('/api/restore', (req, res) => {
  const { data } = req.body;
  if (!data || !data.clients || !data.deliverables || !data.invoices) {
    return res.status(400).json({ success: false, message: 'هيكل ملف النسخة الاحتياطية غير صالح' });
  }
  saveDb(data);
  res.json({ success: true, message: 'تم استرجاع قاعدة البيانات بنجاح' });
});

app.post('/api/reset-sample', (req, res) => {
  const data = resetToDefault();
  res.json({ success: true, message: 'تمت استعادة البيانات الافتراضية بنجاح', data });
});

// ----------------- PAYMENT METHODS CRUD (إدارة طرق الدفع) -----------------
app.get('/api/payment-methods', (req, res) => {
  const db = loadDb();
  res.json({ success: true, data: db.settings.paymentMethods || [] });
});

app.post('/api/payment-methods', (req, res) => {
  const db = loadDb();
  if (!db.settings.paymentMethods) db.settings.paymentMethods = [];

  const {
    name,
    type = 'other',
    details = '',
    accountHolder = 'وكالة AG-media',
    instructions = '',
    isActive = true
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'يرجى كتابة اسم طريقة الدفع' });
  }

  const newMethod = {
    id: 'pm_' + Date.now(),
    name: name.trim(),
    type,
    details: details.trim(),
    accountHolder: accountHolder.trim(),
    instructions: instructions.trim(),
    isActive: Boolean(isActive),
    createdAt: new Date().toISOString()
  };

  db.settings.paymentMethods.push(newMethod);
  saveDb(db);
  res.status(201).json({ success: true, data: newMethod });
});

app.put('/api/payment-methods/:id', (req, res) => {
  const db = loadDb();
  if (!db.settings.paymentMethods) db.settings.paymentMethods = [];

  const index = db.settings.paymentMethods.findIndex(pm => pm.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'طريقة الدفع غير موجودة' });
  }

  const existing = db.settings.paymentMethods[index];
  db.settings.paymentMethods[index] = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  saveDb(db);
  res.json({ success: true, data: db.settings.paymentMethods[index] });
});

app.delete('/api/payment-methods/:id', (req, res) => {
  const db = loadDb();
  if (!db.settings.paymentMethods) db.settings.paymentMethods = [];

  const beforeLength = db.settings.paymentMethods.length;
  db.settings.paymentMethods = db.settings.paymentMethods.filter(pm => pm.id !== req.params.id);

  if (db.settings.paymentMethods.length === beforeLength) {
    return res.status(404).json({ success: false, message: 'طريقة الدفع غير موجودة' });
  }

  saveDb(db);
  res.json({ success: true, message: 'تم حذف طريقة الدفع بنجاح' });
});

// ----------------- CLOUD SYNC & STATUS ENDPOINTS -----------------
app.get('/api/cloud/status', (req, res) => {
  const db = loadDb();
  const status = cloudDb.getStatus();
  res.json({
    success: true,
    cloudSync: status,
    counts: {
      clients: (db.clients || []).length,
      deliverables: (db.deliverables || []).length,
      invoices: (db.invoices || []).length,
      users: (db.users || []).length
    },
    clientsSummary: (db.clients || []).map(c => ({ id: c.id, name: c.name, fee: c.monthlyRetainerFee })),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/cloud/sync-now', async (req, res) => {
  try {
    const synced = await initCloudDatabase();
    res.json({
      success: true,
      message: 'تمت مزامنة البيانات مع السيرفر السحابي MongoDB بنجاح!',
      clientsCount: (synced.clients || []).length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'فشلت المزامنة السحابية: ' + err.message });
  }
});

// Serve frontend build if in production
const distPath = path.join(__dirname, '..', 'dist');
if (require('fs').existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AG-media Backend] Server running at http://localhost:${PORT}`);
  // Asynchronously initialize and synchronize with MongoDB Atlas cloud
  initCloudDatabase()
    .then(() => {
      console.log('[AG-media Backend] ☁️ MongoDB Atlas cloud sync active and verified!');
    })
    .catch(err => {
      console.warn('[AG-media Backend] Cloud sync warning:', err.message);
    });
});
