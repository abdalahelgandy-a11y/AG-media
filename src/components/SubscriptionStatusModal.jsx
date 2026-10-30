import React, { useState, useEffect } from 'react';
import { 
  X, 
  PauseCircle, 
  PlayCircle, 
  StopCircle, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function SubscriptionStatusModal({
  isOpen,
  onClose,
  client,
  onUpdateStatus
}) {
  if (!isOpen || !client) return null;

  const currentStatus = client.subscriptionStatus || (client.status === 'مكتمل' ? 'terminated' : 'active');
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setSelectedStatus(client.subscriptionStatus || (client.status === 'مكتمل' ? 'terminated' : 'active'));
      setReason('');
    }
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onUpdateStatus(client.id, {
        subscriptionStatus: selectedStatus,
        reason
      });
      onClose();
    } catch (err) {
      alert('حدث خطأ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              التحكم في حالة الاشتراك الشهري
            </h3>
            <p className="text-xs text-slate-500">
              العميل: <strong className="text-slate-800">{client.name}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-2">
            
            {/* Active */}
            <label className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer ${
              selectedStatus === 'active' 
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="subscriptionStatus"
                value="active"
                checked={selectedStatus === 'active'}
                onChange={() => setSelectedStatus('active')}
                className="mt-1 text-emerald-600 focus:ring-0"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                  <PlayCircle className="w-4 h-4 text-emerald-600" />
                  <span>اشتراك نشط ومستمر (Active)</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  يستمر التعاقد بصورة طبيعية، وتتجدد الفواتير والمخرجات شهرياً.
                </p>
              </div>
            </label>

            {/* Paused */}
            <label className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer ${
              selectedStatus === 'paused' 
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="subscriptionStatus"
                value="paused"
                checked={selectedStatus === 'paused'}
                onChange={() => setSelectedStatus('paused')}
                className="mt-1 text-amber-600 focus:ring-0"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <PauseCircle className="w-4 h-4 text-amber-600" />
                  <span>إيقاف مؤقت للاشتراك (Paused)</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  تجميد مؤقت للحساب والعمل (سفر العميل أو إجازة)، لا يتم إصدار فواتير خلال فترة التوقف.
                </p>
              </div>
            </label>

            {/* Terminated */}
            <label className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer ${
              selectedStatus === 'terminated' 
                ? 'bg-red-50/70 border-red-300 ring-2 ring-red-500/20' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="subscriptionStatus"
                value="terminated"
                checked={selectedStatus === 'terminated'}
                onChange={() => setSelectedStatus('terminated')}
                className="mt-1 text-red-600 focus:ring-0"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-red-900 flex items-center gap-1.5 text-xs">
                  <StopCircle className="w-4 h-4 text-red-600" />
                  <span>إنهاء التعاقد وإلغاء الاشتراك (Terminated)</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  إغلاق رسمي للتعاقد مع الاحتفاظ بكافة الفواتير والأعمال السابقة في السجل.
                </p>
              </div>
            </label>

          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">السبب أو الملاحظات</label>
            <input
              type="text"
              placeholder="مثال: طلب العميل تجميد العمل لشهر نوفمبر، أو انتهاء مدة الاتفاق"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-[#134C5C]"
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
              className="px-5 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white font-bold transition"
            >
              {submitting ? 'جاري الحفظ...' : 'تأكيد تغيير الحالة'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
