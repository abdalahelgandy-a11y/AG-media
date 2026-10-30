import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Share2, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink, 
  ChevronLeft, 
  FileText, 
  AlertCircle, 
  X, 
  FileCheck, 
  Receipt, 
  Presentation,
  RefreshCw,
  Printer,
  Sparkles,
  Award,
  Star,
  MessageSquare,
  Check,
  Copy,
  Layers,
  CheckSquare,
  Repeat,
  PauseCircle,
  PlayCircle,
  StopCircle,
  Wallet,
  Palette,
  Video,
  Cpu,
  TrendingUp,
  Table,
  LayoutGrid
} from 'lucide-react';
import MonthlyCycleModal from './MonthlyCycleModal';
import MonthlyPaymentModal from './MonthlyPaymentModal';
import SubscriptionStatusModal from './SubscriptionStatusModal';

const CORE_SERVICES = [
  { 
    id: 'تصميم جرافيك', 
    name: 'تصميم جرافيك', 
    defaultQuantity: 12, 
    defaultUnit: 'تصميم', 
    defaultTitle: 'تصاميم وبوستات السوشيال ميديا',
    icon: Palette,
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200' 
  },
  { 
    id: 'مونتاج فيديوهات وتصويرها', 
    name: 'مونتاج وتصوير', 
    fullName: 'مونتاج فيديوهات وتصويرها',
    defaultQuantity: 4, 
    defaultUnit: 'فيديو', 
    defaultTitle: 'فيديوهات ريلز وتصوير ميداني',
    icon: Video,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' 
  },
  { 
    id: 'عمل فيديوهات موشن جرافيك', 
    name: 'موشن جرافيك', 
    fullName: 'عمل فيديوهات موشن جرافيك',
    defaultQuantity: 2, 
    defaultUnit: 'فيديو', 
    defaultTitle: 'فيديوهات موشن جرافيك',
    icon: Sparkles,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' 
  },
  { 
    id: 'عمل فيديوهات ai', 
    name: 'فيديوهات AI', 
    fullName: 'عمل فيديوهات ai',
    defaultQuantity: 4, 
    defaultUnit: 'فيديو AI', 
    defaultTitle: 'فيديوهات ذكاء اصطناعي وتوليد بصري',
    icon: Cpu,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' 
  },
  { 
    id: 'انشاء الاعلانات المموله', 
    name: 'إعلانات ممولة', 
    fullName: 'انشاء الاعلانات المموله',
    defaultQuantity: 1, 
    defaultUnit: 'حملة', 
    defaultTitle: 'إدارة وتحسين الحملات الإعلانية',
    icon: TrendingUp,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' 
  }
];

