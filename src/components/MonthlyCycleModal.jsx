import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Layers,
  CheckSquare
} from 'lucide-react';

export default function MonthlyCycleModal({
  isOpen,
  onClose,
  client,
  currency = 'ج.م',
  servicesList = [],
  onConfirmCycle
}) {
  if (!isOpen || !client) return null;

  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const now = new Date();
  const nextMonthIdx = (now.getMonth() + 1) % 12;
  const year = nextMonthIdx === 0 ? now.getFullYear() + 1 : now.getFullYear();
  const defaultMonthLabel = `شهر ${months[nextMonthIdx]} ${year}`;

  const defaultBaseFee = client.monthlyRetainerFee !== undefined 
    ? client.monthlyRetainerFee 
    : (client.contractValue || 10000);

  const [monthLabel, setMonthLabel] = useState(defaultMonthLabel);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [baseFee, setBaseFee] = useState(defaultBaseFee);
  const [autoCreateInvoice, setAutoCreateInvoice] = useState(true);
  const [notes, setNotes] = useState('');

  // 1. Deliverables included in base fee (flexible breakdown without altering price)
  const [deliverables, setDeliverables] = useState([]);

  // 2. Extra deliverables outside retainer scope (with extra fee)
  const [extraDeliverables, setExtraDeliverables] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setMonthLabel(defaultMonthLabel);
      const fee = client.monthlyRetainerFee !== undefined ? client.monthlyRetainerFee : (client.contractValue || 10000);
      setBaseFee(fee);
      setNotes(`دورة ${defaultMonthLabel} - باقة التسويق والميديا`);

      // Initialize base deliverables
      let initialList = [];
      if (client.monthlyPackage && client.monthlyPackage.length) {
        initialList = client.monthlyPackage.map((p, idx) => ({ ...p, id: `p_${idx}_${Date.now()}` }));
      } else if (client.servicesAgreed && client.servicesAgreed.length) {
        initialList = client.servicesAgreed.map((s, idx) => ({
          id: `p_${idx}_${Date.now()}`,
          serviceType: s,
          title: s.includes('تصميم') ? 'تصاميم وبوستات السوشيال ميديا' : s.includes('فيديو') || s.includes('مونتاج') ? 'فيديوهات ريلز ومونتاج' : s.includes('ai') ? 'فيديوهات ذكاء اصطناعي' : s.includes('اعلان') || s.includes('إعلان') ? 'إدارة وتحسين الحملات الإعلانية' : s,
          quantityTotal: s.includes('تصميم') ? 12 : s.includes('فيديو') || s.includes('مونتاج') ? 4 : s.includes('ai') ? 4 : 1,
          unit: s.includes('تصميم') ? 'تصميم' : s.includes('فيديو') || s.includes('مونتاج') || s.includes('ai') ? 'فيديو' : 'حملة'
        }));
      } else {
        initialList = [
          { id: '1', serviceType: 'تصميم جرافيك', title: 'تصاميم السوشيال ميديا', quantityTotal: 12, unit: 'تصميم' },
          { id: '2', serviceType: 'مونتاج فيديوهات وتصويرها', title: 'فيديوهات ريلز وتيك توك', quantityTotal: 4, unit: 'فيديو' }
        ];
      }
      setDeliverables(initialList);
      setExtraDeliverables([]);
    }
  }, [client]);

  // Calculations
  const extraTotal = extraDeliverables.reduce((sum, item) => {
    const q = Number(item.quantityTotal) || 1;
    const p = Number(item.price) || 0;
    return sum + (q * p);
  }, 0);

  const totalMonthFee = (Number(baseFee) || 0) + extraTotal;

  // Add deliverable to base package
  const handleAddBaseDeliverable = () => {
    setDeliverables([
      ...deliverables,
      {
        id: `del_${Date.now()}`,
        serviceType: servicesList[0]?.name || 'تصميم جرافيك',
        title: 'مهمة جديدة ضمن الباقة',
        quantityTotal: 1,
        unit: 'عنصر'
      }
    ]);
  };

  const handleUpdateBaseDeliverable = (index, field, value) => {
    const updated = [...deliverables];
    updated[index][field] = value;
    setDeliverables(updated);
  };

  const handleRemoveBaseDeliverable = (index) => {
    setDeliverables(deliverables.filter((_, idx) => idx !== index));
  };

  // Add extra out-of-scope deliverable
  const handleAddExtraDeliverable = () => {
    setExtraDeliverables([
      ...extraDeliverables,
      {
        id: `extra_${Date.now()}`,
        serviceType: 'مونتاج فيديوهات وتصويرها',
        title: 'فيديو برومو إضافي استثنائي',
        quantityTotal: 1,
        unit: 'فيديو',
        price: 2500
      }
    ]);
  };

  const handleUpdateExtraDeliverable = (index, field, value) => {
    const updated = [...extraDeliverables];
    updated[index][field] = value;
    setExtraDeliverables(updated);
  };

  const handleRemoveExtraDeliverable = (index) => {
    setExtraDeliverables(extraDeliverables.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monthLabel.trim()) return alert('يرجى تحديد اسم أو شهر الدورة');

    try {
      setSubmitting(true);
      await onConfirmCycle({
        monthLabel,
        newContractValue: Number(baseFee) || 0,
        newStartDate,
        dueDate,
        notes,
        deliverables,
        extraDeliverables,
        autoCreateInvoice
      });
      onClose();
    } catch (err) {
      alert('حدث خطأ أثناء تجديد دورة الشهر: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl my-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#134C5C]/10 text-[#134C5C] flex items-center justify-center border border-[#134C5C]/20 shadow-xs">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  تجديد دورة العمل وبدء شهر جديد
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-[#134C5C] font-bold border border-teal-200">
                  اشتراك شهري 🔁
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                العميل: <strong className="text-slate-800">{client.name}</strong> {client.companyName ? `(${client.companyName})` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Cycle Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم الدورة / الشهر *</label>
              <input
                type="text"
                required
                value={monthLabel}
                onChange={(e) => setMonthLabel(e.target.value)}
                placeholder="مثال: شهر نوفمبر 2026"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-[#134C5C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">قيمة الاشتراك الأساسي ({currency}) *</label>
              <input
                type="number"
                required
                min="0"
                value={baseFee}
                onChange={(e) => setBaseFee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold font-mono focus:outline-none focus:border-[#134C5C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">تاريخ بداية الدورة *</label>
              <input
                type="date"
                required
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#134C5C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">تاريخ استحقاق الفاتورة *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-[#134C5C]"
              />
            </div>
          </div>

          {/* Section 1: Standard Deliverables for this Month (Flexible tasks mix without price alteration) */}
          <div className="space-y-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#134C5C]" />
                  <span>1. باقة ومهام هذا الشهر (مشمولة ضمن الاشتراك الأساسي)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  يمكنك تعديل كميات ونوعية المهام بحسب احتياج هذا الشهر دون أن تتغير قيمة الاشتراك المتفق عليها ({Number(baseFee).toLocaleString()} {currency})
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddBaseDeliverable}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5 text-[#134C5C]" />
                <span>إضافة مهمة للباقة</span>
              </button>
            </div>

            <div className="space-y-2">
              {deliverables.map((del, idx) => (
                <div key={del.id || idx} className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 items-center text-xs">
                  <div className="col-span-12 sm:col-span-5">
                    <input
                      type="text"
                      placeholder="عنوان المخرج / المهمة"
                      value={del.title}
                      onChange={(e) => handleUpdateBaseDeliverable(idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800 focus:outline-none focus:border-[#134C5C]"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <select
                      value={del.serviceType}
                      onChange={(e) => handleUpdateBaseDeliverable(idx, 'serviceType', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-[#134C5C]"
                    >
                      {servicesList.map((srv, sIdx) => (
                        <option key={sIdx} value={srv.name}>{srv.name}</option>
                      ))}
                      <option value="تصميم جرافيك">تصميم جرافيك</option>
                      <option value="مونتاج فيديوهات وتصويرها">مونتاج فيديوهات وتصويرها</option>
                      <option value="عمل فيديوهات موشن جرافيك">عمل فيديوهات موشن جرافيك</option>
                      <option value="عمل فيديوهات ai">عمل فيديوهات ai</option>
                      <option value="انشاء الاعلانات المموله">انشاء الاعلانات المموله</option>
                    </select>
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="الكمية"
                      value={del.quantityTotal}
                      onChange={(e) => handleUpdateBaseDeliverable(idx, 'quantityTotal', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-center font-mono font-bold text-slate-900 focus:outline-none focus:border-[#134C5C]"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input
                      type="text"
                      placeholder="الوحدة"
                      value={del.unit}
                      onChange={(e) => handleUpdateBaseDeliverable(idx, 'unit', e.target.value)}
                      className="w-full px-1.5 py-1.5 rounded-lg bg-white border border-slate-200 text-center text-slate-600 focus:outline-none focus:border-[#134C5C]"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveBaseDeliverable(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="حذف المهمة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Extra Work Outside Retainer (Extra Add-ons with additional billing) */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
              <div>
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>2. أعمال إضافية استثنائية لهذا الشهر (خارج الباقة - Extra Add-ons)</span>
                </h4>
                <p className="text-[11px] text-amber-700">
                  لو العميل طلب مهام إضافية هذا الشهر (مثل برومو، حملة إضافية)، يمكنك إضافتها هنا لتضاف قيمتها على فاتورة هذا الشهر تلقائياً.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddExtraDeliverable}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition self-start sm:self-auto border border-amber-300"
              >
                <Plus className="w-3.5 h-3.5 text-amber-700" />
                <span>+ إضافة عمل إضافي مدفوع</span>
              </button>
            </div>

            {extraDeliverables.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3 bg-white/70 rounded-xl border border-dashed border-slate-200">
                لا توجد أعمال إضافية استثنائية لهذا الشهر (سيتم احتساب قيمة الاشتراك المتفق عليها فقط).
              </p>
            ) : (
              <div className="space-y-2">
                {extraDeliverables.map((extra, idx) => (
                  <div key={extra.id || idx} className="grid grid-cols-12 gap-2 p-2.5 rounded-xl bg-white border border-amber-200 items-center text-xs">
                    <div className="col-span-12 sm:col-span-4">
                      <input
                        type="text"
                        placeholder="عنوان العمل الإضافي (مثال: فيديو برومو)"
                        value={extra.title}
                        onChange={(e) => handleUpdateExtraDeliverable(idx, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-amber-50/50 border border-amber-200 font-semibold text-slate-900 focus:outline-none focus:border-[#134C5C]"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <select
                        value={extra.serviceType}
                        onChange={(e) => handleUpdateExtraDeliverable(idx, 'serviceType', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-[#134C5C]"
                      >
                        {servicesList.map((srv, sIdx) => (
                          <option key={sIdx} value={srv.name}>{srv.name}</option>
                        ))}
                        <option value="مونتاج فيديوهات وتصويرها">مونتاج فيديوهات وتصويرها</option>
                        <option value="تصميم جرافيك">تصميم جرافيك</option>
                        <option value="عمل فيديوهات موشن جرافيك">عمل فيديوهات موشن جرافيك</option>
                        <option value="عمل فيديوهات ai">عمل فيديوهات ai</option>
                        <option value="انشاء الاعلانات المموله">انشاء الاعلانات المموله</option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="الكمية"
                        value={extra.quantityTotal}
                        onChange={(e) => handleUpdateExtraDeliverable(idx, 'quantityTotal', e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-center font-mono font-bold text-slate-900 focus:outline-none focus:border-[#134C5C]"
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          placeholder="السعر الإضافي"
                          value={extra.price}
                          onChange={(e) => handleUpdateExtraDeliverable(idx, 'price', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-white border border-amber-300 font-mono font-bold text-amber-800 text-left focus:outline-none focus:border-[#134C5C]"
                        />
                        <span className="absolute left-1.5 top-1.5 text-[10px] text-amber-600 font-bold">ج.م</span>
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraDeliverable(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="حذف البند الإضافي"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Calculation Summary Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#134C5C] text-white space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold">ملخص الحساب المالي لدورة {monthLabel}:</span>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCreateInvoice}
                  onChange={(e) => setAutoCreateInvoice(e.target.checked)}
                  className="w-4 h-4 rounded text-[#134C5C] focus:ring-0 cursor-pointer"
                />
                <span>إصدار فاتورة تلقائية للشهر الجديد</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-slate-300 text-[11px] block">الاشتراك الأساسي المتفق عليه</span>
                <span className="text-base font-black font-mono text-white mt-1 block">
                  {Number(baseFee).toLocaleString()} {currency}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10">
                <span className="text-amber-300 text-[11px] block">أعمال إضافية استثنائية ({extraDeliverables.length})</span>
                <span className="text-base font-black font-mono text-amber-300 mt-1 block">
                  +{extraTotal.toLocaleString()} {currency}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                <span className="text-emerald-300 text-[11px] block font-bold">إجمالي مطالبة هذا الشهر</span>
                <span className="text-xl font-black font-mono text-emerald-300 mt-0.5 block">
                  {totalMonthFee.toLocaleString()} {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات وخطة عمل دورة الشهر</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#134C5C] resize-none"
              placeholder="اكتب أي اتفاقات خاصة أو تركيز لحملات هذا الشهر..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-md shadow-[#134C5C]/20 transition flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
              <span>{submitting ? 'جاري الإصدار والتجديد...' : `تأكيد وإطلاق دورة ${monthLabel} 🚀`}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
