import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  Plus, 
  Search, 
  Printer, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Trash2, 
  Edit, 
  Sparkles, 
  Check, 
  Layout, 
  Copy, 
  Video, 
  TrendingUp, 
  Cpu, 
  Palette,
  Sun,
  Moon
} from 'lucide-react';

// Preset Templates Library for AG-media proposals
export const PROPOSAL_TEMPLATES = [
  {
    id: 'ads_campaign',
    name: 'حملة إعلانات ممولة ومبيعات (Paid Ads & Performance Marketing)',
    badge: 'إعلانات ومبيعات',
    icon: TrendingUp,
    defaultTitle: 'استراتيجية إطلاق الحملات الإعلانية الممولة والمبيعات',
    defaultSubtitle: 'خطة استهداف إعلاني متكاملة لتحقيق أعلى عائد على الإنفاق (ROAS)',
    primaryService: 'إنشاء وإدارة الإعلانات الممولة وتصوير إعلانات المبيعات',
    timeline: '30 يوماً (حملة شهرية متجددة)',
    objective: 'تحقيق نمو مباشر في المبيعات والليدز بأقل تكلفة استحواذ ممكنة عبر إعلانات فيديو ممولة مصممة خصيصاً للتحويل المالي.',
    creativeConcept: 'الاعتماد على إعلانات خطافية (Hook-Problem-Solution) بفيديوهات قصيرة ديناميكية وتجارب حية لعرض المنتج مع استهداف جمهور مهتم بالشراء الفوري.',
    deliverablesList: [
      'تصوير ومونتاج 6 فيديوهات إعلانية ريلز وتيك توك مخصصة للتحويل',
      'تصميم 10 بنرات إعلانية للعروض والخصومات وإعادة الاستهداف',
      'إعداد وضبط بيكسل التتبع (Pixel & Conversion API) للمتجر أو الموقع',
      'إدارة الميزانية الإعلانية واختبار A/B testing للجمهور والمحتوى الإعلاني'
    ],
    executionPhases: [
      { phase: 'المرحلة 1: البحث وتحديد الجمهور والاسكريبت', duration: 'الأسبوع 1', details: 'تحليل المنافسين، تحديد نقاط الألم والمزايا، وصياغة اسكريبتات الإعلانات.' },
      { phase: 'المرحلة 2: تصوير وإنتاج محتوى الإعلانات', duration: 'الأسبوع 2', details: 'تصوير احترافي للريلز ومونتاج سريع مع كتابة كابشن وجرافيكس جاذبة.' },
      { phase: 'المرحلة 3: إطلاق حملات الاختبار (Testing)', duration: 'الأسبوع 3', details: 'إطلاق الحملات بميزانية محسوبة لاختبار الفيديوهات والجمهور الأفضل تحويلاً.' },
      { phase: 'المرحلة 4: التوسيع وزيادة المبيعات (Scaling)', duration: 'الأسبوع 4', details: 'ضخ الميزانية في الإعلانات الرابحة وخفض تكلفة الشراء وزيادة أرباح العميل.' }
    ],
    whyUsPoints: [
      'فريق ميديا باينج معتمد يركز على العائد الاستثماري (ROAS) وليس مجرد المشاهدات',
      'فيديوهات إعلانية مصممة نفسياً لتحفيز قرار الشراء الفوري',
      'متابعة يومية وتحسين مستمر للحملات مع تقارير أداء دورية',
      'شعارنا: we create your thinking - نحول ميزانيتك لأرباح حقيقية'
    ]
  },
  {
    id: 'branding_cinema',
    name: 'إنتاج سينمائي وبراندينج فاخر (Cinematic Brand Film & Identity)',
    badge: 'براندينج وإنتاج سينمائي',
    icon: Video,
    defaultTitle: 'العرض التقديمي للإنتاج السينمائي والهوية البصرية الفاخرة',
    defaultSubtitle: 'بناء مكانة بصرية مرموقة وترسيخ هوية العلامة التجارية في السوق',
    primaryService: 'تصوير سينمائي 4K، تصوير درون، مونتاج متقدم، وهوية بصرية',
    timeline: '4 أسابيع عمل',
    objective: 'ترسيخ صورة العلامة التجارية كخيار رائد ومتميز في السوق، وجذب شريحة العملاء الراقية من خلال فيلم براندينج سينمائي عالي الجودة.',
    creativeConcept: 'سرد قصة البراند (Brand Storytelling) بلقطات بصرية آسرة وإضاءة درامية مع تعليق صوتي سينمائي وموسيقى تصويرية مخصصة تعبر عن روح المؤسسة.',
    deliverablesList: [
      'فيلم براندينج سينمائي رئيسي للمؤسسة (Hero Brand Film - 90 ثانية)',
      '3 فيديوهات ريلز قصيرة مقتطعة من الفيلم بأبعاد رأسية للسوشيال ميديا',
      'جلسة تصوير فوتوغرافي تجاري سينمائي للمقر والمنتجات وفريق العمل',
      'تحديث عناصر الهوية البصرية ودليل استخدام الألوان والخطوط'
    ],
    executionPhases: [
      { phase: 'المرحلة 1: لوحة الإلهام وكتابة الاسكريبت', duration: 'الأسبوع 1', details: 'جلسات عصف ذهني، صياغة السيناريو، وتحديد الـ Storyboard وتجهيز مواقع التصوير.' },
      { phase: 'المرحلة 2: الإنتاج والتصوير الميداني', duration: 'الأسبوع 2', details: 'يومين تصوير كاملين بكاميرات سينمائية وعدسات برايم، طائرة درون، وطاقم إضاءة كامل.' },
      { phase: 'المرحلة 3: البوست برودكشن والمونتاج والتلوين', duration: 'الأسبوع 3', details: 'تلوين سينمائي (Color Grading)، هندسة وتوزيع صوتي، وفويس أوفر محترف.' },
      { phase: 'المرحلة 4: الاعتماد والتسليم النهائي', duration: 'الأسبوع 4', details: 'مراجعة الملاحظات، وتصدير العمل بكافة الصيغ للسينما والتلفزيون والمنصات الرقمية.' }
    ],
    whyUsPoints: [
      'معدات تصوير سينمائية 4K وعدسات سينمائية احترافية وطاقم تصوير متمرس',
      'تلوين سينمائي احترافي يمنح العمل طابعاً فخماً لا يشبه الفيديوهات التقليدية',
      'فريق تأليف وكتابة محتوى وسيناريو حاصل على جوائز',
      'شعارنا: we create your thinking - نجعل علامتك التجارية لا تُنسى'
    ]
  },
  {
    id: 'monthly_retainer',
    name: 'إدارة محتوى ونمو السوشيال ميديا الشهري (Monthly Content & Growth)',
    badge: 'محتوى ونمو شهري',
    icon: Palette,
    defaultTitle: 'استراتيجية إدارة ونمو السوشيال ميديا والمحتوى الشهري',
    defaultSubtitle: 'حضور يومي مستمر وتفاعل متصاعد مع جمهورك المستهدف',
    primaryService: 'تصميم جرافيك، مونتاج ريلز وتيك توك، وإدارة الحسابات',
    timeline: 'اشتراك شهري مستمر',
    objective: 'بناء قاعدة جماهيرية متفاعلة وزيادة الوصول الطبيعي (Organic Reach) وتحويل المتابعين إلى عملاء دائمين عبر محتوى ذو قيمة ومستمر.',
    creativeConcept: 'مزيج مدروس بين المحتوى التثقيفي، الترفيهي التفاعلي، والمحتوى البيعي، مع أسلوب تصميم حديث ومونتاج تريندي يواكب خوارزميات المنصات.',
    deliverablesList: [
      '16 تصميماً جرافيكياً احترافياً للبوستات والستوري شهرياً',
      '8 فيديوهات ريلز وتيك توك سريعة ومونتاج جذاب شهرياً',
      'كتابة كابشن تسويقي وإعداد خطة الهاشتاجات والأفكار الأسبوعية',
      'جدولة ونشر المنشورات مع تقديم تقرير تحليلي شهري بالأرقام'
    ],
    executionPhases: [
      { phase: 'المرحلة 1: وضع الخطة والمحتوى للشهر', duration: 'الأسبوع 1', details: 'تجهيز تقويم المحتوى الشهري، واقتراح موضوعات الفيديوهات والتصاميم للاعتماد.' },
      { phase: 'المرحلة 2: التصميم والمونتاج', duration: 'الأسبوع 2', details: 'تنفيذ الدفعة الأولى من التصاميم ومونتاج الفيديوهات مع كتابة النصوص.' },
      { phase: 'المرحلة 3: النشر والتفاعل', duration: 'طوال الشهر', details: 'جدولة المنشورات في أوقات الذروة ومراقبة التفاعل والردود.' },
      { phase: 'المرحلة 4: التقرير والتقييم', duration: 'نهاية الشهر', details: 'عرض تقرير نمو الحسابات والمحتوى الأكثر نجاحاً والتخطيط للشهر القادم.' }
    ],
    whyUsPoints: [
      'التزام صارم بجدول النشر دون انقطاع',
      'مواكبة مستمرة لأحدث التريندات وأساليب المونتاج التفاعلية',
      'فريق متكامل يعمل على حسابك (مصمم + مونتير + كاتب محتوى)',
      'شعارنا: we create your thinking - شريك نموك اليومي'
    ]
  },
  {
    id: 'app_launch_ai',
    name: 'إطلاق تطبيق / خدمة بموشن جرافيك وذكاء اصطناعي (App Launch & AI Explainer)',
    badge: 'تطبيقات وذكاء اصطناعي',
    icon: Cpu,
    defaultTitle: 'استراتيجية إطلاق التطبيق والخدمة الرقمية بفيديوهات AI وموشن',
    defaultSubtitle: 'تبسيط الفكرة وجذب المستخدمين لتنزيل التطبيق وتجربة الخدمة',
    primaryService: 'فيديوهات موشن جرافيك 2D/3D، فيديوهات AI، وإعلانات App Installs',
    timeline: '3 أسابيع عمل',
    objective: 'شرح فكرة التطبيق وحلوله في أقل من 60 ثانية للمستخدم وجذب أكبر عدد من التنزيلات والتسجيلات الجديدة.',
    creativeConcept: 'استخدام الرسوم المتحركة السلسة بأسلوب الموشن جرافيك الحديث لإظهار سهولة الاستخدام، مدعومة بأفاتار AI تفاعلي يتحدث مباشرة إلى الجمهور.',
    deliverablesList: [
      'فيديو موشن جرافيك توضيحي رئيسي للتطبيق (Explainer Video - 60 ثانية)',
      '3 فيديوهات بالذكاء الاصطناعي مع عارضين افتراضيين AI لشرح المزايا',
      'تصميم لقطات شاشة التطبيق (App Store & Google Play Screenshots)',
      'إطلاق حملة إعلانات تثبيت التطبيق (App Install Ads) على تيك توك وجوجل'
    ],
    executionPhases: [
      { phase: 'المرحلة 1: سكريبت الموشن وتوليد الشخصيات', duration: 'الأسبوع 1', details: 'كتابة السيناريو التوضيحي، رسم الـ Storyboard، واختيار التعليق الصوتي المناسب.' },
      { phase: 'المرحلة 2: تحريك الموشن وتوليد محتوى AI', duration: 'الأسبوع 2', details: 'تحريك المشاهد في After Effects، توليد أفاتار AI الناطق، والمؤثرات الصوتية.' },
      { phase: 'المرحلة 3: المونتاج والتنسيقات المتعددة', duration: 'الأسبوع 3', details: 'تصدير مقاسات متعددة (سناب، تيك توك، يوتيوب، إنستجرام).' },
      { phase: 'المرحلة 4: إطلاق حملة التنزيلات', duration: 'الأسبوع 4', details: 'إطلاق الحملات الممولة لتثبيت التطبيق ومراقبة تكلفة التنزيل لكل مستخدم.' }
    ],
    whyUsPoints: [
      'رسوم موشن جرافيك حصرية ومخصصة تماماً لواجهة وتجربة تطبيقك',
      'أحدث تقنيات توليد الفيديوهات والأصوات بالذكاء الاصطناعي بجودة واقعية',
      'خبرة في زيادة معدلات التحويل من المتجر للتطبيق',
      'شعارنا: we create your thinking - نبسط أفكارك المعقدة بإبهار'
    ]
  }
];

