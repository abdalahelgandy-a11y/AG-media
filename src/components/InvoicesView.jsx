import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  Printer, 
  Share2, 
  Trash2, 
  Edit, 
  X, 
  CreditCard,
  Check,
  Tag,
  TrendingUp,
  Calculator,
  Sparkles,
  Percent,
  CheckCircle2
} from 'lucide-react';

export default function InvoicesView({
  invoices,
  clients,
  agencySettings,
  paymentMethods = [],
  currency = 'ج.م',
  selectedClientId,
  onSaveInvoice,
  onDeleteInvoice,
  onRecordPayment
}) {
  const activePaymentMethods = paymentMethods.filter(pm => pm.isActive !== false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [clientFilter, setClientFilter] = useState(selectedClientId || 'ALL');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Form State for Create / Edit Invoice
  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    discount: 0,
    tax: 0,
    status: 'غير مدفوعة',
    notes: 'شكراً لتعاملكم مع AG-media - we create your thinking. الدفع مستحق خلال 10 أيام من تاريخ الفاتورة.',
    items: [
      {
        id: 'item_1',
        service: 'تصميم جرافيك',
        description: 'تصميم بوستات سوشيال ميديا وهوية بصرية',
        quantity: 10,
        unitPrice: 500,
        total: 5000
      }
    ]
  });

  // Form State for Record Payment
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'إنستاباي (InstaPay)',
    referenceNumber: '',
    notes: ''
  });

  // State for Paid Ads Calculator (حاسبة الإعلانات الممولة: 14% ضريبة + عمولة الوكالة)
  const [isAdsCalculatorOpen, setIsAdsCalculatorOpen] = useState(false);
  const [adsCalc, setAdsCalc] = useState({
    platform: 'فيسبوك وإنستجرام (Meta Ads)',
    campaignName: '',
    netSpend: 1000,
    commissionType: 'percent', // 'percent' or 'fixed'
    commissionPercent: 20,
    commissionFixed: 200
  });

  // Calculate Ads live breakdown
  const calcNetSpend = Math.max(0, Number(adsCalc.netSpend) || 0);
  const calcVat14 = Math.round(calcNetSpend * 0.14 * 100) / 100;
  const calcNetWithVat = calcNetSpend + calcVat14;
  let calcCommission = 0;
  if (adsCalc.commissionType === 'percent') {
    calcCommission = Math.round(calcNetSpend * (Number(adsCalc.commissionPercent) || 0) / 100);
  } else {
    calcCommission = Math.max(0, Number(adsCalc.commissionFixed) || 0);
  }
  const calcTotalAds = calcNetSpend + calcVat14 + calcCommission;

  const handleInsertAdsItem = () => {
    if (calcNetSpend <= 0) return alert('يرجى إدخال صافي ميزانية الإعلان');
    
    const descriptionText = `تمويل وإدارة إعلانات ممولة [${adsCalc.platform}]${adsCalc.campaignName ? ` - ${adsCalc.campaignName}` : ''} (صافي صرف: ${calcNetSpend.toLocaleString()} ج.م + ضريبة 14%: ${calcVat14.toLocaleString()} ج.م + عمولة إدارة ${adsCalc.commissionType === 'percent' ? `${adsCalc.commissionPercent}%` : 'مقطوعة'}: ${calcCommission.toLocaleString()} ج.م)`;

    const newItem = {
      id: 'ads_' + Date.now(),
      service: 'انشاء الاعلانات المموله',
      description: descriptionText,
      quantity: 1,
      unitPrice: calcTotalAds,
      total: calcTotalAds,
      isAdsCalculation: true,
      adSpendNet: calcNetSpend,
      adVat14: calcVat14,
      adCommissionAmount: calcCommission,
      adCommissionPercent: adsCalc.commissionType === 'percent' ? adsCalc.commissionPercent : null,
      adPlatform: adsCalc.platform
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setIsAdsCalculatorOpen(false);
  };

  const openCreateModal = (preselectedClientId) => {
    setEditingInvoice(null);
    const nextNumber = `AG-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    setFormData({
      clientId: preselectedClientId || (clientFilter !== 'ALL' ? clientFilter : (clients[0]?.id || '')),
      invoiceNumber: nextNumber,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      discount: 0,
      tax: 0,
      status: 'غير مدفوعة',
      notes: 'شكراً لتعاملكم مع AG-media - we create your thinking. الدفع عبر إنستاباي أو فودافون كاش أو الحساب البنكي.',
      items: [
        {
          id: 'item_1',
          service: 'تصميم جرافيك',
          description: 'تصميم بوستات سوشيال ميديا وهوية بصرية',
          quantity: 10,
          unitPrice: 500,
          total: 5000
        }
      ]
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (inv, e) => {
    if (e) e.stopPropagation();
    setEditingInvoice(inv);
    setFormData({
      clientId: inv.clientId,
      invoiceNumber: inv.invoiceNumber,
      date: inv.date,
      dueDate: inv.dueDate || '',
      discount: inv.discount || 0,
      tax: inv.tax || 0,
      status: inv.status || 'غير مدفوعة',
      notes: inv.notes || '',
      items: inv.items && inv.items.length ? JSON.parse(JSON.stringify(inv.items)) : [
        {
          id: 'item_1',
          service: 'خدمة تسويق وميديا',
          description: '',
          quantity: 1,
          unitPrice: inv.total || 0,
          total: inv.total || 0
        }
      ]
    });
    setIsFormModalOpen(true);
  };

  const addItemRow = (servicePreset = 'تصميم جرافيك') => {
    let unitPrice = 500;
    if (servicePreset === 'مونتاج فيديوهات وتصويرها') unitPrice = 2500;
    if (servicePreset === 'عمل فيديوهات موشن جرافيك') unitPrice = 7500;
    if (servicePreset === 'عمل فيديوهات ai') unitPrice = 2000;
    if (servicePreset === 'انشاء الاعلانات المموله') unitPrice = 10000;

    const newItem = {
      id: 'item_' + Date.now(),
      service: servicePreset,
      description: servicePreset,
      quantity: 1,
      unitPrice: unitPrice,
      total: unitPrice
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItemRow = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      const q = Number(newItems[index].quantity) || 1;
      const p = Number(newItems[index].unitPrice) || 0;
      newItems[index].total = q * p;
      return { ...prev, items: newItems };
    });
  };

  const removeItemRow = (index) => {
    if (formData.items.length <= 1) return alert('يجب أن تحتوي الفاتورة على بند واحد على الأقل');
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, it) => sum + (Number(it.total) || 0), 0);
  };

  const calculateNetTotal = () => {
    const sub = calculateSubtotal();
    return Math.max(0, sub - (Number(formData.discount) || 0) + (Number(formData.tax) || 0));
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId) return alert('يرجى اختيار العميل');
    if (!formData.items.length) return alert('يرجى إضافة بنود الفاتورة');

    await onSaveInvoice(formData, editingInvoice ? editingInvoice.id : null);
    setIsFormModalOpen(false);
  };

  const openPaymentModal = (invoice, e) => {
    if (e) e.stopPropagation();
    setSelectedInvoice(invoice);
    const remaining = Math.max(0, (invoice.total || 0) - (invoice.paidAmount || 0));
    setPaymentForm({
      amount: remaining > 0 ? remaining : '',
      paymentDate: new Date().toISOString().split('T')[0],
      method: activePaymentMethods[0]?.name || 'إنستاباي (InstaPay)',
      referenceNumber: '',
      notes: ''
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      return alert('يرجى إدخال مبلغ دفع صالح');
    }

    await onRecordPayment({
      invoiceId: selectedInvoice.id,
      clientId: selectedInvoice.clientId,
      amount: Number(paymentForm.amount),
      paymentDate: paymentForm.paymentDate,
      method: paymentForm.method,
      referenceNumber: paymentForm.referenceNumber,
      notes: paymentForm.notes
    });

    setIsPaymentModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = (inv) => {
    const client = clients.find(c => c.id === inv.clientId);
    const remaining = Math.max(0, (inv.total || 0) - (inv.paidAmount || 0));
    
    let text = `مرحباً ${client ? client.name : ''} 🌹\n`;
    text += `إليك تفاصيل فاتورة الخدمات الخاصة بك من وكالة *AG-media*:\n`;
    text += `*"we create your thinking"*\n\n`;
    text += `📄 *رقم الفاتورة:* ${inv.invoiceNumber}\n`;
    text += `📅 *تاريخ الفاتورة:* ${inv.date}\n`;
    text += `------------------------\n`;
    inv.items.forEach((it, i) => {
      if (it.isAdsCalculation) {
        text += `${i + 1}. *${it.service}* (${it.adPlatform || 'حملة إعلانية'})\n`;
        text += `   - صافي ميزانية الصرف: ${it.adSpendNet?.toLocaleString()} ${currency}\n`;
        text += `   - ضريبة القيمة المضافة 14%: +${it.adVat14?.toLocaleString()} ${currency}\n`;
        text += `   - عمولة إدارة الحملة: +${it.adCommissionAmount?.toLocaleString()} ${currency}\n`;
        text += `   - الإجمالي: ${it.total?.toLocaleString()} ${currency}\n`;
      } else {
        text += `${i + 1}. ${it.service} (${it.quantity}x): ${it.total?.toLocaleString()} ${currency}\n`;
      }
    });
    text += `------------------------\n`;
    text += `المجموع الفرعي: ${inv.subtotal?.toLocaleString()} ${currency}\n`;
    if (inv.discount > 0) {
      text += `🏷️ *الخصم الممنوح:* -${inv.discount?.toLocaleString()} ${currency}\n`;
    }
    text += `💰 *صافي إجمالي الفاتورة:* ${inv.total?.toLocaleString()} ${currency}\n`;
    text += `✅ *المدفوع:* ${inv.paidAmount?.toLocaleString()} ${currency}\n`;
    text += `⏳ *المتبقي المستحق:* ${remaining.toLocaleString()} ${currency}\n\n`;
    text += `📱 *طرق الدفع والتحصيل المعتمدة:*\n`;
    if (activePaymentMethods.length > 0) {
      activePaymentMethods.forEach(pm => {
        text += `• ${pm.name}: ${pm.details}${pm.accountHolder ? ` (باسم: ${pm.accountHolder})` : ''}\n`;
      });
    } else {
      text += `• إنستاباي: agmedia@instapay\n• فودافون كاش: 01002345678\n• تحويل بنكي الأهلي / CIB\n`;
    }
    text += `\nشكراً لثقتكم بنا! 🚀`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientName && inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.companyName && inv.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchesClient = clientFilter === 'ALL' || inv.clientId === clientFilter;

    return matchesSearch && matchesStatus && matchesClient;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Toast notification for WhatsApp copy */}
      {copiedNotification && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>تم نسخ ملخص الفاتورة بنجاح! جاهز للإرسال على الواتساب.</span>
        </div>
      )}

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm no-print">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="البحث برقم الفاتورة، اسم العميل، أو الشركة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#134C5C] focus:bg-white transition"
          />
        </div>

        {/* Filters and New Invoice */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">العميل:</span>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع العملاء</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.companyName ? `(${c.companyName})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">حالة الدفع:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="مدفوعة">مدفوعة بالكامل</option>
              <option value="جزئي">مدفوعة جزئياً</option>
              <option value="غير مدفوعة">معلقة / غير مدفوعة</option>
            </select>
          </div>

          <button
            onClick={() => openCreateModal()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-md shadow-[#134C5C]/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>إصدار فاتورة جديدة</span>
          </button>

        </div>
      </div>

      {/* Invoices Table / Cards */}
      <div className="space-y-3 no-print">
        {filteredInvoices.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">لم يتم العثور على فواتير</h4>
            <p className="text-xs text-slate-500 mt-1">ابدأ بإصدار أول فاتورة خدمات ومخرجات الآن</p>
          </div>
        ) : (
          filteredInvoices.map((inv) => {
            const remaining = Math.max(0, (inv.total || 0) - (inv.paidAmount || 0));

            return (
              <div
                key={inv.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                
                {/* Invoice Meta & Client */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#134C5C] bg-[#134C5C]/10 px-2.5 py-0.5 rounded-lg border border-[#134C5C]/20">
                      {inv.invoiceNumber}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      inv.status === 'مدفوعة'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'جزئي'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {inv.status}
                    </span>
                    <span className="text-xs text-slate-500">بتاريخ: {inv.date}</span>
                    {inv.dueDate && (
                      <span className="text-xs text-slate-500">• الاستحقاق: {inv.dueDate}</span>
                    )}
                    {inv.discount > 0 && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>خصم: {inv.discount.toLocaleString()} {currency}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{inv.clientName}</h3>
                    {inv.companyName && (
                      <span className="text-xs text-slate-500">({inv.companyName})</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    البنود: {inv.items?.map(it => `${it.service} (${it.quantity})`).join(' • ')}
                  </p>
                </div>

                {/* Amounts Breakdown */}
                <div className="flex items-center gap-6 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-center shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-500 block">الإجمالي</span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {(inv.total || 0).toLocaleString()} {currency}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200"></div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">المدفوع</span>
                    <span className="text-sm font-black text-emerald-600 font-mono">
                      {(inv.paidAmount || 0).toLocaleString()} {currency}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-slate-200"></div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">المتبقي</span>
                    <span className={`text-sm font-black font-mono ${remaining > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {remaining.toLocaleString()} {currency}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  
                  {remaining > 0 && (
                    <button
                      onClick={(e) => openPaymentModal(inv, e)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>تسجيل دفعة</span>
                    </button>
                  )}

                  {/* Edit Invoice Button */}
                  <button
                    onClick={(e) => openEditModal(inv, e)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                    title="تعديل الفاتورة والبنود والخصم"
                  >
                    <Edit className="w-4 h-4 text-[#134C5C]" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedInvoice(inv);
                      setIsViewModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                    title="معاينة وطباعة الفاتورة"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                  </button>

                  <button
                    onClick={() => handleCopyWhatsApp(inv)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-emerald-600 transition border border-slate-200"
                    title="نسخ ملخص الفاتورة للواتساب"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف الفاتورة "${inv.invoiceNumber}"؟`)) {
                        onDeleteInvoice(inv.id);
                      }
                    }}
                    className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    title="حذف الفاتورة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ----------------- CREATE / EDIT INVOICE MODAL ----------------- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn no-print">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#134C5C]" />
                  <span>{editingInvoice ? `تعديل الفاتورة رقم: ${editingInvoice.invoiceNumber}` : 'إصدار فاتورة جديدة • AG-media'}</span>
                </h3>
                <p className="text-xs text-slate-500">حدد العميل وأضف بنود الخدمات والمبالغ والخصومات المتفق عليها</p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvoiceSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">العميل *</label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#134C5C] focus:bg-white"
                  >
                    <option value="">-- اختر العميل --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.companyName ? `(${c.companyName})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">رقم الفاتورة</label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#134C5C] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">تاريخ الإصدار</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-[#134C5C] focus:bg-white"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">بنود الخدمات والمخرجات (Items):</label>
                  
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsAdsCalculatorOpen(true)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>+ تمويل إعلان ممول (حاسبة 14% ضريبة + عمولة)</span>
                    </button>

                    <span className="text-[11px] text-slate-400 mx-1">|</span>
                    <button
                      type="button"
                      onClick={() => addItemRow('تصميم جرافيك')}
                      className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    >
                      + تصميم
                    </button>
                    <button
                      type="button"
                      onClick={() => addItemRow('مونتاج فيديوهات وتصويرها')}
                      className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    >
                      + مونتاج
                    </button>
                    <button
                      type="button"
                      onClick={() => addItemRow('عمل فيديوهات موشن جرافيك')}
                      className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    >
                      + موشن
                    </button>
                    <button
                      type="button"
                      onClick={() => addItemRow('عمل فيديوهات ai')}
                      className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    >
                      + AI
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div 
                      key={item.id}
                      className="grid grid-cols-12 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 items-center text-xs"
                    >
                      <div className="col-span-12 sm:col-span-3">
                        <select
                          value={item.service}
                          onChange={(e) => updateItemRow(idx, 'service', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                        >
                          <option value="تصميم جرافيك">تصميم جرافيك</option>
                          <option value="مونتاج فيديوهات وتصويرها">مونتاج وتصوير</option>
                          <option value="عمل فيديوهات موشن جرافيك">موشن جرافيك</option>
                          <option value="عمل فيديوهات ai">فيديوهات AI</option>
                          <option value="انشاء الاعلانات المموله">إعلانات ممولة</option>
                          <option value="خدمة تسويق أخرى">خدمة أخرى</option>
                        </select>
                      </div>

                      <div className="col-span-12 sm:col-span-4">
                        <input
                          type="text"
                          placeholder="وصف البند..."
                          value={item.description}
                          onChange={(e) => updateItemRow(idx, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                        />
                        {item.isAdsCalculation && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold block mt-1">
                            حسبة إعلان: صافي {item.adSpendNet?.toLocaleString()} {currency} + ضريبة 14% ({item.adVat14?.toLocaleString()}) + عمولة {item.adCommissionAmount?.toLocaleString()} {currency}
                          </span>
                        )}
                      </div>

                      <div className="col-span-4 sm:col-span-1">
                        <input
                          type="number"
                          min="1"
                          placeholder="العدد"
                          value={item.quantity}
                          onChange={(e) => updateItemRow(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-center focus:outline-none font-bold"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          min="0"
                          placeholder="سعر الوحدة"
                          value={item.unitPrice}
                          onChange={(e) => updateItemRow(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-center focus:outline-none font-mono"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2 flex items-center justify-between">
                        <span className="font-bold text-slate-900 font-mono">
                          {(item.total || 0).toLocaleString()} {currency}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discounts & Summary Calculation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-rose-700 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-rose-600" />
                      <span>قيمة الخصم الممنوح (Discount):</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border-2 border-rose-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">تاريخ الاستحقاق (Due Date):</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-2 text-xs border-r border-slate-200 pr-4">
                  <div className="flex justify-between text-slate-600">
                    <span>المجموع الفرعي (Subtotal):</span>
                    <span className="font-bold text-slate-900 font-mono">{calculateSubtotal().toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-semibold">
                    <span>الخصم المطبق:</span>
                    <span className="font-bold font-mono">-{(Number(formData.discount) || 0).toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#134C5C] pt-2 border-t-2 border-slate-300">
                    <span>صافي الفاتورة المستحق:</span>
                    <span className="font-mono text-lg">{calculateNetTotal().toLocaleString()} {currency}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ملاحظات وشروط الفاتورة</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 resize-none"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-md shadow-[#134C5C]/20 transition"
                >
                  {editingInvoice ? 'حفظ تعديلات الفاتورة' : 'تأكيد وإصدار الفاتورة'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- RECORD PAYMENT MODAL ----------------- */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn no-print">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">تسجيل دفعة مستلمة</h3>
                <p className="text-xs text-slate-500">فاتورة {selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">المبلغ المحصل * ({currency})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold font-mono focus:bg-white focus:border-[#134C5C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">طريقة الدفع</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                >
                  {activePaymentMethods.length > 0 ? (
                    activePaymentMethods.map((pm) => (
                      <option key={pm.id} value={pm.name}>
                        {pm.name} {pm.details ? `(${pm.details})` : ''}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="إنستاباي (InstaPay)">إنستاباي (InstaPay)</option>
                      <option value="فودافون كاش (Vodafone Cash)">فودافون كاش (Vodafone Cash)</option>
                      <option value="تحويل بنكي - البنك الأهلي المصري">تحويل بنكي - الأهلي</option>
                      <option value="تحويل بنكي - CIB">تحويل بنكي - CIB</option>
                      <option value="دفع نقدي (Cash)">دفع نقدي (Cash)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">رقم المعاملة / التحويل (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: IP-9923849"
                  value={paymentForm.referenceNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">تاريخ الاستلام</label>
                <input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  حفظ الدفعة
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- PROFESSIONAL PRINTABLE INVOICE MODAL ----------------- */}
      {isViewModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-3xl max-h-[96vh] overflow-y-auto p-6 sm:p-10 space-y-8 shadow-2xl print-card">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 no-print">
              <span className="text-xs font-bold text-slate-500">معاينة الفاتورة الرسمية</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyWhatsApp(selectedInvoice)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>مشاركة بالواتساب</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة / حفظ PDF</span>
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="space-y-7">
              
              {/* Header: AG-media logo & Info */}
              <div className="flex items-start justify-between border-b-2 border-[#134C5C] pb-6">
                <div className="space-y-2">
                  <img 
                    src="/logo.png" 
                    alt="AG-media - we create your thinking" 
                    className="h-16 w-auto object-contain"
                  />
                  <p className="text-[11px] text-slate-600 max-w-sm font-medium">
                    {agencySettings?.servicesTagline || 'تصميم جرافيك • مونتاج وتصوير • موشن جرافيك • فيديوهات AI • إعلانات ممولة'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    هاتف: {agencySettings?.phone} | بريد: {agencySettings?.email}
                  </p>
                </div>

                <div className="text-left space-y-1">
                  <div className="inline-block px-3 py-1 rounded bg-[#134C5C]/10 border border-[#134C5C]/30 text-[#134C5C] text-xs font-black">
                    فاتورة رسمية / مطالبة مالية
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 pt-1">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-500">
                    تاريخ الإصدار: <strong>{selectedInvoice.date}</strong>
                  </div>
                  {selectedInvoice.dueDate && (
                    <div className="text-xs text-slate-500">
                      تاريخ الاستحقاق: <strong>{selectedInvoice.dueDate}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Info Block */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1 font-medium">فاتورة إلى العميل:</span>
                  <h4 className="text-sm font-bold text-[#134C5C]">{selectedInvoice.clientName}</h4>
                  {selectedInvoice.companyName && (
                    <p className="text-slate-700 font-medium mt-0.5">{selectedInvoice.companyName}</p>
                  )}
                  {selectedInvoice.clientPhone && (
                    <p className="text-slate-500 font-mono mt-0.5">{selectedInvoice.clientPhone}</p>
                  )}
                </div>

                <div className="text-left">
                  <span className="text-slate-500 block mb-1 font-medium">حالة السداد:</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                    selectedInvoice.status === 'مدفوعة' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#134C5C] bg-slate-100 text-slate-700">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">الخدمة</th>
                      <th className="py-2.5 px-3">الوصف والتفاصيل</th>
                      <th className="py-2.5 px-3 text-center">الكمية</th>
                      <th className="py-2.5 px-3 text-center">سعر الوحدة</th>
                      <th className="py-2.5 px-3 text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedInvoice.items?.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{it.service}</td>
                        <td className="py-3 px-3 text-slate-600">
                          <div>{it.description || '-'}</div>
                          {it.isAdsCalculation && (
                            <div className="mt-1 text-[10px] bg-emerald-50 text-emerald-800 p-1.5 rounded border border-emerald-200 font-mono">
                              صافي صرف الإعلان: {it.adSpendNet?.toLocaleString()} {currency} + ضريبة 14%: {it.adVat14?.toLocaleString()} {currency} + عمولة الوكالة: {it.adCommissionAmount?.toLocaleString()} {currency}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">{it.quantity}</td>
                        <td className="py-3 px-3 text-center text-slate-700 font-mono">
                          {Number(it.unitPrice).toLocaleString()} {currency}
                        </td>
                        <td className="py-3 px-3 text-left font-bold text-slate-900 font-mono">
                          {Number(it.total).toLocaleString()} {currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Summary */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>المجموع الفرعي:</span>
                    <span className="font-mono">{selectedInvoice.subtotal?.toLocaleString()} {currency}</span>
                  </div>

                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>الخصم الممنوح:</span>
                      <span className="font-mono">-{selectedInvoice.discount?.toLocaleString()} {currency}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-800">
                    <span>الإجمالي الكلي:</span>
                    <span className="font-mono">{selectedInvoice.total?.toLocaleString()} {currency}</span>
                  </div>

                  <div className="flex justify-between text-xs text-emerald-700 font-bold">
                    <span>المدفوع حتى تاريخه:</span>
                    <span className="font-mono">{selectedInvoice.paidAmount?.toLocaleString()} {currency}</span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-amber-700 pt-1 border-t border-slate-200">
                    <span>المتبقي المستحق:</span>
                    <span className="font-mono">
                      {Math.max(0, (selectedInvoice.total || 0) - (selectedInvoice.paidAmount || 0)).toLocaleString()} {currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods & Bank Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-800">طرق الدفع والتحويل المعتمدة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  {activePaymentMethods.length > 0 ? (
                    activePaymentMethods.map(pm => (
                      <div key={pm.id} className="p-1.5 rounded-lg bg-white border border-slate-200">
                        <span className="font-semibold text-slate-900">• {pm.name}: </span>
                        <strong className="font-mono text-[#134C5C] dir-ltr inline-block">{pm.details}</strong>
                        {pm.accountHolder && (
                          <span className="text-[10px] text-slate-500 block">باسم: {pm.accountHolder}</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      <div>• إنستاباي (InstaPay): <strong>agmedia@instapay</strong></div>
                      <div>• فودافون كاش: <strong>01002345678</strong></div>
                      <div>• تحويل بنكي الأهلي: <strong>EG4500030000012345678901234</strong></div>
                      <div>• تحويل بنكي CIB: <strong>حساب: 10005432198</strong></div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-4 border-t border-slate-200 text-slate-500 text-[11px]">
                {selectedInvoice.notes || 'شكراً لتعاملكم مع AG-media - we create your thinking. نسعد دائماً بكوننا شريك نجاحكم الإبداعي والتسويقي.'}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ----------------- PAID ADS BUDGET & COMMISSION CALCULATOR MODAL ----------------- */}
      {isAdsCalculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    حاسبة تمويل وإدارة الإعلانات الممولة
                  </h3>
                  <p className="text-xs text-slate-500">
                    حساب صافي الميزانية + ضريبة 14% تلقائياً + عمولة الوكالة
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAdsCalculatorOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">المنصة الإعلانية *</label>
                  <select
                    value={adsCalc.platform}
                    onChange={(e) => setAdsCalc({ ...adsCalc, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#134C5C]"
                  >
                    <option value="فيسبوك وإنستجرام (Meta Ads)">فيسبوك وإنستجرام (Meta Ads)</option>
                    <option value="تيك توك (TikTok Ads)">تيك توك (TikTok Ads)</option>
                    <option value="إعلانات جوجل (Google Ads / YouTube)">إعلانات جوجل / يوتيوب</option>
                    <option value="سناب شات (Snapchat Ads)">سناب شات (Snapchat Ads)</option>
                    <option value="تمويل إعلاني شامل لكافة المنصات">تمويل إعلاني شامل</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">اسم الحملة / الهدف (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: حملة مبيعات الشتاء"
                    value={adsCalc.campaignName}
                    onChange={(e) => setAdsCalc({ ...adsCalc, campaignName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#134C5C]"
                  />
                </div>
              </div>

              {/* Net Spend Input */}
              <div>
                <label className="block font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>1. صافي ميزانية الصرف على المنصة (Net Ad Spend) *</span>
                  <span className="text-[10px] text-slate-500 font-normal">المبلغ الموجه للإعلانات</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    step="50"
                    placeholder="مثال: 1000"
                    value={adsCalc.netSpend}
                    onChange={(e) => setAdsCalc({ ...adsCalc, netSpend: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 text-slate-900 font-mono font-black text-base focus:bg-white focus:border-[#134C5C]"
                  />
                  <span className="absolute left-3 top-3 text-xs text-slate-400 font-bold font-mono">{currency}</span>
                </div>
              </div>

              {/* Automatic 14% VAT Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">2. ضريبة القيمة المضافة 14% (VAT):</span>
                  <span className="text-[11px] text-slate-500">تُحسب تلقائياً وتُدفع للمنصة/الدولة</span>
                </div>
                <div className="text-left font-mono">
                  <span className="text-sm font-black text-slate-800">+{calcVat14.toLocaleString()} {currency}</span>
                  <span className="text-[10px] text-slate-400 block">(صافي + ضريبة = {calcNetWithVat.toLocaleString()})</span>
                </div>
              </div>

              {/* Agency Commission (Manual Rate or Fixed) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 block text-xs">3. عمولة إدارة الحملات للوكالة (AG-media Fee):</span>
                    <span className="text-[11px] text-emerald-700">تحدد يدوياً بنسبة مئوية أو مبلغ ثابت</span>
                  </div>

                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setAdsCalc({ ...adsCalc, commissionType: 'percent' })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        adsCalc.commissionType === 'percent' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      نسبة %
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdsCalc({ ...adsCalc, commissionType: 'fixed' })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                        adsCalc.commissionType === 'fixed' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      مبلغ ثابت
                    </button>
                  </div>
                </div>

                {adsCalc.commissionType === 'percent' ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={adsCalc.commissionPercent}
                          onChange={(e) => setAdsCalc({ ...adsCalc, commissionPercent: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-slate-900 font-mono font-bold text-xs"
                        />
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold">%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      {[15, 20, 25].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setAdsCalc({ ...adsCalc, commissionPercent: pct })}
                          className={`px-2 py-1 rounded-lg border font-bold ${
                            Number(adsCalc.commissionPercent) === pct
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <span className="font-bold text-emerald-900 font-mono text-xs shrink-0">
                      = +{calcCommission.toLocaleString()} {currency}
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="المبلغ الثابت بالجنيه"
                      value={adsCalc.commissionFixed}
                      onChange={(e) => setAdsCalc({ ...adsCalc, commissionFixed: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-slate-900 font-mono font-bold text-xs"
                    />
                    <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-bold font-mono">{currency}</span>
                  </div>
                )}
              </div>

              {/* Final Transparent Calculation Breakdown Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 font-mono">
                <span className="text-[11px] text-slate-400 font-sans block">ملخص الحسبة الإجمالي للعميل:</span>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>صافي صرف الإعلان:</span>
                  <span>{calcNetSpend.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>ضريبة القيمة المضافة 14%:</span>
                  <span>+{calcVat14.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400 font-bold">
                  <span>عمولة إدارة الحملة ({adsCalc.commissionType === 'percent' ? `${adsCalc.commissionPercent}%` : 'ثابتة'}):</span>
                  <span>+{calcCommission.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-700">
                  <span className="font-sans">إجمالي الفاتورة المطلوب سداده:</span>
                  <span className="text-emerald-400 text-lg">{calcTotalAds.toLocaleString()} {currency}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdsCalculatorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleInsertAdsItem}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>إدراج بند الإعلان في الفاتورة ({calcTotalAds.toLocaleString()} {currency})</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
