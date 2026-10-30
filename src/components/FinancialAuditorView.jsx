import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Download, 
  CreditCard, 
  Building2, 
  Trash2, 
  Share2,
  Wallet,
  RotateCcw
} from 'lucide-react';

export default function FinancialAuditorView({
  clients,
  invoices,
  payments,
  paymentMethods = [],
  summaryData,
  treasuryData,
  currency = 'ج.م',
  onRecordPayment,
  onDeletePayment,
  onOpenTreasury
}) {
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [balanceFilter, setBalanceFilter] = useState('ALL');

  const metrics = summaryData?.metrics || {};
  const channelBreakdown = summaryData?.channelBreakdown || [];

  const clientBalances = clients.map(c => {
    const clientInvoices = invoices.filter(i => i.clientId === c.id);
    const clientPayments = payments.filter(p => p.clientId === c.id);
    
    const invoiced = clientInvoices.reduce((s, i) => s + (Number(i.total) || 0), 0);
    const paid = clientPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const balance = Math.max(0, invoiced - paid);

    return {
      ...c,
      totalInvoicedCalc: invoiced,
      totalPaidCalc: paid,
      balanceCalc: balance
    };
  });

  const filteredBalances = clientBalances.filter(c => {
    if (balanceFilter === 'WITH_BALANCE') return c.balanceCalc > 0;
    if (balanceFilter === 'SETTLED') return c.balanceCalc === 0;
    return true;
  });

  const filteredPayments = payments.filter(p => {
    if (methodFilter === 'ALL') return true;
    return p.method.includes(methodFilter);
  });

  const exportCSV = () => {
    const headers = ['تاريخ الدفعة', 'العميل', 'المبلغ', 'طريقة الدفع', 'رقم المعاملة', 'الفاتورة', 'ملاحظات'];
    const rows = payments.map(p => [
      p.paymentDate,
      `"${p.clientName}"`,
      p.amount,
      `"${p.method}"`,
      `"${p.referenceNumber || ''}"`,
      `"${p.invoiceNumber || ''}"`,
      `"${p.notes || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AG_media_payments_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#134C5C] text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" />
              <span>مراجع الحسابات والدفتر المالي • AG-media</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">المراجعة والتدقيق المالي الشامل</h2>
            <p className="text-xs text-slate-500">
              مطابقة الفواتير، التحصيلات الفعلية، أرصدة العملاء والديون المستحقة، وتحليل عوائد قنوات الاستقطاب.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenTreasury}
              className="px-4 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold flex items-center gap-2 transition shadow-sm"
              title="سحب أرباح، مصروفات تشغيل، أو تصفير وتسوية الخزينة"
            >
              <Wallet className="w-4 h-4" />
              <span>حركة الخزينة والمسحوبات</span>
              {(metrics.treasuryBalance !== undefined ? metrics.treasuryBalance : metrics.totalCollected) > 0 && (
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                  {(metrics.treasuryBalance !== undefined ? metrics.treasuryBalance : metrics.totalCollected)?.toLocaleString()} {currency}
                </span>
              )}
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>تصدير دفتر المقبوضات (CSV)</span>
            </button>
          </div>
        </div>

        {/* Audit 5 KPI Cards including Treasury Cash */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-100">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">إجمالي التعاقدات الموقعة</span>
            <div className="text-xl font-black text-slate-900 mt-1 font-mono">
              {(metrics.totalContracted || 0).toLocaleString()} <span className="text-xs text-slate-400">{currency}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">إجمالي الفواتير الصادرة</span>
            <div className="text-xl font-black text-[#134C5C] mt-1 font-mono">
              {(metrics.totalInvoiced || 0).toLocaleString()} <span className="text-xs text-slate-400">{currency}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">المحصل التراكمي (المبيعات)</span>
            <div className="text-xl font-black text-emerald-600 mt-1 font-mono">
              {(metrics.totalCollected || 0).toLocaleString()} <span className="text-xs text-slate-400">{currency}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">تاريخي لا ينقص لتوثيق المبيعات</p>
          </div>

          {/* Treasury Cash Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-900 font-bold">المتاح بالخزينة (Cash on Hand)</span>
              <button 
                onClick={onOpenTreasury}
                className="text-[10px] font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 px-2 py-0.5 rounded transition"
              >
                تسوية / سحب
              </button>
            </div>
            <div className="text-xl font-black text-sky-700 mt-1 font-mono">
              {(metrics.treasuryBalance !== undefined ? metrics.treasuryBalance : metrics.totalCollected || 0).toLocaleString()} <span className="text-xs text-sky-500">{currency}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {(metrics.treasuryBalance !== undefined ? metrics.treasuryBalance : metrics.totalCollected) === 0 ? '✓ مصفّرة بالكامل' : 'جاهز للتسوية والسحب'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">صافي المستحقات (بالسوق)</span>
            <div className="text-xl font-black text-amber-600 mt-1 font-mono">
              {(metrics.outstandingReceivables || 0).toLocaleString()} <span className="text-xs text-slate-400">{currency}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">تتصفر فوراً بمجرد سداد العميل</p>
          </div>

        </div>
      </div>

      {/* Client Balances Ledger ("من عليه فلوس؟") */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <span>كشف أرصدة العملاء والمديونيات المستحقة</span>
            </h3>
            <p className="text-xs text-slate-500">مطابقة حساب كل عميل لمعرفة المبالغ المسددة والمتبقية</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">تصفية الأرصدة:</span>
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع العملاء</option>
              <option value="WITH_BALANCE">عملاء عليهم مستحقات فقط</option>
              <option value="SETTLED">عملاء مسددين بالكامل</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/60">
                <th className="py-3 px-3">العميل / الشركة</th>
                <th className="py-3 px-3">طريقة الاستقطاب</th>
                <th className="py-3 px-3 text-center">قيمة التعاقد</th>
                <th className="py-3 px-3 text-center">إجمالي المفَوْتَر</th>
                <th className="py-3 px-3 text-center">المدفوع نقداً</th>
                <th className="py-3 px-3 text-center">المتبقي (المستحق)</th>
                <th className="py-3 px-3 text-center">موقف السداد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBalances.map((client) => {
                const hasBalance = client.balanceCalc > 0;
                return (
                  <tr key={client.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{client.name}</div>
                      {client.companyName && (
                        <div className="text-[11px] text-slate-500">{client.companyName}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {client.acquisitionChannel}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800 font-mono">
                      {(client.contractValue || 0).toLocaleString()} {currency}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-600 font-mono">
                      {client.totalInvoicedCalc.toLocaleString()} {currency}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-600 font-mono">
                      {client.totalPaidCalc.toLocaleString()} {currency}
                    </td>
                    <td className="py-3.5 px-3 text-center font-black">
                      <span className={hasBalance ? 'text-amber-600 font-mono text-sm' : 'text-slate-400 font-mono'}>
                        {client.balanceCalc.toLocaleString()} {currency}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        hasBalance 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {hasBalance ? 'عليه مستحقات' : 'مسدد بالكامل ✓'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Payments Journal (سجل المقبوضات) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>دفتر المقبوضات والتحصيلات النقدية</span>
            </h3>
            <p className="text-xs text-slate-500">سجل كافة المعاملات والمبالغ التي دخلت حسابات AG-media</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">طريقة الدفع:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع الطرق</option>
              {paymentMethods.length > 0 ? (
                paymentMethods.map(pm => (
                  <option key={pm.id} value={pm.name}>{pm.name}</option>
                ))
              ) : (
                <>
                  <option value="إنستاباي">إنستاباي (InstaPay)</option>
                  <option value="فودافون">فودافون كاش</option>
                  <option value="بنكي">تحويل بنكي</option>
                  <option value="نقدي">دفع نقدي</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/60">
                <th className="py-3 px-3">التاريخ</th>
                <th className="py-3 px-3">العميل</th>
                <th className="py-3 px-3">الفاتورة المرتبطة</th>
                <th className="py-3 px-3">طريقة الاستلام</th>
                <th className="py-3 px-3">الرقم المرجعي</th>
                <th className="py-3 px-3 text-center">المبلغ المستلم</th>
                <th className="py-3 px-3 text-left">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">لا توجد مدفوعات مسجلة</td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-mono text-slate-600">{p.paymentDate}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900">{p.clientName}</span>
                      {p.companyName && <span className="text-[11px] text-slate-500 mr-1.5">({p.companyName})</span>}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[#134C5C] bg-teal-50 px-2 py-0.5 rounded text-[11px] border border-teal-200 font-semibold">
                        {p.invoiceNumber || 'بدون فاتورة'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">{p.method}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">{p.referenceNumber || '-'}</td>
                    <td className="py-3.5 px-3 text-center font-black text-emerald-600 font-mono text-sm">
                      +{Number(p.amount).toLocaleString()} {currency}
                    </td>
                    <td className="py-3.5 px-3 text-left">
                      <button
                        title="حذف هذه الدفعة"
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف هذه الدفعة بقيمة ${p.amount}؟`)) {
                            onDeletePayment(p.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acquisition Channels Financial Performance */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#134C5C]" />
            <span>كفاءة وعائد طرق استقطاب العملاء (ROI Analysis)</span>
          </h3>
          <p className="text-xs text-slate-500">
            تحليل مالي يوضح أي القنوات التسويقية تحقق أعلى حجم تعاقدات وأعلى تحصيل نقدي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {channelBreakdown.map((ch, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">{ch.channel}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-[#134C5C] font-bold border border-teal-200">
                  {ch.count} عملاء
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>إجمالي التعاقدات:</span>
                  <span className="font-bold text-slate-800 font-mono">{ch.contractTotal.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>المحصل نقداً:</span>
                  <span className="font-bold text-emerald-600 font-mono">{ch.collectedTotal.toLocaleString()} {currency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
