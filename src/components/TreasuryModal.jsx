import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ArrowDownLeft, 
  RotateCcw, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  DollarSign, 
  Building2, 
  Calendar,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export default function TreasuryModal({
  isOpen,
  onClose,
  stats,
  treasuryData,
  paymentMethods = [],
  currency = 'ج.م',
  onAddTransaction,
  onResetZero,
  onDeleteTransaction
}) {
  if (!isOpen) return null;

  const totalCollected = stats?.totalCollected || 0;
  const totalWithdrawals = stats?.totalWithdrawals || 0;
  const treasuryBalance = stats?.treasuryBalance !== undefined ? stats.treasuryBalance : Math.max(0, totalCollected - totalWithdrawals);
  const transactions = treasuryData?.transactions || [];

  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'new' or 'reset'
  const [formData, setFormData] = useState({
    type: 'سحب أرباح',
    amount: '',
    recipient: 'المؤسس / الشركاء',
    paymentMethod: paymentMethods.find(m => m.isActive)?.name || 'إنستاباي (InstaPay)',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [resetData, setResetData] = useState({
    recipient: 'أرباح الشركاء والمؤسس (تسوية كاملة)',
    paymentMethod: paymentMethods.find(m => m.isActive)?.name || 'إنستاباي (InstaPay)',
    notes: 'تصفير رصيد الخزينة بالكامل بعد تسوية كافة الأرباح'
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      alert('يرجى كتابة مبلغ صحيح أكبر من صفر');
      return;
    }
    if (Number(formData.amount) > treasuryBalance) {
      if (!confirm(`المبلغ المدخل (${Number(formData.amount).toLocaleString()} ${currency}) أكبر من المتاح في الخزينة (${treasuryBalance.toLocaleString()} ${currency}). هل ترغب في المتابعة على أية حال؟`)) {
        return;
      }
    }

    try {
      setSubmitting(true);
      await onAddTransaction(formData);
      setSuccessMsg('تم تسجيل حركة الخزينة وتحديث الرصيد بنجاح!');
      setFormData({
        type: 'سحب أرباح',
        amount: '',
        recipient: 'المؤسس / الشركاء',
        paymentMethod: paymentMethods.find(m => m.isActive)?.name || 'إنستاباي (InstaPay)',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setActiveTab('list');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('حدث خطأ أثناء حفظ المعاملة: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetZeroConfirm = async () => {
    if (treasuryBalance <= 0) {
      alert('الخزينة مصفّرة بالفعل!');
      return;
    }
    if (!confirm(`تأكيد تصفير الخزينة:\nسيتم تسجيل سحب كامل الرصيد المتاح (${treasuryBalance.toLocaleString()} ${currency}) لتصبح الخزينة 0 ج.م.\n\nهل أنت متأكد؟`)) {
      return;
    }

    try {
      setSubmitting(true);
      await onResetZero(resetData);
      setSuccessMsg(`تم تصفير الخزينة بنجاح وتسوية ${treasuryBalance.toLocaleString()} ${currency}!`);
      setActiveTab('list');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('حدث خطأ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-8 transition-all">
        
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#134C5C]/10 flex items-center justify-center text-[#134C5C] border border-[#134C5C]/20 shadow-sm">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>حركة الخزينة ومسحوبات الأرباح والتسوية</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  نقدية AG-media
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                متابعة النقدية الفعلية المتاحة في يدك بعد سحب الأرباح والمصروفات وتصفير الخزينة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 3 Core Treasury Financial Cards */}
        <div className="p-6 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Cumulative Revenue */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">المحصل التراكمي (المبيعات)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-2">
                {totalCollected.toLocaleString()} <span className="text-xs font-bold text-slate-400">{currency}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">إجمالي ما تم تحصيله من العملاء تاريخياً</p>
            </div>

            {/* 2. Total Withdrawals */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-800">إجمالي المسحوبات والمصروفات</span>
                <ArrowDownLeft className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-700 font-mono mt-2">
                {totalWithdrawals.toLocaleString()} <span className="text-xs font-bold text-amber-500">{currency}</span>
              </div>
              <p className="text-[11px] text-amber-600/80 mt-1">أرباح تم سحبها + مصاريف مدفوعة</p>
            </div>

            {/* 3. Net Cash in Treasury (Available to Withdraw or Reset) */}
            <div className={`p-4 rounded-2xl border ${
              treasuryBalance > 0 
                ? 'bg-gradient-to-br from-[#134C5C]/10 to-sky-50 border-[#134C5C]/30' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#134C5C]">المتاح بالخزينة حالياً (Cash on Hand)</span>
                <span className={`w-2.5 h-2.5 rounded-full ${treasuryBalance > 0 ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'}`}></span>
              </div>
              <div className="text-2xl font-black text-[#134C5C] font-mono mt-2">
                {treasuryBalance.toLocaleString()} <span className="text-xs font-bold text-slate-400">{currency}</span>
              </div>
              <p className="text-[11px] font-semibold mt-1">
                {treasuryBalance > 0 ? (
                  <span className="text-sky-700">✓ جاهز للسحب والتوزيع أو التصفير</span>
                ) : (
                  <span className="text-emerald-700 font-bold">✓ الخزينة مسواة ومصفّرة بالكامل (0 ج.م)</span>
                )}
              </p>
            </div>

          </div>
        </div>

        {/* Modal Navigation Tabs & Action Bar */}
        <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'list' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              سجل الحركات السابقة ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'new' 
                  ? 'bg-[#134C5C] text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>سحب مبلغ / مصروف جديد</span>
            </button>
          </div>

          {/* Quick One-Click Full Zero Reset Button */}
          {treasuryBalance > 0 && (
            <button
              onClick={handleResetZeroConfirm}
              disabled={submitting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 transition shadow-sm"
              title="سحب كل الرصيد المتبقي لتصبح الخزينة صفراً"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>تصفير وتسوية الخزينة بالكامل ({treasuryBalance.toLocaleString()} {currency})</span>
            </button>
          )}
        </div>

        {/* Tab 1: New Withdrawal Form */}
        {activeTab === 'new' && (
          <form onSubmit={handleCreate} className="p-6 space-y-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-[#134C5C]" />
                <span>تسجيل عملية سحب أرباح أو مصروف جديد</span>
              </h3>
              <span className="text-xs text-slate-500">
                المتبقي المتاح: <strong className="text-[#134C5C] font-mono">{treasuryBalance.toLocaleString()} {currency}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحركة</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#134C5C]"
                >
                  <option value="سحب أرباح">سحب أرباح (مؤسس / شركاء)</option>
                  <option value="مصروفات تشغيلية">مصروفات تشغيلية (اشتراكات/أدوات)</option>
                  <option value="أتعاب فريلانسرز">أتعاب فريلانسرز ومساعدين</option>
                  <option value="تمويل إعلانات">تمويل إعلانات من الخزينة</option>
                  <option value="تسوية وتصفير الخزينة">تسوية وتصفير دوري</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المطلوب سحبه ({currency}) *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    placeholder="مثال: 15000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-mono font-bold text-slate-900 focus:outline-none focus:border-[#134C5C]"
                  />
                  {treasuryBalance > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: treasuryBalance.toString() })}
                      className="absolute left-2 top-1.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold"
                    >
                      كامل الرصيد
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">طريقة السحب / الدفع</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#134C5C]"
                >
                  {paymentMethods.filter(m => m.isActive).map(m => (
                    <option key={m.id || m.name} value={m.name}>
                      {m.name} {m.details ? `(${m.details})` : ''}
                    </option>
                  ))}
                  <option value="كاش نقدي">كاش نقدي من مقر الوكالة</option>
                  <option value="إنستاباي (InstaPay)">إنستاباي (InstaPay)</option>
                  <option value="فودافون كاش">فودافون كاش</option>
                  <option value="تحويل بنكي">تحويل بنكي</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المستلم / الجهة</label>
                <input
                  type="text"
                  placeholder="مثال: المؤسس أحمد، أو منصة كانفا"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#134C5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#134C5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات وبيان</label>
                <input
                  type="text"
                  placeholder="مثال: سحب دفعة أرباح عن شهر أكتوبر"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-[#134C5C]"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold transition shadow-sm"
              >
                {submitting ? 'جاري الحفظ...' : 'تأكيد السحب وتحديث الخزينة'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Transactions List */}
        {activeTab === 'list' && (
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">لم يتم تسجيل أي مسحوبات حتى الآن</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  كافة الأموال المحصلة من العملاء ({totalCollected.toLocaleString()} {currency}) لا تزال متوفرة بالكامل في رصيد الخزينة.
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#134C5C] text-white text-xs font-bold hover:bg-[#0f3d4a] transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>تسجيل أول عملية سحب أرباح</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                      <th className="py-2.5 px-3">التاريخ</th>
                      <th className="py-2.5 px-3">نوع الحركة</th>
                      <th className="py-2.5 px-3">المستلم / البيان</th>
                      <th className="py-2.5 px-3">طريقة الدفع</th>
                      <th className="py-2.5 px-3 text-center">المبلغ</th>
                      <th className="py-2.5 px-3 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => {
                      const isSettlement = t.type?.includes('تصفير') || t.type?.includes('تسوية');
                      return (
                        <tr key={t.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-3 font-mono text-slate-600">{t.date}</td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                              isSettlement
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : t.type === 'سحب أرباح'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {isSettlement ? <RotateCcw className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                              <span>{t.type}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-800">{t.recipient || '—'}</div>
                            {t.notes && <div className="text-[11px] text-slate-400 mt-0.5">{t.notes}</div>}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">{t.paymentMethod || '—'}</td>
                          <td className="py-3 px-3 text-center font-mono font-black text-amber-700">
                            -{(Number(t.amount) || 0).toLocaleString()} {currency}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={async () => {
                                if (confirm(`حذف حركة السحب بقيمة ${(Number(t.amount) || 0).toLocaleString()} ${currency} وإعادة المبلغ إلى الخزينة؟`)) {
                                  await onDeleteTransaction(t.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="حذف الحركة وإعادة المبلغ للخزينة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer info note */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">قاعدة المحاسبة:</span>
            <span>المحصل يعبر دائماً عن إجمالي مبيعات الوكالة، بينما ينخفض رصيد الخزينة المتاح فورياً ويتصفر مع كل سحب أو تسوية.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition text-xs"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
}