export default function ProposalsView({
  proposals = [],
  clients = [],
  agencySettings,
  currency = 'ج.م',
  selectedClientId,
  onSaveProposal,
  onDeleteProposal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState(selectedClientId || 'ALL');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideshowTheme, setSlideshowTheme] = useState('dark'); // 'dark' or 'light'

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    companyName: '',
    templateId: 'ads_campaign',
    title: '',
    subtitle: '',
    date: new Date().toISOString().split('T')[0],
    primaryService: '',
    budget: '',
    timeline: '',
    objective: '',
    creativeConcept: '',
    deliverablesList: [],
    executionPhases: [],
    whyUsPoints: []
  });

  const applyTemplate = (tplId) => {
    const tpl = PROPOSAL_TEMPLATES.find(t => t.id === tplId) || PROPOSAL_TEMPLATES[0];
    setFormData(prev => ({
      ...prev,
      templateId: tpl.id,
      title: prev.title || tpl.defaultTitle,
      subtitle: prev.subtitle || tpl.defaultSubtitle,
      primaryService: tpl.primaryService,
      timeline: tpl.timeline,
      objective: tpl.objective,
      creativeConcept: tpl.creativeConcept,
      deliverablesList: [...tpl.deliverablesList],
      executionPhases: JSON.parse(JSON.stringify(tpl.executionPhases)),
      whyUsPoints: [...tpl.whyUsPoints]
    }));
  };

  const openCreateModal = () => {
    setEditingProposal(null);
    const preClient = clientFilter !== 'ALL' ? clients.find(c => c.id === clientFilter) : clients[0];
    const defaultTpl = PROPOSAL_TEMPLATES[0];

    setFormData({
      clientId: preClient ? preClient.id : '',
      clientName: preClient ? preClient.name : '',
      companyName: preClient ? preClient.companyName : '',
      templateId: defaultTpl.id,
      title: defaultTpl.defaultTitle,
      subtitle: defaultTpl.defaultSubtitle,
      date: new Date().toISOString().split('T')[0],
      primaryService: defaultTpl.primaryService,
      budget: preClient?.contractValue || '',
      timeline: defaultTpl.timeline,
      objective: defaultTpl.objective,
      creativeConcept: defaultTpl.creativeConcept,
      deliverablesList: [...defaultTpl.deliverablesList],
      executionPhases: JSON.parse(JSON.stringify(defaultTpl.executionPhases)),
      whyUsPoints: [...defaultTpl.whyUsPoints]
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (p, e) => {
    if (e) e.stopPropagation();
    setEditingProposal(p);
    setFormData({
      clientId: p.clientId || '',
      clientName: p.clientName || '',
      companyName: p.companyName || '',
      templateId: p.templateId || 'ads_campaign',
      title: p.title || '',
      subtitle: p.subtitle || '',
      date: p.date || new Date().toISOString().split('T')[0],
      primaryService: p.primaryService || '',
      budget: p.budget || '',
      timeline: p.timeline || '',
      objective: p.objective || '',
      creativeConcept: p.creativeConcept || '',
      deliverablesList: p.deliverablesList && p.deliverablesList.length ? [...p.deliverablesList] : [],
      executionPhases: p.executionPhases && p.executionPhases.length ? JSON.parse(JSON.stringify(p.executionPhases)) : [],
      whyUsPoints: p.whyUsPoints && p.whyUsPoints.length ? [...p.whyUsPoints] : []
    });
    setIsFormModalOpen(true);
  };

  // Deliverables item helper
  const addDeliverableItem = () => {
    setFormData(prev => ({
      ...prev,
      deliverablesList: [...prev.deliverablesList, 'مخرج عمل جديد']
    }));
  };

  const updateDeliverableItem = (idx, value) => {
    setFormData(prev => {
      const list = [...prev.deliverablesList];
      list[idx] = value;
      return { ...prev, deliverablesList: list };
    });
  };

  const removeDeliverableItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      deliverablesList: prev.deliverablesList.filter((_, i) => i !== idx)
    }));
  };

  // Phase helper
  const updatePhase = (idx, field, value) => {
    setFormData(prev => {
      const phases = [...prev.executionPhases];
      phases[idx] = { ...phases[idx], [field]: value };
      return { ...prev, executionPhases: phases };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) return alert('يرجى تحديد اسم العميل أو الشركة');
    if (!formData.title.trim()) return alert('يرجى كتابة عنوان العرض التقديمي');

    await onSaveProposal(formData, editingProposal ? editingProposal.id : null);
    setIsFormModalOpen(false);
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPresenting) return;
      if (e.key === 'ArrowLeft') nextSlide();
      if (e.key === 'ArrowRight') prevSlide();
      if (e.key === 'Escape') setIsPresenting(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, currentSlide]);

  const startPresentation = (proposal) => {
    setSelectedProposal(proposal);
    setCurrentSlide(0);
    setIsPresenting(true);
  };

  const nextSlide = () => {
    if (currentSlide < 6) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  // Filter proposals
  const filtered = proposals.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.companyName && p.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClient = clientFilter === 'ALL' || p.clientId === clientFilter;
    return matchesSearch && matchesClient;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Control Bar: Search & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm no-print">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="البحث في العروض التقديمية باسم العميل، البراند، أو الحملة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#134C5C] focus:bg-white transition"
          />
        </div>

        {/* Client filter & Add button */}
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

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold shadow-md shadow-[#134C5C]/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء عرض تقديمي (Pitch Deck)</span>
          </button>

        </div>
      </div>

      {/* Proposals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 no-print">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Presentation className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">لا توجد عروض تقديمية مسجلة بعد</h4>
            <p className="text-xs text-slate-500 mt-1">اختر قالباً وأنشئ عرضاً تقديمياً مبهراً لعرضه على العميل قبل البدء في التنفيذ</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between space-y-4 group"
            >
              
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#134C5C]/10 text-[#134C5C] border border-[#134C5C]/20 font-bold">
                      {p.proposalNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#134C5C] transition mt-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{p.subtitle}</p>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-xs text-slate-500 block">العميل المستهدف:</span>
                    <strong className="text-sm text-slate-900 font-bold">{p.clientName}</strong>
                    {p.companyName && (
                      <span className="text-xs text-slate-500 block">({p.companyName})</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {p.objective}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>الجدول الزمني: <strong className="text-slate-800">{p.timeline}</strong></span>
                  <span>•</span>
                  <span>الميزانية المقترحة: <strong className="text-emerald-600 font-mono">{(Number(p.budget) || 0).toLocaleString()} {currency}</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  
                  {/* Start Slideshow Presentation */}
                  <button
                    onClick={() => startPresentation(p)}
                    className="px-4 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
                  >
                    <Presentation className="w-4 h-4 text-white" />
                    <span>تشغيل العرض (Slideshow)</span>
                  </button>

                  {/* Edit Proposal Button */}
                  <button
                    onClick={(e) => openEditModal(p, e)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                    title="تعديل محتوى العرض التقديمي"
                  >
                    <Edit className="w-4 h-4 text-[#134C5C]" />
                  </button>

                  {/* Print / Export Deck */}
                  <button
                    onClick={() => {
                      setSelectedProposal(p);
                      setIsPrintModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
                    title="معاينة وطباعة ملف العرض التقديمي"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`هل أنت متأكد من حذف العرض التقديمي "${p.title}"؟`)) {
                      onDeleteProposal(p.id);
                    }
                  }}
                  className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                  title="حذف العرض"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* ----------------- CREATE / EDIT PROPOSAL MODAL WITH TEMPLATES ----------------- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn no-print">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Presentation className="w-5 h-5 text-[#134C5C]" />
                  <span>{editingProposal ? `تعديل العرض التقديمي: ${editingProposal.title}` : 'إنشاء عرض تقديمي (Pitch Deck) جديد'}</span>
                </h3>
                <p className="text-xs text-slate-500">اختر من القوالب الجاهزة أو خصص كل شريحة بحسب العميل والحملة</p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selection Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">اختر قالب العرض التقديمي المناسب للحملة:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PROPOSAL_TEMPLATES.map(tpl => {
                  const Icon = tpl.icon;
                  const isSelected = formData.templateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => applyTemplate(tpl.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                        isSelected 
                          ? 'bg-[#134C5C]/10 border-[#134C5C] text-[#134C5C] shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#134C5C]' : 'text-slate-400'}`} />
                      <div>
                        <div className="font-bold">{tpl.name}</div>
                        <span className="text-[10px] text-slate-500">{tpl.badge}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">اختر عميل مسجل</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => {
                      const cid = e.target.value;
                      const c = clients.find(item => item.id === cid);
                      setFormData({
                        ...formData,
                        clientId: cid,
                        clientName: c ? c.name : formData.clientName,
                        companyName: c ? c.companyName : formData.companyName,
                        budget: c ? c.contractValue : formData.budget
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-[#134C5C]"
                  >
                    <option value="">-- أو عميل جديد / محتمل --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.companyName ? `(${c.companyName})` : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">اسم العميل *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-[#134C5C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">اسم الشركة / البراند</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-[#134C5C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">الميزانية المقترحة ({currency})</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:bg-white focus:border-[#134C5C]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1.5">عنوان العرض التقديمي</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-[#134C5C]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1.5">العنوان الفرعي / الوصف المختصر</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-[#134C5C]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1.5">الهدف الاستراتيجي من المشروع (Objective)</label>
                  <textarea
                    rows="2"
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 resize-none focus:bg-white focus:border-[#134C5C]"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1.5">الفكرة الإبداعية والرؤية البصرية (Creative Concept)</label>
                  <textarea
                    rows="2"
                    value={formData.creativeConcept}
                    onChange={(e) => setFormData({ ...formData, creativeConcept: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 resize-none focus:bg-white focus:border-[#134C5C]"
                  ></textarea>
                </div>
              </div>

              {/* Editable Deliverables Scope */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">قائمة المخرجات المقترحة للعميل (Deliverables):</label>
                  <button
                    type="button"
                    onClick={addDeliverableItem}
                    className="text-[11px] text-[#134C5C] font-bold hover:underline"
                  >
                    + إضافة مخرج جديد
                  </button>
                </div>
                <div className="space-y-1.5">
                  {formData.deliverablesList.map((del, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-slate-400">{i + 1}.</span>
                      <input
                        type="text"
                        value={del}
                        onChange={(e) => updateDeliverableItem(i, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeDeliverableItem(i)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editable Execution Phases */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="font-bold text-slate-800">مراحل التنفيذ وخريطة العمل الزمنية (Roadmap):</label>
                <div className="space-y-2">
                  {formData.executionPhases.map((phase, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="اسم المرحلة"
                          value={phase.phase}
                          onChange={(e) => updatePhase(i, 'phase', e.target.value)}
                          className="col-span-2 px-2 py-1 rounded bg-white border border-slate-300 text-slate-900 font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="المدة (مثلاً: الأسبوع 1)"
                          value={phase.duration}
                          onChange={(e) => updatePhase(i, 'duration', e.target.value)}
                          className="col-span-1 px-2 py-1 rounded bg-white border border-slate-300 text-slate-900 text-center font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="تفاصيل ومخرجات هذه المرحلة..."
                        value={phase.details}
                        onChange={(e) => updatePhase(i, 'details', e.target.value)}
                        className="w-full px-2 py-1 rounded bg-white border border-slate-300 text-slate-700 text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white font-bold shadow-md shadow-[#134C5C]/20"
                >
                  {editingProposal ? 'حفظ تعديلات العرض' : 'حفظ العرض التقديمي'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ----------------- FULL-SCREEN SLIDESHOW PRESENTATION MODE ----------------- */}
      {isPresenting && selectedProposal && (
        <div className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 animate-fadeIn select-none ${
          slideshowTheme === 'dark' ? 'bg-[#071419] text-white' : 'bg-white text-slate-900'
        }`}>
          
          {/* Top Bar inside Slideshow */}
          <div className={`flex items-center justify-between border-b pb-4 ${
            slideshowTheme === 'dark' ? 'border-[#1a3c48]/80' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="h-10 px-2.5 py-1 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-xs">
                <img src="/logo.png" alt="AG-media" className="h-8 w-auto object-contain" />
              </div>
              <div>
                <span className="text-xs font-mono tracking-tight font-bold text-[#134C5C]">we create your thinking</span>
                <span className={`text-xs block ${slideshowTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  عرض تقديمي خاص بـ: {selectedProposal.clientName} ({selectedProposal.companyName})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle (Dark/Light slideshow) */}
              <button
                onClick={() => setSlideshowTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-xl border transition ${
                  slideshowTheme === 'dark' 
                    ? 'bg-[#0b1d24] text-amber-300 border-[#1a3c48]' 
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="تبديل مظهر العرض (داكن / فاتح)"
              >
                {slideshowTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <span className={`text-xs px-3 py-1 rounded-full border font-mono ${
                slideshowTheme === 'dark' 
                  ? 'bg-[#0b1d24] text-[#87c2cf] border-[#1a3c48]' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                شريحة {currentSlide + 1} من 7
              </span>

              <button
                onClick={() => setIsPresenting(false)}
                className={`p-2 rounded-xl transition ${
                  slideshowTheme === 'dark' ? 'bg-[#0b1d24] hover:bg-[#1a3c48] text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="إغلاق العرض (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slide Content Body */}
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
              
              {/* SLIDE 0: Cover Slide */}
              {currentSlide === 0 && (
                <div className="text-center space-y-6">
                  <div className="inline-block p-4 bg-white rounded-2xl shadow-xl border-2 border-[#134C5C]">
                    <img src="/logo.png" alt="AG-media" className="h-20 sm:h-24 mx-auto object-contain" />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <span className="text-xs uppercase tracking-widest text-[#134C5C] font-bold bg-[#134C5C]/10 px-3 py-1 rounded-full border border-[#134C5C]/20">
                      Project Strategy & Creative Proposal
                    </span>
                    <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${
                      slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {selectedProposal.title}
                    </h1>
                    <p className={`text-lg font-medium max-w-xl mx-auto ${
                      slideshowTheme === 'dark' ? 'text-[#87c2cf]' : 'text-[#134C5C]'
                    }`}>
                      {selectedProposal.subtitle}
                    </p>
                  </div>

                  <div className={`pt-6 border-t max-w-md mx-auto flex items-center justify-between text-xs ${
                    slideshowTheme === 'dark' ? 'border-[#1a3c48] text-slate-400' : 'border-slate-200 text-slate-500'
                  }`}>
                    <div>
                      <span>العميل: </span>
                      <strong className={`text-sm ${slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {selectedProposal.clientName}
                      </strong>
                      {selectedProposal.companyName && <span className="block">({selectedProposal.companyName})</span>}
                    </div>
                    <div>
                      <span>التاريخ: </span>
                      <strong className={slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'}>
                        {selectedProposal.date}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 1: About AG-media */}
              {currentSlide === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs text-[#134C5C] font-bold uppercase tracking-wider">من نحن • About AG-media</span>
                    <h2 className={`text-2xl sm:text-4xl font-extrabold ${
                      slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      نحن لا نصنع محتوى عادياً، بل "نخلق طريقة تفكيرك"
                    </h2>
                    <p className={`text-sm leading-relaxed ${
                      slideshowTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      وكالة AG-media هي بيت خبرة إبداعي متكامل يجمع بين أرقى تقنيات الإنتاج البصري السينمائي والذكاء الاصطناعي مع علوم التسويق الرقمي الحديث بالأرقام، لتمكين البراندات من احتلال الصدارة في أذهان جمهورها المستهدف.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className={`p-4 rounded-2xl border space-y-2 ${
                      slideshowTheme === 'dark' ? 'bg-[#0b1d24] border-[#1a3c48]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="p-2.5 w-fit rounded-xl bg-[#134C5C]/10 text-[#134C5C]">
                        <Video className="w-5 h-5" />
                      </div>
                      <h4 className={`font-bold text-sm ${slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        إنتاج سينمائي 4K
                      </h4>
                      <p className={`text-xs ${slideshowTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        كاميرات سينمائية احترافية، درون جوي، وهندسة إضاءة سينمائية متقدمة.
                      </p>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-2 ${
                      slideshowTheme === 'dark' ? 'bg-[#0b1d24] border-[#1a3c48]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="p-2.5 w-fit rounded-xl bg-[#134C5C]/10 text-[#134C5C]">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h4 className={`font-bold text-sm ${slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        تقنيات AI والموشن
                      </h4>
                      <p className={`text-xs ${slideshowTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        فيديوهات ذكاء اصطناعي وأفاتار وموشن جرافيك 2D/3D عالي الإبهار.
                      </p>
                    </div>

                    <div className={`p-4 rounded-2xl border space-y-2 ${
                      slideshowTheme === 'dark' ? 'bg-[#0b1d24] border-[#1a3c48]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="p-2.5 w-fit rounded-xl bg-[#134C5C]/10 text-[#134C5C]">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <h4 className={`font-bold text-sm ${slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        ميديا باينج بالأرقام
                      </h4>
                      <p className={`text-xs ${slideshowTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        إدارة دقيقة للحملات الممولة على ميتا وتيك توك لتحقيق أعلى عائد للإنفاق.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: Strategy & Objective */}
              {currentSlide === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs text-[#134C5C] font-bold uppercase tracking-wider">الاستراتيجية • Strategic Direction</span>
                    <h2 className={`text-2xl sm:text-4xl font-extrabold ${
                      slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      الهدف والرؤية الإبداعية لمشروعكم
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className={`p-6 rounded-2xl border space-y-3 ${
                      slideshowTheme === 'dark' ? 'bg-[#0b1d24] border-[#1a3c48]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <h4 className="text-base font-bold text-[#134C5C] flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>الهدف الرئيسي من المشروع:</span>
                      </h4>
                      <p className={`text-sm leading-relaxed ${
                        slideshowTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        {selectedProposal.objective}
                      </p>
                    </div>

                    <div className={`p-6 rounded-2xl border space-y-3 ${
                      slideshowTheme === 'dark' ? 'bg-[#0b1d24] border-[#1a3c48]' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <h4 className="text-base font-bold text-[#134C5C] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span>الفكرة الإبداعية والتنفيذ:</span>
                      </h4>
                      <p className={`text-sm leading-relaxed ${
                        slideshowTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        {selectedProposal.creativeConcept}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 3: Proposed Deliverables */}
              {currentSlide === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs text-[#134C5C] font-bold uppercase tracking-wider">نطاق العمل • Deliverables Scope</span>
                    <h2 className={`text-2xl sm:text-4xl font-extrabold ${
                      slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      ما سيتم تسليمه وتنفيذه في هذا التعاقد
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {selectedProposal.deliverablesList?.map((del, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-start gap-3 ${
                          slideshowTheme === 'dark' ? 'bg-[#0b1d24] border-[#1a3c48]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#134C5C] text-white font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <p className={`text-sm font-bold mt-1 ${
                            slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                          }`}>{del}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 4: Execution Phases */}
              {currentSlide === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs text-[#134C5C] font-bold uppercase tracking-wider">خطة العمل • Execution Roadmap</span>
                    <h2 className={`text-2xl sm:text-4xl font-extrabold ${
                      slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      مراحل وجدول تنفيذ المشروع ({selectedProposal.timeline})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {selectedProposal.executionPhases?.map((phase, idx) => (
                      <div 
                        key={idx}
                        className={`p-5 rounded-2xl border space-y-2 ${
                          slideshowTheme === 'dark' ? 'bg-[#0b1d24] border-[#1a3c48]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {phase.duration}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#134C5C]">المرحلة {idx + 1}</span>
                        </div>
                        <h4 className={`text-base font-bold ${
                          slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>{phase.phase}</h4>
                        <p className={`text-xs leading-relaxed ${
                          slideshowTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                        }`}>{phase.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLIDE 5: Investment & Value */}
              {currentSlide === 5 && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <span className="text-xs text-[#134C5C] font-bold uppercase tracking-wider">الاستثمار المالي • Investment</span>
                    <h2 className={`text-2xl sm:text-4xl font-extrabold ${
                      slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      قيمة الاستثمار المتفق عليها للمشروع
                    </h2>
                  </div>

                  <div className={`p-8 rounded-3xl border-2 border-[#134C5C] max-w-lg mx-auto space-y-4 shadow-xl ${
                    slideshowTheme === 'dark' ? 'bg-[#0b1d24]' : 'bg-slate-50'
                  }`}>
                    <span className="text-xs text-slate-500">إجمالي تكلفة الباكدج المتكاملة:</span>
                    <div className="text-4xl sm:text-5xl font-black text-emerald-600 font-mono">
                      {(Number(selectedProposal.budget) || 0).toLocaleString()} <span className="text-xl text-slate-500">{currency}</span>
                    </div>
                    <div className={`h-px w-full my-2 ${slideshowTheme === 'dark' ? 'bg-[#1a3c48]' : 'bg-slate-200'}`}></div>
                    <p className={`text-xs ${slideshowTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      تشمل كامل مخرجات التصميم والمونتاج السينمائي والموشن جرافيك وإدارة الحملات الإعلانية ومتابعة النتائج طوال مدة {selectedProposal.timeline}.
                    </p>
                  </div>
                </div>
              )}

              {/* SLIDE 6: Why AG-media & Call to Action */}
              {currentSlide === 6 && (
                <div className="space-y-6">
                  <div className="space-y-2 text-center">
                    <span className="text-xs text-[#134C5C] font-bold uppercase tracking-wider">لماذا AG-media؟ • Why Us</span>
                    <h2 className={`text-2xl sm:text-4xl font-extrabold ${
                      slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      معاً نصنع الفارق الحقيقي في السوق
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {selectedProposal.whyUsPoints?.map((pt, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-2xl border flex items-start gap-3 ${
                          slideshowTheme === 'dark' ? 'bg-[#0b1d24] border-[#1a3c48]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className={`text-xs font-semibold leading-relaxed ${
                          slideshowTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                        }`}>{pt}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-6 space-y-2">
                    <p className={`text-sm font-bold ${slideshowTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      جاهزون لبدء رحلة النجاح معكم!
                    </p>
                    <p className="text-xs text-[#134C5C] font-mono font-bold">AG-media • we create your thinking</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Bottom Navigation Controls in Slideshow */}
          <div className={`flex items-center justify-between border-t pt-4 ${
            slideshowTheme === 'dark' ? 'border-[#1a3c48]/80' : 'border-slate-200'
          }`}>
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition disabled:opacity-30 ${
                slideshowTheme === 'dark' 
                  ? 'bg-[#0b1d24] hover:bg-[#1a3c48] text-white border-[#1a3c48]' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>الشريحة السابقة</span>
            </button>

            {/* Slide dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map(idx => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentSlide === idx ? 'w-8 bg-[#134C5C]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === 6}
              className="px-4 py-2 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] disabled:opacity-30 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm"
            >
              <span>الشريحة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ----------------- PRINTABLE PROPOSAL DECK MODAL ----------------- */}
      {isPrintModalOpen && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl max-h-[96vh] overflow-y-auto p-6 sm:p-10 space-y-8 shadow-2xl print-card">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 no-print">
              <span className="text-xs font-bold text-slate-500">العرض التقديمي للطباعة وحفظ PDF</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة / حفظ PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-8">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#134C5C] pb-6">
                <div>
                  <img src="/logo.png" alt="AG-media" className="h-14 w-auto object-contain" />
                  <p className="text-xs font-bold text-[#134C5C] mt-1 font-mono">we create your thinking</p>
                </div>
                <div className="text-left text-xs text-slate-600">
                  <div className="font-bold text-slate-900 text-sm">{selectedProposal.proposalNumber}</div>
                  <div>تاريخ العرض: {selectedProposal.date}</div>
                  <div>العميل: <strong className="text-[#134C5C]">{selectedProposal.clientName}</strong></div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-2 py-4 border-b border-slate-100">
                <h1 className="text-2xl font-black text-slate-900">{selectedProposal.title}</h1>
                <p className="text-sm text-slate-600 font-semibold">{selectedProposal.subtitle}</p>
              </div>

              {/* Strategy & Objective */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-sm font-bold text-[#134C5C] block">الهدف الرئيسي:</strong>
                  <p className="text-slate-700 leading-relaxed">{selectedProposal.objective}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-sm font-bold text-[#134C5C] block">الفكرة الإبداعية:</strong>
                  <p className="text-slate-700 leading-relaxed">{selectedProposal.creativeConcept}</p>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#134C5C]">نطاق العمل والمخرجات المتفق عليها:</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedProposal.deliverablesList?.map((del, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#134C5C] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phases */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#134C5C]">مراحل وخريطة العمل الزمنية ({selectedProposal.timeline}):</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {selectedProposal.executionPhases?.map((phase, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{phase.phase}</span>
                        <span className="text-[#134C5C]">{phase.duration}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{phase.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment & Signatures */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">إجمالي الاستثمار المقترح للمشروع:</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {(Number(selectedProposal.budget) || 0).toLocaleString()} {currency}
                  </span>
                </div>

                <div className="text-left font-mono text-[11px] text-[#134C5C] font-bold">
                  AG-media • we create your thinking
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
