import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Plus, 
  Palette, 
  Video, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit, 
  Trash2, 
  X
} from 'lucide-react';

export default function DeliverablesView({
  deliverables,
  clients,
  selectedClientId,
  onClearClientFilter,
  onSaveDeliverable,
  onUpdateDeliverableProgress,
  onDeleteDeliverable
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [clientFilter, setClientFilter] = useState(selectedClientId || 'ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeliverable, setEditingDeliverable] = useState(null);

  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    serviceType: 'تصميم جرافيك',
    title: '',
    description: '',
    quantityTotal: 1,
    quantityCompleted: 0,
    status: 'لم يبدأ',
    unit: 'تصميم',
    dueDate: '',
    notes: ''
  });

  const services = [
    { id: 'ALL', label: 'جميع الخدمات', icon: Layers },
    { id: 'تصميم جرافيك', label: 'تصميم جرافيك', icon: Palette, defaultUnit: 'تصميم' },
    { id: 'مونتاج فيديوهات وتصويرها', label: 'مونتاج وتصوير', icon: Video, defaultUnit: 'فيديو' },
    { id: 'عمل فيديوهات موشن جرافيك', label: 'موشن جرافيك', icon: Sparkles, defaultUnit: 'فيديو' },
    { id: 'عمل فيديوهات ai', label: 'فيديوهات AI', icon: Cpu, defaultUnit: 'فيديو AI' },
    { id: 'انشاء الاعلانات المموله', label: 'إعلانات ممولة', icon: TrendingUp, defaultUnit: 'حملة' }
  ];

  const openCreateModal = () => {
    setEditingDeliverable(null);
    const defaultSrv = selectedService !== 'ALL' ? selectedService : 'تصميم جرافيك';
    const foundSrv = services.find(s => s.id === defaultSrv);
    setFormData({
      clientId: clientFilter !== 'ALL' ? clientFilter : (clients[0]?.id || ''),
      serviceType: defaultSrv,
      title: '',
      description: '',
      quantityTotal: 1,
      quantityCompleted: 0,
      status: 'لم يبدأ',
      unit: foundSrv?.defaultUnit || 'عنصر',
      dueDate: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (del) => {
    setEditingDeliverable(del);
    setFormData({
      clientId: del.clientId,
      serviceType: del.serviceType,
      title: del.title,
      description: del.description || '',
      quantityTotal: del.quantityTotal || 1,
      quantityCompleted: del.quantityCompleted || 0,
      status: del.status || 'لم يبدأ',
      unit: del.unit || 'عنصر',
      dueDate: del.dueDate || '',
      notes: del.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('يرجى إدخال عنوان العمل/المخرج');
    if (!formData.clientId) return alert('يرجى اختيار العميل');

    await onSaveDeliverable(formData, editingDeliverable ? editingDeliverable.id : null);
    setIsModalOpen(false);
  };

  const handleQuickIncrement = (del, amount) => {
    const newQty = Math.max(0, Math.min(del.quantityTotal, (Number(del.quantityCompleted) || 0) + amount));
    const newStatus = newQty === del.quantityTotal ? 'تم التسليم' : (newQty > 0 ? 'قيد التنفيذ' : 'لم يبدأ');
    onUpdateDeliverableProgress(del.id, {
      quantityCompleted: newQty,
      status: newStatus
    });
  };

  const handleStatusChange = (del, newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === 'تم التسليم') {
      updates.quantityCompleted = del.quantityTotal;
    }
    onUpdateDeliverableProgress(del.id, updates);
  };

  // Filter deliverables
  const filtered = deliverables.filter(d => {
    const matchesSearch = 
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.clientName && d.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.companyName && d.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesService = selectedService === 'ALL' || d.serviceType === selectedService;
    const matchesStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
    const matchesClient = clientFilter === 'ALL' || d.clientId === clientFilter;

    return matchesSearch && matchesService && matchesStatus && matchesClient;
  });

  const getServiceColor = (srv) => {
    switch (srv) {
      case 'تصميم جرافيك': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'مونتاج فيديوهات وتصويرها': return 'text-[#134C5C] bg-teal-50 border-teal-200';
      case 'عمل فيديوهات موشن جرافيك': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'عمل فيديوهات ai': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'انشاء الاعلانات المموله': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Service Category Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {services.map((srv) => {
          const Icon = srv.icon;
          const isActive = selectedService === srv.id;
          return (
            <button
              key={srv.id}
              onClick={() => setSelectedService(srv.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                isActive
                  ? 'bg-[#134C5C] text-white border-[#134C5C] shadow-sm shadow-[#134C5C]/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{srv.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="البحث في المخرجات، المهام، أو اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#134C5C] transition"
          />
        </div>

        {/* Filters and Add button */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">العميل:</span>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع العملاء</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.companyName ? `(${c.companyName})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">الحالة:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="لم يبدأ">لم يبدأ</option>
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="تم التسليم">تم التسليم</option>
            </select>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-sm shadow-[#134C5C]/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مخرج / عمل</span>
          </button>

        </div>
      </div>

      {/* Deliverables Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">لا توجد مخرجات مسجلة بهذا الفلتر</h4>
            <p className="text-xs text-slate-400 mt-1">يمكنك إضافة مخرج جديد لأي عميل بنقرة زر</p>
          </div>
        ) : (
          filtered.map((del) => {
            const percent = del.quantityTotal > 0 
              ? Math.round((del.quantityCompleted / del.quantityTotal) * 100) 
              : 0;

            const isDone = del.status === 'تم التسليم' || del.quantityCompleted >= del.quantityTotal;

            return (
              <div
                key={del.id}
                className={`p-5 rounded-2xl bg-white border transition duration-200 hover:shadow-md space-y-4 shadow-sm ${
                  isDone 
                    ? 'border-emerald-300' 
                    : del.status === 'قيد التنفيذ'
                    ? 'border-amber-300'
                    : 'border-slate-200'
                }`}
              >
                
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${getServiceColor(del.serviceType)}`}>
                      {del.serviceType}
                    </span>

                    <span className="text-xs text-slate-400">العميل:</span>
                    <strong className="text-xs text-slate-800 font-bold">{del.clientName}</strong>
                    {del.companyName && (
                      <span className="text-xs text-slate-500 font-medium">({del.companyName})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {del.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-[#134C5C]" />
                        <span>موعد التسليم: <strong className="text-slate-800">{del.dueDate}</strong></span>
                      </div>
                    )}

                    <select
                      value={del.status}
                      onChange={(e) => handleStatusChange(del, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-xl font-bold border focus:outline-none ${
                        del.status === 'تم التسليم'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : del.status === 'قيد التنفيذ'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : del.status === 'قيد المراجعة'
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="لم يبدأ">لم يبدأ</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="قيد المراجعة">قيد المراجعة</option>
                      <option value="تم التسليم">تم التسليم</option>
                    </select>

                    <button
                      title="تعديل المخرج"
                      onClick={() => openEditModal(del)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      title="حذف المخرج"
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف المخرج "${del.title}"؟`)) {
                          onDeleteDeliverable(del.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    <span>{del.title}</span>
                  </h3>
                  {del.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{del.description}</p>
                  )}
                </div>

                {/* Progress Tracking Bar & Steppers */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">ما تم عمله:</span>
                      <strong className="text-sm font-black text-slate-900 font-mono">{del.quantityCompleted}</strong>
                      <span className="text-slate-500">من أصل</span>
                      <strong className="text-sm font-black text-slate-900 font-mono">{del.quantityTotal} {del.unit}</strong>
                      <span className="text-slate-500 mr-2 font-mono">({percent}% مكتمل)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">تحديث الإنجاز:</span>
                      
                      <button
                        onClick={() => handleQuickIncrement(del, -1)}
                        disabled={del.quantityCompleted <= 0}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold flex items-center justify-center transition border border-slate-200 shadow-xs"
                      >
                        -
                      </button>

                      <button
                        onClick={() => handleQuickIncrement(del, 1)}
                        disabled={del.quantityCompleted >= del.quantityTotal}
                        className="w-7 h-7 rounded-lg bg-[#134C5C] hover:bg-[#0f3d4a] disabled:opacity-40 text-white font-bold flex items-center justify-center transition shadow-xs"
                      >
                        +
                      </button>

                      {!isDone && (
                        <button
                          onClick={() => handleStatusChange(del, 'تم التسليم')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>اكتمال الكل</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isDone 
                          ? 'bg-emerald-500' 
                          : del.status === 'قيد التنفيذ'
                          ? 'bg-amber-500'
                          : 'bg-[#134C5C]'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                {del.notes && (
                  <div className="text-[11px] text-slate-600 flex items-start gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-[#134C5C] shrink-0">ملاحظات العمل:</span>
                    <span>{del.notes}</span>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* ----------------- CREATE / EDIT DELIVERABLE MODAL ----------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingDeliverable ? 'تعديل مخرج / مهمة' : 'إضافة مخرج عمل جديد للعميل'}
                </h3>
                <p className="text-xs text-slate-500">
                  حدد الخدمة، الكمية المتفق عليها، وتاريخ التسليم
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  العميل المتفق معه *
                </label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                >
                  <option value="">-- اختر العميل --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.companyName ? `(${c.companyName})` : ''}
                    </option>
                  ))}
                </select>
                {formData.serviceType === 'انشاء الاعلانات المموله' && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>لحساب ميزانية الإعلان مع ضريبة 14% والعمولة تلقائياً وإصدار فاتورة بها، استخدم حاسبة الإعلانات في قسم الفواتير.</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  نوع الخدمة (AG-media Service) *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => {
                    const srvName = e.target.value;
                    const found = services.find(s => s.id === srvName);
                    setFormData({ 
                      ...formData, 
                      serviceType: srvName,
                      unit: found?.defaultUnit || formData.unit
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                >
                  <option value="تصميم جرافيك">تصميم جرافيك (بوستات، بنرات، هوية...)</option>
                  <option value="مونتاج فيديوهات وتصويرها">مونتاج فيديوهات وتصويرها (ريلز، تيك توك، بودكاست...)</option>
                  <option value="عمل فيديوهات موشن جرافيك">عمل فيديوهات موشن جرافيك (فيديوهات توضيحية، إعلانات...)</option>
                  <option value="عمل فيديوهات ai">عمل فيديوهات AI (أفاتار، محاكاة صوتية، مؤثرات سينمائية...)</option>
                  <option value="انشاء الاعلانات المموله">انشاء الاعلانات المموله (فيسبوك، إنستجرام، تيك توك...)</option>
                </select>
                {formData.serviceType === 'انشاء الاعلانات المموله' && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 mt-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>لحساب ميزانية الإعلان مع ضريبة 14% والعمولة تلقائياً وإصدار فاتورة بها، استخدم حاسبة الإعلانات في قسم الفواتير.</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  عنوان المخرج / المهمة *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تصميم 12 بوست سوشيال ميديا للمنتجات الجديدة"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    العدد الإجمالي المطلوب
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantityTotal}
                    onChange={(e) => setFormData({ ...formData, quantityTotal: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ما تم إنجازه حالياً
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantityCompleted}
                    onChange={(e) => setFormData({ ...formData, quantityCompleted: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    وحدة القياس
                  </label>
                  <input
                    type="text"
                    placeholder="تصميم / فيديو"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    الحالة الحالية
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  >
                    <option value="لم يبدأ">لم يبدأ</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="قيد المراجعة">قيد المراجعة</option>
                    <option value="تم التسليم">تم التسليم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    موعد التسليم المتفق عليه
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  تفاصيل المخرج وسكوب العمل
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-sm shadow-[#134C5C]/20 transition"
                >
                  {editingDeliverable ? 'حفظ التعديلات' : 'إضافة المخرج'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
