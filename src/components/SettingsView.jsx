import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  Save, 
  Check, 
  Building2, 
  CreditCard, 
  Palette, 
  Video, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  X,
  Smartphone,
  Landmark,
  Banknote,
  CheckCircle2,
  Copy,
  Info,
  Power,
  Lock,
  Mail,
  ShieldCheck,
  Key
} from 'lucide-react';

export default function SettingsView({
  settings,
  paymentMethods = [],
  servicesCatalog = [],
  currency = 'ج.م',
  user,
  onUpdateCredentials,
  onUpdateSettings,
  onSavePaymentMethod,
  onDeletePaymentMethod,
  onTogglePaymentMethodStatus,
  onResetSampleData,
  onRestoreData
}) {
  const [formData, setFormData] = useState({
    agencyName: settings?.agencyName || 'AG-media',
    agencyFullName: settings?.agencyFullName || 'وكالة AG-media للإنتاج الرقمي والتسويق',
    tagline: settings?.tagline || 'we create your thinking',
    servicesTagline: settings?.servicesTagline || 'تصميم جرافيك • مونتاج وتصوير • موشن جرافيك • فيديوهات AI • إعلانات ممولة',
    currency: settings?.currency || 'EGP',
    currencySymbol: settings?.currencySymbol || 'ج.م',
    phone: settings?.phone || '+20 100 234 5678',
    email: settings?.email || 'contact@agmedia.agency',
    address: settings?.address || 'القاهرة، جمهورية مصر العربية',
    invoiceFooterNote: settings?.invoiceFooterNote || ''
  });

  const [authFormData, setAuthFormData] = useState({
    name: user?.name || 'إدارة AG-media',
    email: user?.email || 'admin@agmedia.agency',
    newPassword: ''
  });
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    if (onUpdateCredentials) {
      try {
        setAuthLoading(true);
        await onUpdateCredentials({
          name: authFormData.name,
          email: authFormData.email,
          password: authFormData.newPassword ? authFormData.newPassword : undefined
        });
        setAuthSuccessMsg('تم تحديث بيانات الدخول بنجاح!');
        setAuthFormData(prev => ({ ...prev, newPassword: '' }));
        setTimeout(() => setAuthSuccessMsg(''), 4000);
      } catch (err) {
        alert('حدث خطأ أثناء تحديث بيانات الدخول: ' + err.message);
      } finally {
        setAuthLoading(false);
      }
    }
  };

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Payment Method Modal State
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodFormData, setMethodFormData] = useState({
    name: '',
    type: 'instapay',
    details: '',
    accountHolder: 'وكالة AG-media',
    instructions: '',
    isActive: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDownloadBackup = () => {
    window.open('/api/backup', '_blank');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (confirm('هل أنت متأكد من استرجاع هذه النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.')) {
          await onRestoreData(json);
          alert('تم استرجاع البيانات بنجاح!');
        }
      } catch (err) {
        alert('خطأ في قراءة ملف النسخة الاحتياطية، تأكد أنه ملف JSON صالح.');
      }
    };
    reader.readAsText(file);
  };

  // Payment Methods Handlers
  const openAddMethodModal = (preset = null) => {
    setEditingMethod(null);
    if (preset) {
      setMethodFormData({
        name: preset.name || '',
        type: preset.type || 'instapay',
        details: preset.details || '',
        accountHolder: preset.accountHolder || 'وكالة AG-media',
        instructions: preset.instructions || '',
        isActive: true
      });
    } else {
      setMethodFormData({
        name: '',
        type: 'instapay',
        details: '',
        accountHolder: 'وكالة AG-media',
        instructions: '',
        isActive: true
      });
    }
    setIsMethodModalOpen(true);
  };

  const openEditMethodModal = (method) => {
    setEditingMethod(method);
    setMethodFormData({
      name: method.name || '',
      type: method.type || 'instapay',
      details: method.details || '',
      accountHolder: method.accountHolder || 'وكالة AG-media',
      instructions: method.instructions || '',
      isActive: method.isActive !== undefined ? method.isActive : true
    });
    setIsMethodModalOpen(true);
  };

  const handleMethodSubmit = async (e) => {
    e.preventDefault();
    if (!methodFormData.name.trim()) return alert('يرجى إدخال اسم طريقة الدفع');
    if (!methodFormData.details.trim()) return alert('يرجى إدخال رقم الحساب أو المحفظة أو المعرف');

    await onSavePaymentMethod(methodFormData, editingMethod ? editingMethod.id : null);
    setIsMethodModalOpen(false);
  };

  const handleCopyDetails = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'instapay':
        return <Smartphone className="w-5 h-5 text-teal-600" />;
      case 'wallet':
        return <Smartphone className="w-5 h-5 text-rose-600" />;
      case 'bank':
        return <Landmark className="w-5 h-5 text-sky-600" />;
      case 'cash':
        return <Banknote className="w-5 h-5 text-emerald-600" />;
      case 'card':
      case 'online':
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-slate-600" />;
    }
  };

  const getMethodTypeLabel = (type) => {
    switch (type) {
      case 'instapay': return 'إنستاباي (InstaPay)';
      case 'wallet': return 'محفظة كاش إلكترونية';
      case 'bank': return 'حساب / تحويل بنكي';
      case 'cash': return 'دفع نقدي (كاش)';
      case 'card':
      case 'online': return 'دفع إلكتروني / بطاقة';
      default: return 'طريقة دفع مخصصة';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 px-3 py-1.5 bg-white rounded-2xl flex items-center justify-center shadow border-2 border-[#134C5C]">
            <img src="/logo.png" alt="AG-media" className="h-12 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>إعدادات النظام والهوية وطرق الدفع</span>
            </h2>
            <p className="text-xs text-[#134C5C] font-mono tracking-tight font-semibold mt-0.5">
              we create your thinking
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>تم حفظ الإعدادات بنجاح!</span>
          </div>
        )}
      </div>

      {/* ----------------- ACCOUNT SECURITY & PASSWORD CARD ----------------- */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#134C5C] text-xs font-bold border border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>أمان وحماية النظام</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">بيانات تسجيل الدخول وكلمة المرور (Email & Password)</h3>
            <p className="text-xs text-slate-500">
              تحكم في البريد الإلكتروني وكلمة المرور المستخدمة للدخول إلى نظام إدارة AG-media
            </p>
          </div>
        </div>

        {authSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">اسم المسؤول / الحساب</label>
            <input
              type="text"
              value={authFormData.name}
              onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#134C5C]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">البريد الإلكتروني للدخول</label>
            <input
              type="email"
              required
              value={authFormData.email}
              onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-left dir-ltr focus:bg-white focus:outline-none focus:border-[#134C5C]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">كلمة المرور الجديدة (اختياري)</label>
            <input
              type="password"
              placeholder="اتركها فارغة إذا لم ترغب بالتغيير"
              value={authFormData.newPassword}
              onChange={(e) => setAuthFormData({ ...authFormData, newPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-left dir-ltr focus:bg-white focus:outline-none focus:border-[#134C5C]"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={authLoading}
              className="px-5 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>{authLoading ? 'جاري الحفظ...' : 'تحديث بيانات الدخول وكلمة المرور'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ----------------- PAYMENT METHODS MANAGEMENT CARD (طرق الدفع والتحصيل) ----------------- */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#134C5C] text-xs font-bold border border-teal-200">
              <CreditCard className="w-3.5 h-3.5" />
              <span>إدارة الحسابات وطرق السداد</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">طرق الدفع والتحصيل المعتمدة (Payment Methods)</h3>
            <p className="text-xs text-slate-500">
              أضف وعدّل الحسابات البنكية ومحافظ الكاش وإنستاباي. تظهر الحسابات المفعلة تلقائياً في الفواتير المطبوعة ورسائل الواتساب وقائمة تسجيل الدفعات.
            </p>
          </div>

          <button
            onClick={() => openAddMethodModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-sm shadow-[#134C5C]/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طريقة دفع جديدة</span>
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>إضافة سريعة لقالب جاهز:</span>
          </span>
          <button
            onClick={() => openAddMethodModal({ name: 'إنستاباي (InstaPay)', type: 'instapay', details: 'username@instapay', accountHolder: 'وكالة AG-media', instructions: 'يرجى كتابة رقم الفاتورة في خانة البيان وإرسال إشعار التحويل' })}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-teal-800 font-semibold transition"
          >
            + إنستاباي
          </button>
          <button
            onClick={() => openAddMethodModal({ name: 'فودافون كاش (Vodafone Cash)', type: 'wallet', details: '010xxxxxxxx', accountHolder: 'وكالة AG-media', instructions: 'التحويل متاح 24 ساعة، يرجى إرسال رسالة التأكيد عبر واتساب' })}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-rose-400 text-rose-800 font-semibold transition"
          >
            + فودافون كاش
          </button>
          <button
            onClick={() => openAddMethodModal({ name: 'تحويل بنكي - البنك الأهلي المصري', type: 'bank', details: 'IBAN: EG4500030000012345678901234', accountHolder: 'شركة AG-media للإنتاج الفني والتسويق', instructions: 'يرجى إرسال إيصال الإيداع أو التحويل البنكي' })}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-400 text-sky-800 font-semibold transition"
          >
            + حساب بنكي (IBAN)
          </button>
          <button
            onClick={() => openAddMethodModal({ name: 'دفع نقدي (Cash)', type: 'cash', details: 'استلام في مقر الوكالة أو عبر مندوب', accountHolder: 'قسم الحسابات', instructions: 'يتم استلام إيصال قبض نقدي رسمي معتمد ومختوم' })}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-emerald-800 font-semibold transition"
          >
            + دفع نقدي
          </button>
        </div>

        {/* Payment Methods Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">لم يتم إضافة طرق دفع بعد</h4>
              <p className="text-xs text-slate-400 mt-1">اضغط على "إضافة طريقة دفع جديدة" للبدء</p>
            </div>
          ) : (
            paymentMethods.map((pm) => {
              const isActive = pm.isActive !== undefined ? pm.isActive : true;

              return (
                <div
                  key={pm.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'bg-white border-slate-200 hover:border-[#134C5C] shadow-xs hover:shadow-md'
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                          {getMethodIcon(pm.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{pm.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {getMethodTypeLabel(pm.type)}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isActive ? 'مفعلة' : 'معطلة'}
                      </span>
                    </div>

                    {/* Account Details Box */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <div className="overflow-hidden">
                        <span className="text-[10px] text-slate-400 block">رقم الحساب / المحفظة / المعرف:</span>
                        <span className="font-bold text-slate-800 font-mono tracking-wide dir-ltr text-left inline-block truncate max-w-full">
                          {pm.details}
                        </span>
                      </div>

                      <button
                        title="نسخ الحساب"
                        onClick={() => handleCopyDetails(pm.details, pm.id)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition shrink-0"
                      >
                        {copiedId === pm.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Account Holder & Instructions */}
                    <div className="space-y-1 text-xs">
                      {pm.accountHolder && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="text-slate-400 text-[11px]">اسم المستفيد:</span>
                          <span className="font-medium text-slate-800">{pm.accountHolder}</span>
                        </div>
                      )}
                      {pm.instructions && (
                        <div className="flex items-start gap-1 text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{pm.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => onTogglePaymentMethodStatus(pm.id, isActive)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-semibold transition ${
                        isActive
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isActive ? 'تعطيل مؤقت' : 'تفعيل الطريقة'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditMethodModal(pm)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-transparent hover:border-slate-200 transition"
                        title="تعديل طريقة الدفع"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف طريقة الدفع "${pm.name}"؟`)) {
                            onDeletePaymentMethod(pm.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 transition"
                        title="حذف طريقة الدفع"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ----------------- AGENCY DETAILS FORM ----------------- */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#134C5C]" />
          <span>بيانات وكالة AG-media الرسمية (تظهر في ترويسة الفواتير وعروض الأسعار)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">اسم الوكالة التجاري</label>
            <input
              type="text"
              value={formData.agencyName}
              onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-[#134C5C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">الاسم الكامل / الصفة القانونية</label>
            <input
              type="text"
              value={formData.agencyFullName}
              onChange={(e) => setFormData({ ...formData, agencyFullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#134C5C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">شعار الوكالة (Slogan)</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-[#134C5C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">رمز العملة الافتراضية</label>
            <select
              value={formData.currencySymbol}
              onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:bg-white focus:border-[#134C5C] focus:outline-none"
            >
              <option value="ج.م">جنيه مصري (ج.م)</option>
              <option value="$">دولار أمريكي ($)</option>
              <option value="ر.س">ريال سعودي (ر.س)</option>
              <option value="د.إ">درهم إماراتي (د.إ)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">رقم الهاتف والتواصل</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-[#134C5C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">البريد الإلكتروني للوكالة</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-[#134C5C] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1.5">العنوان ومقر الوكالة</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#134C5C] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1.5">خاتمة الفواتير وعروض الأسعار وشروط التعامل</label>
            <textarea
              rows="2"
              value={formData.invoiceFooterNote}
              onChange={(e) => setFormData({ ...formData, invoiceFooterNote: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 resize-none focus:bg-white focus:border-[#134C5C] focus:outline-none"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-sm shadow-[#134C5C]/20 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>حفظ بيانات الوكالة</span>
          </button>
        </div>
      </form>

      {/* ----------------- BACKUP, RESTORE & DATA MANAGEMENT ----------------- */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-600" />
          <span>النسخ الاحتياطي وإدارة البيانات (JSON)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>تحميل نسخة احتياطية</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                تنزيل ملف JSON كامل يحتوي على العملاء، المخرجات، الفواتير، طرق الدفع، عروض الأسعار والعروض التقديمية.
              </p>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-700 border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل النسخة الاحتياطية</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#134C5C]" />
                <span>استرجاع نسخة سابقة</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                رفع ملف JSON تم تنزيله سابقاً لاستعادة قاعدة البيانات.
              </p>
            </div>
            <label className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#134C5C] border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs">
              <Upload className="w-4 h-4" />
              <span>رفع ملف JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span>استعادة البيانات النموذجية</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                استرجاع البيانات النموذجية الكاملة لـ AG-media (بما في ذلك عروض الأسعار وطرق الدفع والعروض التقديمية).
              </p>
            </div>
            <button
              onClick={async () => {
                if (confirm('هل أنت متأكد من استعادة البيانات النموذجية؟')) {
                  await onResetSampleData();
                  alert('تمت استعادة البيانات النموذجية بنجاح!');
                }
              }}
              className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>استعادة البيانات التجريبية</span>
            </button>
          </div>

        </div>
      </div>

      {/* ----------------- ADD / EDIT PAYMENT METHOD MODAL ----------------- */}
      {isMethodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingMethod ? 'تعديل طريقة الدفع والتحصيل' : 'إضافة طريقة دفع جديدة'}
                </h3>
                <p className="text-xs text-slate-500">
                  حدد اسم الطريقة، رقم الحساب أو المحفظة، واسم المستفيد
                </p>
              </div>
              <button
                onClick={() => setIsMethodModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMethodSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  اسم طريقة الدفع *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: إنستاباي (InstaPay) أو فودافون كاش أو CIB"
                  value={methodFormData.name}
                  onChange={(e) => setMethodFormData({ ...methodFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    نوع / تصنيف الطريقة
                  </label>
                  <select
                    value={methodFormData.type}
                    onChange={(e) => setMethodFormData({ ...methodFormData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  >
                    <option value="instapay">إنستاباي (InstaPay)</option>
                    <option value="wallet">محفظة كاش إلكترونية (فودافون/أورنج/اتصالات/وي)</option>
                    <option value="bank">تحويل / حساب بنكي</option>
                    <option value="cash">دفع نقدي (Cash)</option>
                    <option value="card">بطاقة ائتمان / دفع أونلاين</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    اسم صاحب الحساب / المستفيد
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: وكالة AG-media"
                    value={methodFormData.accountHolder}
                    onChange={(e) => setMethodFormData({ ...methodFormData, accountHolder: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  رقم الحساب / المحفظة / المعرف (IPA / IBAN / Phone) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: agmedia@instapay أو 01002345678 أو رقم الآيبان"
                  value={methodFormData.details}
                  onChange={(e) => setMethodFormData({ ...methodFormData, details: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono dir-ltr text-left focus:bg-white focus:outline-none focus:border-[#134C5C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  تعليمات التحويل أو ملاحظات للعميل
                </label>
                <textarea
                  rows="2"
                  placeholder="مثال: يرجى كتابة رقم الفاتورة في البيان وإرسال إيصال التحويل عبر واتساب فوراً."
                  value={methodFormData.instructions}
                  onChange={(e) => setMethodFormData({ ...methodFormData, instructions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 resize-none focus:bg-white focus:outline-none focus:border-[#134C5C]"
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={methodFormData.isActive}
                    onChange={(e) => setMethodFormData({ ...methodFormData, isActive: e.target.checked })}
                    className="rounded text-[#134C5C] focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">تفعيل طريقة الدفع</span>
                    <span className="text-[11px] text-slate-500">
                      ستظهر هذه الطريقة في الفواتير المطبوعة ورسائل الواتساب وخيارات تسجيل الدفع.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMethodModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white font-bold shadow-sm shadow-[#134C5C]/20 transition"
                >
                  {editingMethod ? 'حفظ التعديلات' : 'إضافة طريقة الدفع'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
