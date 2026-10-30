import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  Copy, 
  Share2, 
  DollarSign, 
  Calendar,
  CreditCard,
  MessageSquare
} from 'lucide-react';

export default function MonthlyPaymentModal({
  isOpen,
  onClose,
  client,
  invoice,
  paymentMethods = [],
  currency = 'ج.م',
  onConfirmPayment
}) {
  if (!isOpen || !client) return null;

  const totalAmount = invoice ? Math.max(0, (Number(invoice.total) || 0) - (Number(invoice.paidAmount) || 0)) : (client.contractValue || 0);

  const [paymentMethod, setPaymentMethod] = useState(
    paymentMethods.find(m => m.isActive)?.name || 'إنستاباي (InstaPay)'
  );
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (client) {
      setNotes(`سداد اشتراك شهري للعميل ${client.name}`);
      setSuccessReceipt(null);
      setCopied(false);
    }
  }, [client, invoice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await onConfirmPayment(client.id, {
        invoiceId: invoice?.id,
        amount: totalAmount,
        paymentMethod,
        date,
        notes
      });
      if (res && res.data && res.data.whatsappReceipt) {
        setSuccessReceipt(res.data.whatsappReceipt);
      } else {
        alert('تم تسجيل استلام الدفعة وتسوية الفاتورة بنجاح!');
        onClose();
      }
    } catch (err) {
      alert('حدث خطأ أثناء تسجيل الدفعة: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyReceipt = () => {
    if (!successReceipt) return;
    navigator.clipboard.writeText(successReceipt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    if (!successReceipt) return;
    const phone = (client.phone || '').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(successReceipt);
    const url = phone ? `https://wa.me/${phone.startsWith('0') ? '2' + phone : phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                تسجيل استلام الدفعة الشهرية
              </h3>
              <p className="text-xs text-slate-500">
                العميل: <strong className="text-slate-800">{client.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If successfully paid, show receipt screen */}
        {successReceipt ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">
                تم استلام الدفعة وتسوية الحساب بنجاح!
              </h4>
              <p className="text-xs text-emerald-700 font-mono font-bold">
                تم تسديد {totalAmount.toLocaleString()} {currency} وتحويل الحالة إلى (مسدد بالكامل ✓)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700 text-right">
              {successReceipt}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyReceipt}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ الإيصال'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>إرسال واتساب للعميل</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">المبلغ المستحق للاستلام:</span>
                <span className="text-2xl font-black text-emerald-700 font-mono mt-0.5 block">
                  {totalAmount.toLocaleString()} <span className="text-xs font-bold text-slate-400">{currency}</span>
                </span>
              </div>
              {invoice && (
                <div className="text-left font-mono text-[11px] text-slate-500">
                  <span>فاتورة #{invoice.invoiceNumber}</span>
                  <span className="block text-slate-400">{invoice.cycleMonth || 'اشتراك شهري'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">طريقة استلام الدفعة *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-[#134C5C]"
              >
                {paymentMethods.filter(m => m.isActive).map(m => (
                  <option key={m.id || m.name} value={m.name}>
                    {m.name} {m.details ? `(${m.details})` : ''}
                  </option>
                ))}
                <option value="إنستاباي (InstaPay)">إنستاباي (InstaPay)</option>
                <option value="فودافون كاش (Vodafone Cash)">فودافون كاش (Vodafone Cash)</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="دفع نقدي (Cash)">دفع نقدي (Cash)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">تاريخ التحصيل والاستلام *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ملاحظات التحصيل</label>
              <input
                type="text"
                placeholder="مثال: تم الاستلام عبر انستاباي كامل المبلغ"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'جاري التسجيل...' : 'تأكيد الاستلام وتسوية الفاتورة'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
