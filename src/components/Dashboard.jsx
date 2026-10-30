import React from 'react';
import { 
  Users, 
  TrendingUp, 
  FileCheck, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Palette, 
  Video, 
  Sparkles, 
  Cpu, 
  Layers, 
  ChevronLeft, 
  CheckCircle2, 
  Share2, 
  Receipt, 
  Presentation,
  Repeat,
  Wallet
} from 'lucide-react';

export default function Dashboard({ 
  summaryData, 
  clients, 
  deliverables, 
  invoices, 
  quotations = [], 
  proposals = [], 
  payments, 
  currency = 'ج.م',
  onNavigateTab,
  onOpenClientDetails,
  onNewClient,
  onNewInvoice,
  onNewQuotation,
  onNewProposal,
  onOpenTreasury
}) {
  const metrics = summaryData?.metrics || {};
  const channelBreakdown = summaryData?.channelBreakdown || [];
  const serviceBreakdown = summaryData?.serviceBreakdown || [];

  const getServiceIcon = (serviceName) => {
    switch (serviceName) {
      case 'تصميم جرافيك':
        return <Palette className="w-5 h-5 text-pink-600" />;
      case 'مونتاج فيديوهات وتصويرها':
        return <Video className="w-5 h-5 text-[#134C5C]" />;
      case 'عمل فيديوهات موشن جرافيك':
        return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'عمل فيديوهات ai':
        return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'انشاء الاعلانات المموله':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      default:
        return <Layers className="w-5 h-5 text-[#134C5C]" />;
    }
  };

  const activeDeliverables = deliverables
    .filter(d => d.status === 'قيد التنفيذ' || d.status === 'قيد المراجعة')
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome & Banner in Light Theme with AG-media Petrol Teal accents */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#134C5C]/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#134C5C]/10 border border-[#134C5C]/20 text-[#134C5C] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>لوحة التحكم الإدارية • AG-media CRM</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                وكالة AG-media
              </h2>
              <span className="text-sm md:text-base text-[#134C5C] font-mono tracking-tight font-bold bg-[#134C5C]/10 px-3 py-1 rounded-xl">
                we create your thinking
              </span>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
              إدارة متكاملة للعملاء، متابعة إنجاز المخرجات والمهام، إعداد عروض الأسعار (Quotations)، وتجهيز العروض التقديمية (Pitch Decks) المخصصة لكل حملة وكل عميل، مع الفوترة والتدقيق المالي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNewQuotation}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>+ عرض سعر</span>
            </button>
            <button
              onClick={onNewProposal}
              className="px-4 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-md shadow-[#134C5C]/20 transition flex items-center gap-1.5"
            >
              <Presentation className="w-4 h-4" />
              <span>+ عرض تقديمي</span>
            </button>
            <button
              onClick={onNewInvoice}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
            >
              <span>+ فاتورة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Contract Value */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">إجمالي قيمة التعاقدات</span>
            <div className="p-2.5 rounded-xl bg-[#134C5C]/10 text-[#134C5C]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {(metrics.totalContracted || 0).toLocaleString()} <span className="text-xs font-semibold text-slate-500">{currency}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">{metrics.activeClients || 0} عملاء نشطين</span>
              <span>من أصل {metrics.totalClients || 0}</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Total Collected Cash & Treasury Balance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">المحصل التراكمي (المبيعات)</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-600 font-mono">
              {(metrics.totalCollected || 0).toLocaleString()} <span className="text-xs font-semibold text-slate-500">{currency}</span>
            </div>
            
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                المتاح بالخزينة: <strong className="text-sky-700 font-mono">{(metrics.treasuryBalance !== undefined ? metrics.treasuryBalance : metrics.totalCollected || 0).toLocaleString()} {currency}</strong>
              </div>
              <button
                onClick={onOpenTreasury}
                className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 hover:bg-[#134C5C] hover:text-white font-bold transition"
              >
                تسوية / سحب
              </button>
            </div>
          </div>
        </div>

        {/* Metric 3: Outstanding Receivables */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">المستحقات المعلقة (بالسوق)</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-amber-600 font-mono">
              {(metrics.outstandingReceivables || 0).toLocaleString()} <span className="text-xs font-semibold text-slate-500">{currency}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              مبالغ متبقية على العملاء
            </p>
          </div>
        </div>

        {/* Metric 4: Deliverables Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">المخرجات المكتملة</span>
            <div className="p-2.5 rounded-xl bg-[#134C5C]/10 text-[#134C5C]">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {metrics.completedDeliverables || 0}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                من إجمالي {metrics.totalDeliverables || 0} مخرج
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#134C5C] h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${metrics.totalDeliverables ? Math.round((metrics.completedDeliverables / metrics.totalDeliverables) * 100) : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Monthly Retainers Summary Banner */}
      {(() => {
        const monthlyClients = clients.filter(c => !c.contractType || c.contractType === 'monthly');
        const activeMonthlyClients = monthlyClients.filter(c => c.status === 'نشط' && c.subscriptionStatus !== 'paused' && c.subscriptionStatus !== 'terminated');
        const monthlyRecurringRevenue = activeMonthlyClients.reduce((sum, c) => sum + (Number(c.monthlyRetainerFee) || Number(c.contractValue) || 0), 0);

        return (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/90 via-sky-50/40 to-white border border-teal-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#134C5C] text-white flex items-center justify-center shadow-sm">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    عقود الاشتراكات الشهرية المستمرة (Monthly Retainers)
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-[#134C5C] font-bold">
                    {activeMonthlyClients.length} عملاء نشطين 🔁
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  إجمالي العائد الشهري المتكرر المتوقع (MRR): <strong className="text-emerald-700 font-mono font-bold">{monthlyRecurringRevenue.toLocaleString()} {currency} / شهرياً</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('clients')}
                className="px-4 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <span>إدارة وتجديد الاشتراكات</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* Services Performance & Work Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Services Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>توزيع خدمات ومخرجات AG-media</span>
              </h3>
              <p className="text-xs text-slate-500">
                حجم العمل المنجز والمتبقي في كل خدمة من خدمات الوكالة الخمس
              </p>
            </div>
            <button 
              onClick={() => onNavigateTab('deliverables')}
              className="text-xs font-semibold text-[#134C5C] hover:underline flex items-center gap-1"
            >
              <span>تفاصيل المخرجات</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceBreakdown.map((srv, idx) => {
              const percent = srv.totalUnits > 0 ? Math.round((srv.completedUnits / srv.totalUnits) * 100) : 0;
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                        {getServiceIcon(srv.service)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{srv.service}</h4>
                        <span className="text-[11px] text-slate-500">
                          {srv.deliverablesCount} مهام / عقود
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#134C5C] font-mono">
                      {percent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>المنجز: <strong className="text-slate-800 font-mono">{srv.completedUnits}</strong></span>
                      <span>الإجمالي: <strong className="text-slate-800 font-mono">{srv.totalUnits}</strong></span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#134C5C] h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {srv.revenueEstimated > 0 && (
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                      <span>إجمالي العائد:</span>
                      <span className="font-bold text-emerald-600 font-mono">{srv.revenueEstimated.toLocaleString()} {currency}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Acquisition Channels */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#134C5C]" />
                <span>طرق استقطاب العملاء</span>
              </h3>
              <p className="text-xs text-slate-500">القنوات الأكثر جلباً للمشاريع والأرباح</p>
            </div>
            <button 
              onClick={() => onNavigateTab('clients')}
              className="text-xs font-semibold text-[#134C5C] hover:underline flex items-center gap-1"
            >
              <span>العملاء</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {channelBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">لا توجد بيانات كافية</p>
            ) : (
              channelBreakdown
                .sort((a, b) => b.contractTotal - a.contractTotal)
                .map((ch, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[160px]">
                        {ch.channel}
                      </span>
                      <span className="text-xs font-black text-emerald-600 font-mono">
                        {ch.contractTotal.toLocaleString()} {currency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{ch.count} عملاء</span>
                      <span>تم تحصيل: {ch.collectedTotal.toLocaleString()} {currency}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

      </div>

      {/* Active Work & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Deliverables */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>أعمال قيد التنفيذ والمراجعة الآن</span>
              </h3>
              <p className="text-xs text-slate-500">مخرجات جارية تحتاج إلى إنجاز وتسليم</p>
            </div>
            <button 
              onClick={() => onNavigateTab('deliverables')}
              className="text-xs font-semibold text-[#134C5C] hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-3">
            {activeDeliverables.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                لا توجد أعمال قيد التنفيذ حالياً، جميع المخرجات مكتملة!
              </div>
            ) : (
              activeDeliverables.map(del => {
                const percent = Math.round((del.quantityCompleted / del.quantityTotal) * 100);
                return (
                  <div 
                    key={del.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            del.status === 'قيد التنفيذ' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-cyan-100 text-cyan-800'
                          }`}>
                            {del.status}
                          </span>
                          <span className="text-xs text-[#134C5C] font-semibold">{del.serviceType}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{del.title}</h4>
                        <p className="text-[11px] text-slate-500">العميل: {del.clientName} ({del.companyName})</p>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="text-xs font-bold text-slate-800 font-mono">{del.quantityCompleted} / {del.quantityTotal}</span>
                        <span className="text-[10px] text-slate-500 block">{del.unit}</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          del.status === 'قيد التنفيذ' ? 'bg-amber-500' : 'bg-[#134C5C]'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Payments Received */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>أحدث الدفعات المستلمة</span>
              </h3>
              <p className="text-xs text-slate-500">سجل المقبوضات النقدية والتحويلات</p>
            </div>
            <button 
              onClick={() => onNavigateTab('auditor')}
              className="text-xs font-semibold text-[#134C5C] hover:underline"
            >
              سجل الحسابات
            </button>
          </div>

          <div className="space-y-3">
            {payments.slice(0, 5).map(pay => (
              <div 
                key={pay.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{pay.clientName}</span>
                    {pay.companyName && (
                      <span className="text-[11px] text-slate-500">({pay.companyName})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 font-medium border border-slate-200">{pay.method}</span>
                    <span>• {pay.paymentDate}</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-sm font-black text-emerald-600 font-mono">
                    +{Number(pay.amount).toLocaleString()} {currency}
                  </span>
                  {pay.invoiceNumber && (
                    <span className="text-[10px] text-slate-400 block font-mono">{pay.invoiceNumber}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