export default function ClientsView({
  clients,
  deliverables,
  invoices,
  quotations = [],
  proposals = [],
  payments,
  paymentMethods = [],
  currency = 'ج.م',
  channelsList = [],
  servicesList = [],
  onSaveClient,
  onRenewClient,
  onUpdateSubscriptionStatus,
  onPayMonthlyCycle,
  onDeleteClient,
  onOpenNewInvoiceForClient,
  onOpenNewQuotationForClient,
  onOpenNewProposalForClient,
  onOpenDeliverablesForClient,
  onUpdateDeliverableProgress
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterContractType, setFilterContractType] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (بطاقات) | 'matrix' (مصفوفة شاملة)
  
  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClientForView, setSelectedClientForView] = useState(null);

  // Completed Work History Modal State
  const [isWorkHistoryModalOpen, setIsWorkHistoryModalOpen] = useState(false);
  const [clientForWorkHistory, setClientForWorkHistory] = useState(null);
  const [historyServiceFilter, setHistoryServiceFilter] = useState('ALL');

  // Renew Monthly Cycle Modal State
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [clientToRenew, setClientToRenew] = useState(null);

  // Pay Monthly Cycle State
  const [isPayCycleModalOpen, setIsPayCycleModalOpen] = useState(false);
  const [clientToPay, setClientToPay] = useState(null);
  const [invoiceToPay, setInvoiceToPay] = useState(null);

  // Subscription Status Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [clientForStatus, setClientForStatus] = useState(null);

  const [copiedNotification, setCopiedNotification] = useState(false);
  const [copiedReviewNotification, setCopiedReviewNotification] = useState(false);

  const defaultServiceQuantities = {
    'تصميم جرافيك': { enabled: true, quantityTotal: 12, unit: 'تصميم', title: 'تصاميم وبوستات السوشيال ميديا', notes: '' },
    'مونتاج فيديوهات وتصويرها': { enabled: true, quantityTotal: 4, unit: 'فيديو', title: 'فيديوهات ريلز وتصوير ميداني', notes: '' },
    'عمل فيديوهات موشن جرافيك': { enabled: false, quantityTotal: 2, unit: 'فيديو', title: 'فيديوهات موشن جرافيك', notes: '' },
    'عمل فيديوهات ai': { enabled: false, quantityTotal: 4, unit: 'فيديو AI', title: 'فيديوهات ذكاء اصطناعي وتوليد بصري', notes: '' },
    'انشاء الاعلانات المموله': { enabled: false, quantityTotal: 1, unit: 'حملة', title: 'إدارة وتحسين الحملات الإعلانية', notes: '' }
  };

  // Helper to get client deliverables for each core service
  const getClientServiceDeliverables = (clientId) => {
    const clientDels = deliverables.filter(d => d.clientId === clientId);
    return CORE_SERVICES.map(coreSrv => {
      const matchingDel = clientDels.find(d => 
        d.serviceType === coreSrv.id || 
        d.serviceType === coreSrv.fullName || 
        (d.serviceType && d.serviceType.includes(coreSrv.id))
      );
      return {
        core: coreSrv,
        deliverable: matchingDel || null,
        quantityCompleted: matchingDel ? (Number(matchingDel.quantityCompleted) || 0) : 0,
        quantityTotal: matchingDel ? (Number(matchingDel.quantityTotal) || 0) : 0,
        unit: matchingDel ? (matchingDel.unit || coreSrv.defaultUnit) : coreSrv.defaultUnit,
        hasService: Boolean(matchingDel)
      };
    });
  };

  // Quick 1-click delivery increment
  const handleQuickIncrementDelivery = async (deliverable, client, e) => {
    if (e) e.stopPropagation();
    if (!deliverable) return;
    const currentCompleted = Number(deliverable.quantityCompleted) || 0;
    const total = Number(deliverable.quantityTotal) || 1;
    const newCompleted = currentCompleted + 1;
    const newStatus = newCompleted >= total ? 'تم التسليم' : 'قيد التنفيذ';

    if (onUpdateDeliverableProgress) {
      await onUpdateDeliverableProgress(deliverable.id, {
        quantityCompleted: newCompleted,
        status: newStatus
      });
    }
  };

  // Form state for Create / Edit Client
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    acquisitionChannel: channelsList[0] || 'إعلانات ممولة (Facebook / Instagram)',
    startDate: new Date().toISOString().split('T')[0],
    contractType: 'monthly', // 'monthly' | 'project'
    contractValue: '',
    monthlyRetainerFee: '',
    billingDay: 1,
    status: 'نشط',
    subscriptionStatus: 'active',
    notes: '',
    servicesAgreed: ['تصميم جرافيك', 'مونتاج فيديوهات وتصويرها'],
    serviceQuantities: { ...defaultServiceQuantities }
  });

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      companyName: '',
      phone: '',
      email: '',
      acquisitionChannel: channelsList[0] || 'إعلانات ممولة (Facebook / Instagram)',
      startDate: new Date().toISOString().split('T')[0],
      contractType: 'monthly',
      contractValue: '',
      monthlyRetainerFee: '',
      billingDay: 1,
      status: 'نشط',
      subscriptionStatus: 'active',
      notes: '',
      servicesAgreed: ['تصميم جرافيك', 'مونتاج فيديوهات وتصويرها'],
      serviceQuantities: { ...defaultServiceQuantities }
    });
    setIsClientModalOpen(true);
  };

  const openEditModal = (client, e) => {
    if (e) e.stopPropagation();
    // Close the details modal so the edit form opens cleanly on top without layering
    setSelectedClientForView(null);
    setEditingClient(client);

    const clientDels = deliverables.filter(d => d.clientId === client.id);
    const populatedSQ = {};

    // Check if client has an explicitly configured services list
    const hasExplicitAgreedList = Array.isArray(client.servicesAgreed) && client.servicesAgreed.length > 0;

    CORE_SERVICES.forEach(srv => {
      const matchDel = clientDels.find(d => d.serviceType === srv.id || d.serviceType === srv.fullName || (d.serviceType && d.serviceType.includes(srv.id)));
      const matchPkg = client.monthlyPackage?.find(p => p.serviceType === srv.id || p.serviceType === srv.fullName);
      const matchSQ = client.serviceQuantities?.find(s => s.serviceType === srv.id || s.serviceType === srv.fullName);

      // Determine active status strictly based on client agreement
      let isEnabled = false;
      if (hasExplicitAgreedList) {
        isEnabled = client.servicesAgreed.includes(srv.id) || client.servicesAgreed.includes(srv.fullName);
      } else if (Array.isArray(client.serviceQuantities) && client.serviceQuantities.length > 0) {
        isEnabled = client.serviceQuantities.some(s => (s.serviceType === srv.id || s.serviceType === srv.fullName) && s.enabled !== false);
      } else if (Array.isArray(client.monthlyPackage) && client.monthlyPackage.length > 0) {
        isEnabled = client.monthlyPackage.some(p => p.serviceType === srv.id || p.serviceType === srv.fullName);
      } else {
        isEnabled = Boolean(matchDel);
      }

      populatedSQ[srv.id] = {
        enabled: Boolean(isEnabled),
        quantityTotal: matchDel?.quantityTotal || matchPkg?.quantityTotal || matchSQ?.quantityTotal || srv.defaultQuantity,
        unit: matchDel?.unit || matchPkg?.unit || matchSQ?.unit || srv.defaultUnit,
        title: matchDel?.title || matchPkg?.title || matchSQ?.title || srv.defaultTitle,
        notes: matchDel?.notes || matchPkg?.notes || matchSQ?.notes || ''
      };
    });

    setFormData({
      name: client.name || '',
      companyName: client.companyName || '',
      phone: client.phone || '',
      email: client.email || '',
      acquisitionChannel: client.acquisitionChannel || channelsList[0] || '',
      startDate: client.startDate || new Date().toISOString().split('T')[0],
      contractType: client.contractType || 'monthly',
      contractValue: client.contractValue || '',
      monthlyRetainerFee: client.monthlyRetainerFee !== undefined ? client.monthlyRetainerFee : (client.contractValue || ''),
      billingDay: client.billingDay || 1,
      status: client.status || 'نشط',
      subscriptionStatus: client.subscriptionStatus || (client.status === 'مكتمل' ? 'terminated' : 'active'),
      notes: client.notes || '',
      servicesAgreed: client.servicesAgreed || [],
      serviceQuantities: populatedSQ
    });
    setIsClientModalOpen(true);
  };

  const openWorkHistoryModal = (client, e) => {
    if (e) e.stopPropagation();
    setClientForWorkHistory(client);
    setHistoryServiceFilter('ALL');
    setIsWorkHistoryModalOpen(true);
  };

  const openRenewModal = (client, e) => {
    if (e) e.stopPropagation();
    setClientToRenew(client);
    setIsRenewModalOpen(true);
  };

  const openPayCycleModal = (client, e) => {
    if (e) e.stopPropagation();
    setClientToPay(client);
    const unpaid = invoices.find(i => i.clientId === client.id && i.status !== 'مدفوعة بالكامل');
    setInvoiceToPay(unpaid || null);
    setIsPayCycleModalOpen(true);
  };

  const openStatusModal = (client, e) => {
    if (e) e.stopPropagation();
    setClientForStatus(client);
    setIsStatusModalOpen(true);
  };

  const handleRenewSubmit = async (cycleData) => {
    if (!clientToRenew) return;
    await onRenewClient(clientToRenew.id, cycleData);
    setIsRenewModalOpen(false);
    alert(`تم تجديد دورة "${cycleData.monthLabel}" للعميل "${clientToRenew.name}" وإصدار الفاتورة والمخرجات بنجاح! 🚀`);
  };

  const handleAutoCompleteStatus = async (client, e) => {
    if (e) e.stopPropagation();
    await onSaveClient({ ...client, status: 'مكتمل' }, client.id);
    if (selectedClientForView && selectedClientForView.id === client.id) {
      setSelectedClientForView(prev => ({ ...prev, status: 'مكتمل' }));
    }
  };

  const handleServiceToggle = (srvId, explicitState = null) => {
    setFormData(prev => {
      const currentSQ = prev.serviceQuantities?.[srvId] || {
        enabled: false,
        quantityTotal: CORE_SERVICES.find(s => s.id === srvId)?.defaultQuantity || 1,
        unit: CORE_SERVICES.find(s => s.id === srvId)?.defaultUnit || 'عنصر',
        title: CORE_SERVICES.find(s => s.id === srvId)?.defaultTitle || srvId,
        notes: ''
      };

      const newEnabled = explicitState !== null ? Boolean(explicitState) : !currentSQ.enabled;
      const updatedSQ = {
        ...prev.serviceQuantities,
        [srvId]: { ...currentSQ, enabled: newEnabled }
      };

      const coreObj = CORE_SERVICES.find(c => c.id === srvId);
      const updatedAgreed = newEnabled
        ? Array.from(new Set([...(prev.servicesAgreed || []), srvId]))
        : (prev.servicesAgreed || []).filter(s => s !== srvId && s !== coreObj?.fullName);

      return {
        ...prev,
        servicesAgreed: updatedAgreed,
        serviceQuantities: updatedSQ
      };
    });
  };

  const handleServiceQuantityChange = (srvId, field, val) => {
    setFormData(prev => ({
      ...prev,
      serviceQuantities: {
        ...prev.serviceQuantities,
        [srvId]: {
          ...prev.serviceQuantities[srvId],
          [field]: val
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('يرجى كتابة اسم العميل');

    const enabledServices = [];
    const serviceQuantitiesList = [];
    CORE_SERVICES.forEach(srv => {
      const sq = formData.serviceQuantities?.[srv.id];
      if (sq && sq.enabled) {
        enabledServices.push(srv.id);
        serviceQuantitiesList.push({
          serviceType: srv.id,
          quantityTotal: Number(sq.quantityTotal) || 1,
          unit: sq.unit || srv.defaultUnit,
          title: sq.title || srv.defaultTitle,
          notes: sq.notes || ''
        });
      }
    });

    const payload = {
      ...formData,
      servicesAgreed: enabledServices,
      serviceQuantities: serviceQuantitiesList,
      monthlyPackage: serviceQuantitiesList
    };

    await onSaveClient(payload, editingClient ? editingClient.id : null);
    setIsClientModalOpen(false);
    if (selectedClientForView && editingClient && selectedClientForView.id === editingClient.id) {
      setSelectedClientForView(prev => ({ ...prev, ...payload }));
    }
  };

  // WhatsApp Report of All Executed Work
  const handleCopyWorkReportWhatsApp = (client) => {
    const clientDeliverables = deliverables.filter(d => d.clientId === client.id);
    const completed = clientDeliverables.filter(d => d.status === 'تم التسليم' || d.quantityCompleted >= d.quantityTotal);

    let text = `مرحباً ${client.name} 🌹\n`;
    text += `تحياتنا من وكالة *AG-media* ("we create your thinking") ✨\n\n`;
    text += `📊 *تقرير إنجاز الأعمال والمخرجات المنفذة لكم:*\n`;
    text += `--------------------------------------\n`;
    
    if (completed.length === 0) {
      text += `لا توجد مخرجات مكتملة بعد.\n`;
    } else {
      completed.forEach((d, idx) => {
        text += `${idx + 1}. *${d.title}* [${d.serviceType}]\n`;
        text += `   - تم إنجاز: ${d.quantityCompleted} من أصل ${d.quantityTotal} ${d.unit} ✓\n`;
        if (d.description) text += `   - التفاصيل: ${d.description}\n`;
      });
    }

    text += `--------------------------------------\n`;
    text += `✅ إجمالي المخرجات المنفذة: ${completed.length} عمل بنجاح\n`;
    text += `🚀 نسعد دائماً بكوننا شريك نجاحكم الإبداعي والتسويقي!`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // WhatsApp Thank You & Review Request
  const handleCopyReviewRequestWhatsApp = (client) => {
    let text = `مرحباً ${client.name} 🌹\n`;
    text += `سعدنا جداً بالتعاون معكم وإنجاز مشروعكم بنجاح عبر وكالة *AG-media* ("we create your thinking") ✨\n\n`;
    text += `يسعدنا ويشرفنا معرفة رأيك وتقييمك لتجربتك معنا ومدى رضاكم عن جودة المخرجات والتزام المواعيد.\n\n`;
    text += `كما يسعدنا دائماً استقبال ترشيحاتكم لأي شركاء أو معارف يرغبون في تطوير أعمالهم الرقمية والتسويقية. 🚀\n\n`;
    text += `شكراً لثقتكم الغالية ونتطلع دائماً للمزيد من النجاحات المشتركة!`;

    navigator.clipboard.writeText(text);
    setCopiedReviewNotification(true);
    setTimeout(() => setCopiedReviewNotification(false), 2500);
  };

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone && c.phone.includes(searchTerm));

    const matchesChannel = filterChannel === 'ALL' || c.acquisitionChannel === filterChannel;
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesContract = filterContractType === 'ALL' || 
      (filterContractType === 'monthly' && (c.contractType === 'monthly' || !c.contractType)) ||
      (filterContractType === 'project' && c.contractType === 'project');

    return matchesSearch && matchesChannel && matchesStatus && matchesContract;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Bar: Search, Filters & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="البحث باسم العميل، البراند، أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#134C5C] focus:ring-2 focus:ring-[#134C5C]/10 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">نوع العقد:</span>
            <select
              value={filterContractType}
              onChange={(e) => setFilterContractType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع التعاقدات</option>
              <option value="monthly">اشتراكات شهرية 🔁</option>
              <option value="project">مشاريع محددة 📌</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">الاستقطاب:</span>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع القنوات</option>
              {channelsList.map((ch, idx) => (
                <option key={idx} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">حالة العميل:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#134C5C]"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="نشط">نشط (جاري العمل)</option>
              <option value="مكتمل">مكتمل (منتهي الأعمال)</option>
              <option value="معلق">معلق (متوقف مؤقتاً)</option>
            </select>
          </div>

          {/* View Mode Toggle: Cards vs All-in-One Services Matrix */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#134C5C] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="عرض بطاقات العملاء"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>البطاقات</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#134C5C] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="عرض مصفوفة كميات الخدمات لجميع العملاء دفعة واحدة"
            >
              <Table className="w-3.5 h-3.5" />
              <span>مصفوفة الخدمات الشاملة 📊</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-sm shadow-[#134C5C]/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عميل جديد</span>
          </button>

        </div>
      </div>

      {/* View Content: Matrix Table View OR Cards Grid View */}
      {viewMode === 'matrix' ? (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-fadeIn">
          {/* Matrix Header Banner */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Table className="w-4 h-4 text-[#134C5C]" />
                <span>مصفوفة كميات الخدمات وإنجاز الأعمال لكافة العملاء دفعة واحدة</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                عرض مجمع وشامل لكل عميل مع كافة الخدمات المطلوبة منه ونسبة إنجازها وزر تسجيل تسليم سريع
              </p>
            </div>
            <div className="text-xs text-slate-600 font-bold bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              العملاء المعروضون: <span className="font-mono text-[#134C5C] font-black">{filteredClients.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-right border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                  <th className="py-3.5 px-4">العميل / البراند</th>
                  <th className="py-3.5 px-3">التعاقد</th>
                  {CORE_SERVICES.map(s => {
                    const SrvIcon = s.icon;
                    return (
                      <th key={s.id} className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 justify-center">
                          <SrvIcon className="w-3.5 h-3.5 text-[#134C5C]" />
                          <span>{s.name}</span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="py-3.5 px-4 text-center">الإجمالي والتقدم</th>
                  <th className="py-3.5 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={4 + CORE_SERVICES.length} className="py-12 text-center text-slate-400">
                      لا يوجد عملاء مطابقين لخيارات البحث الحالية
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => {
                    const srvDeliverables = getClientServiceDeliverables(client.id);
                    const totalRequired = srvDeliverables.reduce((s, item) => s + (Number(item.quantityTotal) || 0), 0);
                    const totalDone = srvDeliverables.reduce((s, item) => s + (Number(item.quantityCompleted) || 0), 0);
                    const percent = totalRequired > 0 ? Math.round((totalDone / totalRequired) * 100) : 0;

                    return (
                      <tr 
                        key={client.id}
                        className="hover:bg-slate-50/80 transition cursor-pointer"
                        onClick={() => setSelectedClientForView(client)}
                      >
                        {/* Client info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 hover:text-[#134C5C]">
                            {client.name}
                          </div>
                          {client.companyName && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" />
                              <span>{client.companyName}</span>
                            </div>
                          )}
                        </td>

                        {/* Contract Type & Value */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-800 block text-xs">
                            {(client.monthlyRetainerFee || client.contractValue || 0).toLocaleString()} {currency}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {(!client.contractType || client.contractType === 'monthly') ? 'شهري 🔁' : 'مشروع 📌'}
                          </span>
                        </td>

                        {/* Each Core Service Cell */}
                        {srvDeliverables.map((item) => {
                          const hasThisService = item.hasService || client.servicesAgreed?.includes(item.core.id);
                          if (!hasThisService && item.quantityTotal === 0) {
                            return (
                              <td key={item.core.id} className="py-3.5 px-3 text-center text-slate-300 font-mono">
                                -
                              </td>
                            );
                          }

                          const isDone = item.quantityTotal > 0 && item.quantityCompleted >= item.quantityTotal;

                          return (
                            <td key={item.core.id} className="py-3.5 px-3 text-center whitespace-nowrap">
                              <div className="inline-flex flex-col items-center gap-1">
                                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                                  isDone 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-slate-100 text-slate-800'
                                }`}>
                                  {item.quantityCompleted} / {item.quantityTotal} {item.unit}
                                </span>

                                {item.deliverable && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleQuickIncrementDelivery(item.deliverable, client, e)}
                                    disabled={isDone}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                                      isDone
                                        ? 'text-emerald-600 bg-transparent cursor-default'
                                        : 'bg-[#134C5C] hover:bg-[#0f3d4a] text-white shadow-2xs cursor-pointer'
                                    }`}
                                    title={isDone ? 'اكتملت كافة الكمية المطلوبة' : `تسجيل تسليم +1 ${item.unit}`}
                                  >
                                    {isDone ? '✓' : '+1'}
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}

                        {/* Total progress */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-mono font-bold text-xs text-slate-800">
                              {totalDone} / {totalRequired} ({percent}%)
                            </span>
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                              <div 
                                className={`h-full rounded-full ${percent === 100 ? 'bg-emerald-500' : 'bg-[#134C5C]'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedClientForView(client)}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#134C5C] text-xs font-bold border border-teal-200 transition cursor-pointer"
                            >
                              عرض
                            </button>
                            <button
                              onClick={(e) => openEditModal(client, e)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                              title="تعديل الكميات والبيانات"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Clients Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">لم يتم العثور على عملاء مطابقة</h4>
            <p className="text-xs text-slate-400 mt-1">جرب تغيير كلمات البحث أو الفلاتر</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const clientDeliverables = deliverables.filter(d => d.clientId === client.id);
            const completedCount = clientDeliverables.filter(d => d.status === 'تم التسليم' || d.quantityCompleted >= d.quantityTotal).length;
            const progress = clientDeliverables.length > 0 
              ? Math.round((completedCount / clientDeliverables.length) * 100) 
              : 0;

            const isAllWorkDone = clientDeliverables.length > 0 && completedCount === clientDeliverables.length;
            const remaining = (client.totalInvoiced || 0) - (client.totalPaid || 0);

            return (
              <div
                key={client.id}
                onClick={() => setSelectedClientForView(client)}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#134C5C] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 shadow-sm"
              >
                
                {/* Header: Name, Company, Status */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#134C5C] transition">
                        {client.name}
                      </h3>
                      {client.companyName && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.companyName}</span>
                        </p>
                      )}
                    </div>
                    
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      client.status === 'نشط'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : client.status === 'مكتمل'
                        ? 'bg-teal-50 text-[#134C5C] border border-teal-200 font-extrabold'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {client.status}
                    </span>
                  </div>

                  {/* Contract Type & Retainer Badge */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {(!client.contractType || client.contractType === 'monthly') ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#134C5C] text-[10px] font-extrabold">
                        <Repeat className="w-3 h-3 text-[#134C5C]" />
                        <span>اشتراك شهري: {(client.monthlyRetainerFee || client.contractValue || 0).toLocaleString()} {currency}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold">
                        <span>مشروع محدد المدة</span>
                      </span>
                    )}

                    {client.subscriptionStatus === 'paused' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                        ⏸️ متوقف مؤقتاً
                      </span>
                    )}
                    {client.subscriptionStatus === 'terminated' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold border border-red-200">
                        🛑 تعاقد منتهي
                      </span>
                    )}
                  </div>

                  {/* Acquisition Channel Tag */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    <Share2 className="w-3 h-3 text-[#134C5C]" />
                    <span>الاستقطاب: </span>
                    <strong className="text-slate-800 font-semibold">{client.acquisitionChannel}</strong>
                  </div>
                </div>

                {/* ALL-IN-ONE SERVICES & DELIVERABLES MATRIX (مصفوفة الخدمات والمخرجات للعميل) */}
                {(() => {
                  const srvDeliverables = getClientServiceDeliverables(client.id);
                  const activeServices = srvDeliverables.filter(item => 
                    item.hasService || 
                    client.servicesAgreed?.includes(item.core.id) || 
                    client.servicesAgreed?.includes(item.core.fullName) ||
                    client.serviceQuantities?.some(sq => sq.serviceType === item.core.id) ||
                    client.monthlyPackage?.some(p => p.serviceType === item.core.id)
                  );

                  const totalTargetUnits = activeServices.reduce((sum, s) => sum + (Number(s.quantityTotal) || 0), 0);
                  const totalCompletedUnits = activeServices.reduce((sum, s) => sum + (Number(s.quantityCompleted) || 0), 0);
                  const overallPercent = totalTargetUnits > 0 ? Math.round((totalCompletedUnits / totalTargetUnits) * 100) : 0;

                  return (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200/60 pb-1.5">
                        <div className="flex items-center gap-1.5 text-[#134C5C]">
                          <Layers className="w-3.5 h-3.5" />
                          <span>الخدمات المطلوبة ({activeServices.length}):</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold">
                          {totalCompletedUnits} من {totalTargetUnits} مخرج ({overallPercent}%)
                        </span>
                      </div>

                      {activeServices.length === 0 ? (
                        <p className="text-[11px] text-slate-400 py-1 text-center">لا توجد خدمات محددة بعد لهذا العميل</p>
                      ) : (
                        <div className="space-y-1.5">
                          {activeServices.map((item) => {
                            const CoreIcon = item.core.icon;
                            const p = item.quantityTotal > 0 ? Math.round((item.quantityCompleted / item.quantityTotal) * 100) : 0;
                            const isDone = item.quantityTotal > 0 && item.quantityCompleted >= item.quantityTotal;

                            return (
                              <div 
                                key={item.core.id}
                                className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs shadow-2xs hover:border-[#134C5C]/50 transition"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`p-1 rounded-md shrink-0 ${item.core.badgeColor}`}>
                                    <CoreIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-slate-800 block truncate leading-tight text-xs">
                                      {item.core.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {item.quantityCompleted} من {item.quantityTotal} {item.unit}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {/* Percentage & Mini bar */}
                                  <div className="hidden sm:flex flex-col items-end w-12">
                                    <span className={`text-[9px] font-bold font-mono ${isDone ? 'text-emerald-600' : 'text-slate-600'}`}>
                                      {p}%
                                    </span>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-500' : 'bg-[#134C5C]'}`} 
                                        style={{ width: `${Math.min(100, p)}%` }} 
                                      />
                                    </div>
                                  </div>

                                  {/* Quick +1 Delivery button */}
                                  {item.deliverable && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleQuickIncrementDelivery(item.deliverable, client, e)}
                                      disabled={isDone}
                                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                        isDone
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                          : 'bg-[#134C5C] hover:bg-[#0f3d4a] text-white shadow-2xs'
                                      }`}
                                      title={isDone ? 'اكتملت كافة الكميات المطلوبة' : `تسجيل تسليم +1 ${item.unit} فوراً`}
                                    >
                                      {isDone ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-600" />
                                          <span>تم ✓</span>
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="w-3 h-3" />
                                          <span>+1</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Deliverables Progress */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">إنجاز مخرجات العمل:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {completedCount} من {clientDeliverables.length} مهام ({progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        progress === 100 ? 'bg-emerald-500' : 'bg-[#134C5C]'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Auto-Complete Callout if 100% and not marked completed */}
                  {isAllWorkDone && client.status !== 'مكتمل' && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>اكتملت كافة المهام 100%</span>
                      </span>
                      <button
                        onClick={(e) => handleAutoCompleteStatus(client, e)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition"
                      >
                        تحويل لمكتمل ✓
                      </button>
                    </div>
                  )}

                  {/* Unpaid Monthly Invoice Callout & Payment Button */}
                  {(() => {
                    const unpaidInvoice = invoices.find(i => i.clientId === client.id && i.status !== 'مدفوعة بالكامل');
                    if (unpaidInvoice) {
                      return (
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 text-[11px] mt-1">
                          <span className="text-amber-900 font-bold">
                            مستحق استلام: <span className="font-mono">{((Number(unpaidInvoice.total) || 0) - (Number(unpaidInvoice.paidAmount) || 0)).toLocaleString()} {currency}</span>
                          </span>
                          <button
                            onClick={(e) => openPayCycleModal(client, e)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs transition"
                            title="تسجيل استلام الدفعة الشهرية وإصدار إيصال واتساب"
                          >
                            <Wallet className="w-3 h-3" />
                            <span>تسجيل استلام 💵</span>
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Monthly Retainer Cycle Control Actions */}
                  {(!client.contractType || client.contractType === 'monthly') && (
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 mt-1">
                      <button
                        onClick={(e) => openStatusModal(client, e)}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                        title="إيقاف مؤقت للاشتراك أو إنهاء التعاقد"
                      >
                        <span>حالة العقد ⚙️</span>
                      </button>

                      <button
                        onClick={(e) => openRenewModal(client, e)}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-[#134C5C] hover:bg-[#0f3d4a] text-white font-bold transition flex items-center gap-1 shadow-xs"
                        title="بدء دورة شهر جديد مع تعديل المهام وإضافة أعمال استثنائية"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>دورة شهر جديد ⚡</span>
                      </button>
                    </div>
                  )}

                  {/* Renew Contract Button for completed project */}
                  {client.contractType === 'project' && client.status === 'مكتمل' && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#134C5C] font-bold">
                        أعمال العميل منتهية
                      </span>
                      <button
                        onClick={(e) => openRenewModal(client, e)}
                        className="text-[10px] px-2.5 py-1 rounded-md bg-[#134C5C] hover:bg-[#0f3d4a] text-white font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>تجديد التعاقد / شهر جديد</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">قيمة العقد</span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {(client.contractValue || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">تم سداده</span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      {(client.totalPaid || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">المتبقي</span>
                    <span className={`text-xs font-bold font-mono ${remaining > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {remaining > 0 ? remaining.toLocaleString() : '0'}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={(e) => openWorkHistoryModal(client, e)}
                    className="text-xs font-bold text-[#134C5C] hover:text-[#0f3d4a] flex items-center gap-1 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-lg border border-teal-200 transition"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>كافة الشغل المنفذ ({completedCount})</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      title="تعديل العميل"
                      onClick={(e) => openEditModal(client, e)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="حذف العميل"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`هل أنت متأكد من حذف العميل "${client.name}" وكافة فواتيره ومهامه؟`)) {
                          onDeleteClient(client.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
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
    )}

      {/* ----------------- CREATE / EDIT CLIENT MODAL ----------------- */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingClient ? 'تعديل بيانات العميل' : 'إضافة عميل جديد لـ AG-media'}
                </h3>
                <p className="text-xs text-slate-500">
                  سجل تفاصيل العميل، طريقة استقطابه، والخدمات المتفق عليها
                </p>
              </div>
              <button
                onClick={() => setIsClientModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    اسم العميل أو جهة الاتصال *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: م. كريم عبد الرحمن"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    اسم الشركة / البراند
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شركة إيليت هوم العقارية"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    رقم الهاتف / واتساب
                  </label>
                  <input
                    type="text"
                    placeholder="010xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] text-left font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] text-left font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    طريقة الاستقطاب (Lead Source) *
                  </label>
                  <select
                    value={formData.acquisitionChannel}
                    onChange={(e) => setFormData({ ...formData, acquisitionChannel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  >
                    {channelsList.map((ch, idx) => (
                      <option key={idx} value={ch}>{ch}</option>
                    ))}
                  </select>
                </div>

                {/* Contract Type (اشتراك شهري vs مشروع محدد) */}
                <div className="md:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">نوع التعاقد ونظام الفوترة *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      formData.contractType === 'monthly'
                        ? 'bg-teal-50 border-teal-300 text-[#134C5C] ring-2 ring-[#134C5C]/15'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="contractType"
                        value="monthly"
                        checked={formData.contractType === 'monthly'}
                        onChange={() => setFormData({ ...formData, contractType: 'monthly' })}
                        className="text-[#134C5C] focus:ring-0"
                      />
                      <Repeat className="w-4 h-4 text-[#134C5C]" />
                      <span>اشتراك شهري مستمر 🔁</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      formData.contractType === 'project'
                        ? 'bg-teal-50 border-teal-300 text-[#134C5C] ring-2 ring-[#134C5C]/15'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}>
                      <input
                        type="radio"
                        name="contractType"
                        value="project"
                        checked={formData.contractType === 'project'}
                        onChange={() => setFormData({ ...formData, contractType: 'project' })}
                        className="text-[#134C5C] focus:ring-0"
                      />
                      <span>مشروع لمرة واحدة 📌</span>
                    </label>
                  </div>
                </div>

                {formData.contractType === 'monthly' ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        قيمة الاشتراك الشهري المتفق عليه ({currency}) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="مثال: 15000"
                        value={formData.monthlyRetainerFee !== undefined && formData.monthlyRetainerFee !== '' ? formData.monthlyRetainerFee : formData.contractValue}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          monthlyRetainerFee: e.target.value,
                          contractValue: e.target.value 
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        يوم الاستحقاق والتجديد من كل شهر
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        placeholder="1 (يوم 1 من كل شهر)"
                        value={formData.billingDay || 1}
                        onChange={(e) => setFormData({ ...formData, billingDay: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      قيمة المشروع الإجمالية ({currency})
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="مثال: 35000"
                      value={formData.contractValue}
                      onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    حالة العميل
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  >
                    <option value="نشط">نشط (جاري العمل)</option>
                    <option value="مكتمل">مكتمل (تم إنهاء الأعمال)</option>
                    <option value="معلق">معلق (متوقف مؤقتاً)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    تاريخ بدء التعاقد
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C]"
                  />
                </div>
              </div>

              {/* Comprehensive Service Quantities Matrix Builder (تحديد كميات الخدمات المطلوب تنفيذها) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5 text-[#134C5C]">
                      <Layers className="w-4 h-4 text-[#134C5C]" />
                      <span>تحديد كميات الخدمات والمخرجات للعميل (Service Quantities Matrix) *</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      حدد الخدمات المطلوبة والكميات لكل خدمة ليتم عرضها ومتابعة تسليمها دفعة واحدة للعميل
                    </p>
                  </div>
                  
                  {/* Total requested deliverables preview badge */}
                  {(() => {
                    const totalUnits = CORE_SERVICES.reduce((sum, s) => {
                      const sq = formData.serviceQuantities?.[s.id];
                      return sum + (sq?.enabled ? (Number(sq.quantityTotal) || 0) : 0);
                    }, 0);
                    const activeCount = CORE_SERVICES.filter(s => formData.serviceQuantities?.[s.id]?.enabled).length;

                    return (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-100/70 border border-teal-300 text-[#134C5C] text-xs font-black">
                        <span>إجمالي المطلوب:</span>
                        <span className="font-mono">{totalUnits} عمل</span>
                        <span className="text-[10px] text-slate-500">({activeCount} خدمات)</span>
                      </div>
                    );
                  })()}
                </div>

                <div className="space-y-3 pt-1">
                  {CORE_SERVICES.map((srv) => {
                    const SrvIcon = srv.icon;
                    const sq = formData.serviceQuantities?.[srv.id] || {
                      enabled: false,
                      quantityTotal: srv.defaultQuantity,
                      unit: srv.defaultUnit,
                      title: srv.defaultTitle,
                      notes: ''
                    };
                    const isChecked = sq.enabled;

                    return (
                      <div
                        key={srv.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isChecked
                            ? 'bg-white border-[#134C5C] shadow-xs ring-1 ring-[#134C5C]/15'
                            : 'bg-slate-100/50 border-slate-200 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Service Toggle & Label */}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleServiceToggle(srv.id, !isChecked);
                            }}
                            className="flex items-center gap-2.5 cursor-pointer select-none flex-1 group"
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(isChecked)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleServiceToggle(srv.id, e.target.checked);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="rounded text-[#134C5C] focus:ring-0 w-4 h-4 cursor-pointer"
                            />
                            <div className={`p-1.5 rounded-lg shrink-0 ${srv.badgeColor}`}>
                              <SrvIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 leading-tight">
                                  {srv.name}
                                </span>
                                {isChecked && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                    مفعلة ✓
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                {sq.title || srv.defaultTitle}
                              </span>
                            </div>
                          </div>

                          {/* Quantities & Unit Inputs + Cancel Button (When enabled) */}
                          {isChecked ? (
                            <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0 animate-fadeIn">
                              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                <span className="text-[11px] text-slate-500 font-medium px-1">الكمية:</span>
                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleServiceQuantityChange(srv.id, 'quantityTotal', Math.max(1, (Number(sq.quantityTotal) || 1) - 1));
                                  }}
                                  className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition cursor-pointer"
                                >
                                  -
                                </button>

                                <input
                                  type="number"
                                  min="1"
                                  required
                                  value={sq.quantityTotal}
                                  onChange={(e) => handleServiceQuantityChange(srv.id, 'quantityTotal', Math.max(1, Number(e.target.value) || 1))}
                                  className="w-14 px-2 py-1 text-center font-mono font-bold text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#134C5C]"
                                />

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleServiceQuantityChange(srv.id, 'quantityTotal', (Number(sq.quantityTotal) || 0) + 1);
                                  }}
                                  className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 flex items-center justify-center transition cursor-pointer"
                                >
                                  +
                                </button>

                                <input
                                  type="text"
                                  value={sq.unit}
                                  onChange={(e) => handleServiceQuantityChange(srv.id, 'unit', e.target.value)}
                                  placeholder="الوحدة"
                                  className="w-16 px-2 py-1 text-center text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#134C5C]"
                                  title="وحدة القياس (مثال: تصميم، فيديو، حملة)"
                                />
                              </div>

                              {/* Explicit Cancel / Undo Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleServiceToggle(srv.id, false);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition flex items-center gap-1 cursor-pointer"
                                title="إلغاء واستبعاد هذه الخدمة من العميل"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>إلغاء الخدمة</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleServiceToggle(srv.id, true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#134C5C] text-xs font-bold border border-teal-200 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ تفعيل هذه الخدمة</span>
                            </button>
                          )}
                        </div>

                        {/* Optional notes / scope for active service */}
                        {isChecked && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 shrink-0">تفاصيل المخرج:</span>
                            <input
                              type="text"
                              value={sq.notes || ''}
                              onChange={(e) => handleServiceQuantityChange(srv.id, 'notes', e.target.value)}
                              placeholder={`ملاحظات خاصة بـ ${srv.name} (مثال: منصات النشر، أبعاد التصاميم، نوع المونتاج...)`}
                              className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#134C5C]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes & Agreed Terms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  كافة التفاصيل والشروط المتفق عليها (ملاحظات ونطاق العمل)
                </label>
                <textarea
                  rows="3"
                  placeholder="مثال: متفق على 16 بوست شهرياً + 4 ريلز تصوير ميداني + موشن جرافيك للإطلاق..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#134C5C] resize-none"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-md shadow-[#134C5C]/20 transition"
                >
                  {editingClient ? 'حفظ التعديلات' : 'إضافة العميل'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- RENEW MONTHLY CYCLE MODAL (تجديد الدورة الشهرية والمهام الاستثنائية) ----------------- */}
      <MonthlyCycleModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        client={clientToRenew}
        currency={currency}
        servicesList={servicesList}
        onConfirmCycle={handleRenewSubmit}
      />

      {/* ----------------- RECORD MONTHLY PAYMENT MODAL (تسجيل استلام الدفعة الشهرية) ----------------- */}
      <MonthlyPaymentModal
        isOpen={isPayCycleModalOpen}
        onClose={() => setIsPayCycleModalOpen(false)}
        client={clientToPay}
        invoice={invoiceToPay}
        paymentMethods={paymentMethods}
        currency={currency}
        onConfirmPayment={onPayMonthlyCycle}
      />

      {/* ----------------- SUBSCRIPTION STATUS MODAL (إيقاف مؤقت / إنهاء التعاقد) ----------------- */}
      <SubscriptionStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        client={clientForStatus}
        onUpdateStatus={onUpdateSubscriptionStatus}
      />

      {/* ----------------- COMPLETED WORK HISTORY & PORTFOLIO MODAL (سجل كافة الشغل المنفذ) ----------------- */}
      {isWorkHistoryModalOpen && clientForWorkHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[94vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl print-card">
            
            {/* Modal Header & Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 no-print">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#134C5C] text-xs font-bold border border-teal-200 mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>سجل الإنجاز وسوابق الأعمال (Portfolio)</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>كافة الأعمال والشغل المنفذ لـ: {clientForWorkHistory.name}</span>
                </h3>
                {clientForWorkHistory.companyName && (
                  <p className="text-xs text-slate-500 mt-0.5">{clientForWorkHistory.companyName}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleCopyWorkReportWhatsApp(clientForWorkHistory)}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مشاركة التقرير عبر واتساب</span>
                </button>

                <button
                  onClick={() => handleCopyReviewRequestWhatsApp(clientForWorkHistory)}
                  className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Star className="w-3.5 h-3.5 text-amber-600" />
                  <span>رسالة شكر وطلب تقييم</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة تقرير الإنجاز (PDF)</span>
                </button>

                <button
                  onClick={() => setIsWorkHistoryModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification Badges */}
            {copiedNotification && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 no-print animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>تم نسخ تقرير كافة الأعمال المنفذة للحافظة بنجاح، يمكنك لصقه الآن في واتساب العميل!</span>
              </div>
            )}
            {copiedReviewNotification && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 no-print animate-fadeIn">
                <Check className="w-4 h-4 text-amber-600" />
                <span>تم نسخ رسالة الشكر وطلب التقييم بنجاح، جاهزة للإرسال للعميل عبر واتساب!</span>
              </div>
            )}

            {/* Client Summary KPI Grid */}
            {(() => {
              const clientDeliverables = deliverables.filter(d => d.clientId === clientForWorkHistory.id);
              const completedDeliverables = clientDeliverables.filter(d => d.status === 'تم التسليم' || d.quantityCompleted >= d.quantityTotal);
              const progressRate = clientDeliverables.length ? Math.round((completedDeliverables.length / clientDeliverables.length) * 100) : 0;
              
              const graphicCount = completedDeliverables.filter(d => d.serviceType === 'تصميم جرافيك').reduce((s, d) => s + (Number(d.quantityCompleted) || 0), 0);
              const videoCount = completedDeliverables.filter(d => d.serviceType === 'مونتاج فيديوهات وتصويرها').reduce((s, d) => s + (Number(d.quantityCompleted) || 0), 0);
              const motionCount = completedDeliverables.filter(d => d.serviceType === 'عمل فيديوهات موشن جرافيك').reduce((s, d) => s + (Number(d.quantityCompleted) || 0), 0);
              const aiCount = completedDeliverables.filter(d => d.serviceType === 'عمل فيديوهات ai').reduce((s, d) => s + (Number(d.quantityCompleted) || 0), 0);
              const adsCount = completedDeliverables.filter(d => d.serviceType === 'انشاء الاعلانات المموله').reduce((s, d) => s + (Number(d.quantityCompleted) || 0), 0);

              const clientInvoices = invoices.filter(i => i.clientId === clientForWorkHistory.id);
              const totalInvoiced = clientInvoices.reduce((s, i) => s + (Number(i.total) || 0), 0);
              const totalPaid = clientInvoices.reduce((s, i) => s + (Number(i.paidAmount) || 0), 0);

              return (
                <div className="space-y-6">
                  
                  {/* Agency Letterhead for Print */}
                  <div className="hidden print-only text-center pb-6 border-b-2 border-[#134C5C]">
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <h2 className="text-xl font-black text-slate-900">وكالة AG-media للإنتاج الرقمي والتسويق</h2>
                        <p className="text-xs text-slate-600 font-mono">we create your thinking</p>
                      </div>
                      <img src="/logo.png" alt="AG-media" className="h-12 w-auto object-contain" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mt-4">تقرير إنجاز وتسليم مخرجات العمل التعاقدية</h3>
                    <p className="text-xs text-slate-600">العميل: {clientForWorkHistory.name} - {clientForWorkHistory.companyName}</p>
                  </div>

                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
                      <span className="text-[10px] text-[#134C5C] font-bold block mb-1">تصاميم جرافيك منجزة</span>
                      <span className="text-xl font-black text-[#134C5C] font-mono">{graphicCount}</span>
                      <span className="text-[10px] text-slate-500 block">تصميم</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                      <span className="text-[10px] text-sky-800 font-bold block mb-1">فيديوهات ومونتاج</span>
                      <span className="text-xl font-black text-sky-800 font-mono">{videoCount}</span>
                      <span className="text-[10px] text-slate-500 block">فيديو وريلز</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] text-amber-800 font-bold block mb-1">موشن جرافيك</span>
                      <span className="text-xl font-black text-amber-800 font-mono">{motionCount}</span>
                      <span className="text-[10px] text-slate-500 block">فيديو موشن</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                      <span className="text-[10px] text-purple-800 font-bold block mb-1">فيديوهات AI</span>
                      <span className="text-xl font-black text-purple-800 font-mono">{aiCount}</span>
                      <span className="text-[10px] text-slate-500 block">فيديو AI</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-emerald-800 font-bold block mb-1">حملات إعلانات ممولة</span>
                      <span className="text-xl font-black text-emerald-800 font-mono">{adsCount}</span>
                      <span className="text-[10px] text-slate-500 block">حملة مدارة</span>
                    </div>
                  </div>

                  {/* Progress & Financial Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">نسبة إنجاز المخرجات:</span>
                        <strong className="text-slate-900 font-mono font-black">{completedDeliverables.length} من {clientDeliverables.length} مهام ({progressRate}%)</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progressRate}%` }}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-around border-t sm:border-t-0 sm:border-r border-slate-200 pt-2 sm:pt-0 sm:pr-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">إجمالي المفَوْتَر:</span>
                        <strong className="font-mono text-slate-800">{totalInvoiced.toLocaleString()} {currency}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">المسدد نقداً:</span>
                        <strong className="font-mono text-emerald-600">{totalPaid.toLocaleString()} {currency}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">موقف السداد:</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          totalInvoiced <= totalPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {totalInvoiced <= totalPaid ? 'مسدد بالكامل ✓' : 'متبقي مستحق'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Filter Tabs by Service Type */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-print">
                    {['ALL', 'تصميم جرافيك', 'مونتاج فيديوهات وتصويرها', 'عمل فيديوهات موشن جرافيك', 'عمل فيديوهات ai', 'انشاء الاعلانات المموله'].map((srv, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHistoryServiceFilter(srv)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                          historyServiceFilter === srv
                            ? 'bg-[#134C5C] text-white border-[#134C5C]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {srv === 'ALL' ? 'جميع الأعمال والخدمات' : srv}
                      </button>
                    ))}
                  </div>

                  {/* Deliverables Detailed List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-[#134C5C]" />
                      <span>قائمة المخرجات والأعمال المسلمة بالتفصيل:</span>
                    </h4>

                    {clientDeliverables.filter(d => historyServiceFilter === 'ALL' || d.serviceType === historyServiceFilter).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                        لا توجد أعمال مسجلة لهذا التصنيف بعد.
                      </p>
                    ) : (
                      clientDeliverables
                        .filter(d => historyServiceFilter === 'ALL' || d.serviceType === historyServiceFilter)
                        .map((del) => {
                          const isDone = del.status === 'تم التسليم' || del.quantityCompleted >= del.quantityTotal;

                          return (
                            <div 
                              key={del.id}
                              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                                isDone 
                                  ? 'bg-emerald-50/30 border-emerald-200' 
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                  )}
                                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{del.title}</h5>
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#134C5C] font-semibold">
                                    {del.serviceType}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                  <span className="font-mono font-bold text-slate-800">
                                    {del.quantityCompleted} من {del.quantityTotal} {del.unit}
                                  </span>
                                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                                    isDone 
                                      ? 'bg-emerald-100 text-emerald-800' 
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {del.status}
                                  </span>
                                </div>
                              </div>

                              {del.description && (
                                <p className="text-xs text-slate-600 leading-relaxed pr-6">
                                  {del.description}
                                </p>
                              )}

                              {del.notes && (
                                <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 pr-6">
                                  <strong>ملاحظات التسليم: </strong>{del.notes}
                                </div>
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>

                  {/* Renew Action Bar at the Bottom */}
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#134C5C]">هل ترغب في بدء شهر جديد أو دورة تسويقية جديدة للعميل؟</h4>
                      <p className="text-[11px] text-slate-600">يمكنك تجديد التعاقد بنقرة زر مع الحفاظ على كافة سوابق الأعمال السابقة محفوظة للأبد.</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsWorkHistoryModalOpen(false);
                        openRenewModal(clientForWorkHistory);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow transition flex items-center gap-1.5 shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>تجديد التعاقد / بدء دورة جديدة 🚀</span>
                    </button>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ----------------- CLIENT FULL DETAILS DRAWER / MODAL ----------------- */}
      {selectedClientForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedClientForView.name}
                  </h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    selectedClientForView.status === 'نشط'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-teal-50 text-[#134C5C] border border-teal-200'
                  }`}>
                    {selectedClientForView.status}
                  </span>
                </div>
                {selectedClientForView.companyName && (
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{selectedClientForView.companyName}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => openWorkHistoryModal(selectedClientForView, e)}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#134C5C] text-xs font-bold flex items-center gap-1.5 border border-teal-200 transition"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>سجل كافة الشغل المنفذ</span>
                </button>
                <button
                  onClick={(e) => openEditModal(selectedClientForView, e)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-slate-200 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => setSelectedClientForView(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Contact & Channel Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">طريقة الاستقطاب (Lead Source):</span>
                <span className="font-bold text-[#134C5C] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  {selectedClientForView.acquisitionChannel}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">الهاتف والواتساب:</span>
                <span className="font-bold text-slate-800 font-mono dir-ltr inline-block">
                  {selectedClientForView.phone || 'غير مسجل'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">البريد الإلكتروني:</span>
                <span className="font-bold text-slate-800 font-mono dir-ltr inline-block">
                  {selectedClientForView.email || 'غير مسجل'}
                </span>
              </div>
            </div>

            {/* Client Action Shortcuts Bar (Quotation, Pitch Deck, Invoice, History) */}
            <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 ml-1">إجراءات سريعة للعميل:</span>
              
              <button
                onClick={() => {
                  const cid = selectedClientForView.id;
                  setSelectedClientForView(null);
                  onOpenNewQuotationForClient(cid);
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 transition flex items-center gap-1.5 shadow-xs"
              >
                <Receipt className="w-3.5 h-3.5 text-amber-600" />
                <span>إصدار عرض سعر (Quotation)</span>
              </button>

              <button
                onClick={() => {
                  const cid = selectedClientForView.id;
                  setSelectedClientForView(null);
                  onOpenNewProposalForClient(cid);
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-teal-50 text-[#134C5C] text-xs font-bold border border-teal-200 transition flex items-center gap-1.5 shadow-xs"
              >
                <Presentation className="w-3.5 h-3.5 text-[#134C5C]" />
                <span>إنشاء عرض تقديمي (Pitch Deck)</span>
              </button>

              <button
                onClick={() => {
                  const cid = selectedClientForView.id;
                  setSelectedClientForView(null);
                  onOpenNewInvoiceForClient(cid);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>إصدار فاتورة رسمية</span>
              </button>

              {/* Monthly Retainer Cycle Shortcuts */}
              {(!selectedClientForView.contractType || selectedClientForView.contractType === 'monthly') && (
                <>
                  <button
                    onClick={() => {
                      const c = selectedClientForView;
                      setSelectedClientForView(null);
                      openRenewModal(c);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    title="بدء دورة شهر جديد وتعديل المهام وإضافة أعمال استثنائية"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>دورة شهر جديد ⚡</span>
                  </button>

                  <button
                    onClick={() => {
                      const c = selectedClientForView;
                      setSelectedClientForView(null);
                      openPayCycleModal(c);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    title="تسجيل استلام الدفعة الشهرية وإصدار إيصال واتساب"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>تسجيل استلام شهري 💵</span>
                  </button>

                  <button
                    onClick={() => {
                      const c = selectedClientForView;
                      setSelectedClientForView(null);
                      openStatusModal(c);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                    title="إيقاف مؤقت للاشتراك أو إنهاء التعاقد"
                  >
                    <span>حالة العقد ⚙️</span>
                  </button>
                </>
              )}

              {selectedClientForView.contractType === 'project' && selectedClientForView.status === 'مكتمل' && (
                <button
                  onClick={() => {
                    const c = selectedClientForView;
                    setSelectedClientForView(null);
                    openRenewModal(c);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تجديد التعاقد / شهر جديد</span>
                </button>
              )}
            </div>

            {/* Financial Ledger for this Client */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>الموقف المالي للعميل</span>
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">قيمة التعاقد</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {(selectedClientForView.contractValue || 0).toLocaleString()} {currency}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">إجمالي المفَوْتَر</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {(selectedClientForView.totalInvoiced || 0).toLocaleString()} {currency}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">تم سداده</span>
                  <span className="text-sm font-bold text-emerald-600 font-mono">
                    {(selectedClientForView.totalPaid || 0).toLocaleString()} {currency}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">المتبقي (المستحق)</span>
                  <span className={`text-sm font-bold font-mono ${
                    ((selectedClientForView.totalInvoiced || 0) - (selectedClientForView.totalPaid || 0)) > 0
                      ? 'text-amber-600'
                      : 'text-slate-400'
                  }`}>
                    {Math.max(0, (selectedClientForView.totalInvoiced || 0) - (selectedClientForView.totalPaid || 0)).toLocaleString()} {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Agreed Terms & Notes */}
            {selectedClientForView.notes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700">التفاصيل والشروط المتفق عليها:</h4>
                <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {selectedClientForView.notes}
                </p>
              </div>
            )}

            {/* Deliverables for this client */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#134C5C]" />
                  <span>مخرجات وأعمال العميل (ما تم إنجازه وما لم يتم)</span>
                </h4>
                <button
                  onClick={() => {
                    const cid = selectedClientForView.id;
                    setSelectedClientForView(null);
                    onOpenDeliverablesForClient(cid);
                  }}
                  className="text-xs text-[#134C5C] hover:text-[#0f3d4a] font-semibold"
                >
                  إدارة المخرجات بالتفصيل ←
                </button>
              </div>

              {deliverables.filter(d => d.clientId === selectedClientForView.id).length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">لا توجد مخرجات مسجلة لهذا العميل بعد.</p>
              ) : (
                <div className="space-y-2">
                  {deliverables.filter(d => d.clientId === selectedClientForView.id).map(del => {
                    const p = Math.round((del.quantityCompleted / del.quantityTotal) * 100);
                    return (
                      <div 
                        key={del.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{del.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-[#134C5C] font-medium">
                              {del.serviceType}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px]">{del.description}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-left font-mono">
                            <span className="font-bold text-slate-800">{del.quantityCompleted} من {del.quantityTotal} {del.unit}</span>
                            <span className="text-[10px] text-slate-500 block">{p}% مكتمل</span>
                          </div>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                            del.status === 'تم التسليم'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : del.status === 'قيد التنفيذ'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {del.status}
                          </span>
                          {del.status !== 'تم التسليم' && (
                            <button
                              type="button"
                              onClick={() => handleQuickIncrementDelivery(del, selectedClientForView)}
                              className="px-2.5 py-1 rounded-lg bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-[11px] font-bold shadow-xs transition cursor-pointer flex items-center gap-1"
                              title={`تسجيل تسليم +1 ${del.unit}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>+1 تسليم</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
