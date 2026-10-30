const initialData = {
  settings: {
    agencyName: "AG-media",
    agencyFullName: "وكالة AG-media للإنتاج الرقمي والتسويق",
    tagline: "we create your thinking",
    servicesTagline: "تصميم جرافيك • مونتاج وتصوير • موشن جرافيك • فيديوهات AI • إعلانات ممولة",
    logoUrl: "/logo.png",
    primaryColor: "#134C5C",
    currency: "EGP",
    currencySymbol: "ج.م",
    phone: "+20 100 234 5678",
    email: "contact@agmedia.agency",
    website: "www.agmedia.agency",
    address: "القاهرة، جمهورية مصر العربية",
    paymentMethods: [
      { name: "فودافون كاش (Vodafone Cash)", details: "01002345678" },
      { name: "إنستاباي (InstaPay)", details: "agmedia@instapay" },
      { name: "تحويل بنكي - البنك الأهلي المصري", details: "IBAN: EG4500030000012345678901234" },
      { name: "تحويل بنكي - بنك CIB", details: "حساب رقم: 10005432198" },
      { name: "دفع نقدي (Cash)", details: "استلام بمقر الشركة أو عبر مندوب" }
    ],
    invoiceFooterNote: "شكراً لثقتكم في AG-media - we create your thinking. نلتزم بتقديم أعلى معايير الجودة والإبداع في عالم الميديا والإعلانات."
  },
  clients: [
    {
      id: "cli_1",
      name: "م. كريم عبد الرحمن",
      companyName: "شركة إيليت هوم للتطوير العقاري",
      phone: "01098765432",
      email: "info@elitehome-eg.com",
      acquisitionChannel: "إعلانات ممولة (Facebook / Instagram)",
      startDate: "2026-09-01",
      contractValue: 45000,
      status: "نشط",
      notes: "باكيدج تسويق وإنتاج شهري يشمل إعلانات العقارات الجديدة مع فيديوهات تصوير ميداني وموشن جرافيك.",
      servicesAgreed: [
        "مونتاج فيديوهات وتصويرها",
        "تصميم جرافيك",
        "عمل فيديوهات موشن جرافيك",
        "انشاء الاعلانات المموله"
      ],
      createdAt: "2026-09-01T10:00:00Z"
    },
    {
      id: "cli_2",
      name: "أ. سارة المنشاوي",
      companyName: "براند فيلفيت لمستحضرات التجميل",
      phone: "01123456789",
      email: "contact@velvetcosmetics.com",
      acquisitionChannel: "ترشيح من عميل سابق (Referral)",
      startDate: "2026-09-15",
      contractValue: 28000,
      status: "نشط",
      notes: "إطلاق خط منتجات جديد - الاعتماد على فيديوهات الـ AI وفيديوهات ريلز للمنتجات مع حملات مبيعات مركزة.",
      servicesAgreed: [
        "تصميم جرافيك",
        "عمل فيديوهات ai",
        "مونتاج فيديوهات وتصويرها",
        "انشاء الاعلانات المموله"
      ],
      createdAt: "2026-09-15T11:30:00Z"
    },
    {
      id: "cli_3",
      name: "د. حازم القاضي",
      companyName: "مجمع عيادات الدلتا التخصصية",
      phone: "01234567801",
      email: "info@deltaclinics.org",
      acquisitionChannel: "تواصل مباشر عبر واتساب",
      startDate: "2026-10-01",
      contractValue: 35000,
      status: "نشط",
      notes: "حملة توعية طبية + براندينج للأطباء مع فيديوهات موشن جرافيك لشرح العمليات وتصوير مقابلات دكاترة.",
      servicesAgreed: [
        "تصميم جرافيك",
        "مونتاج فيديوهات وتصويرها",
        "عمل فيديوهات موشن جرافيك",
        "انشاء الاعلانات المموله"
      ],
      createdAt: "2026-10-01T09:15:00Z"
    },
    {
      id: "cli_4",
      name: "أ. عمر الشناوي",
      companyName: "تطبيق وصلني لايت (سيرفيس موبايل)",
      phone: "01555544433",
      email: "ceo@wasalny-app.com",
      acquisitionChannel: "إعلانات تيك توك (TikTok Ads)",
      startDate: "2026-10-05",
      contractValue: 22000,
      status: "نشط",
      notes: "فيديوهات موشن جرافيك لشرح طريقة استخدام التطبيق + حملة إعلانات تثبيت التطبيق وتوليد ليدز.",
      servicesAgreed: [
        "عمل فيديوهات موشن جرافيك",
        "عمل فيديوهات ai",
        "انشاء الاعلانات المموله"
      ],
      createdAt: "2026-10-05T14:20:00Z"
    },
    {
      id: "cli_5",
      name: "أ. نورهان الشاذلي",
      companyName: "مطعم وبرجر فاكتوري",
      phone: "01011223344",
      email: "burgerfactory.eg@gmail.com",
      acquisitionChannel: "معرض الأعمال (Behance / Instagram Page)",
      startDate: "2026-08-10",
      contractValue: 18000,
      status: "مكتمل",
      notes: "تصوير المنيو الجديد، مونتاج ريلز جاذبة للطعام، وتصميم منيو وبوستات سوشيال ميديا.",
      servicesAgreed: [
        "تصميم جرافيك",
        "مونتاج فيديوهات وتصويرها"
      ],
      createdAt: "2026-08-10T12:00:00Z"
    }
  ],
  deliverables: [
    {
      id: "del_101",
      clientId: "cli_1",
      serviceType: "تصميم جرافيك",
      title: "تصميم بوستات سوشيال ميديا للعقارات (16 تصميماً)",
      description: "تصميم بوستات فيسبوك وإنستجرام للمشروع السكني الجديد تشمل بلانات الوحدات وعروض التقسيط",
      quantityTotal: 16,
      quantityCompleted: 12,
      status: "قيد التنفيذ",
      unit: "تصميم",
      dueDate: "2026-10-28",
      notes: "تم تسليم 12 تصميم واعتمدها العميل، متبقي 4 تصاميم خاصة بعروض نهاية الشهر."
    },
    {
      id: "del_102",
      clientId: "cli_1",
      serviceType: "مونتاج فيديوهات وتصويرها",
      title: "تصوير ومونتاج فيديوهات للموقع والفلل (4 فيديوهات ريلز)",
      description: "تصوير ميداني درون وكاميرا سينمائية لموقع الكمبوند مع مونتاج ريلز ديناميكي مع ساوند تراك احترافي",
      quantityTotal: 4,
      quantityCompleted: 3,
      status: "قيد التنفيذ",
      unit: "فيديو",
      dueDate: "2026-10-30",
      notes: "تم تصوير 4 فيديوهات، تم إنهاء مونتاج 3 ونشرها، الفيديو الأخير قيد المونتاج والتعديل الصوتي."
    },
    {
      id: "del_103",
      clientId: "cli_1",
      serviceType: "عمل فيديوهات موشن جرافيك",
      title: "فيديو موشن جرافيك توضيحي لنظام السداد والموقع (60 ثانية)",
      description: "سيناريو موشن جرافيك يشرح مميزات الموقع الاستراتيجي وأنظمة السداد والتقسيط على 8 سنوات",
      quantityTotal: 1,
      quantityCompleted: 1,
      status: "تم التسليم",
      unit: "فيديو",
      dueDate: "2026-10-15",
      notes: "تم الانتهاء بالكامل واعتماد العميل وإضافة الفويس أوفر الاحترافي."
    },
    {
      id: "del_104",
      clientId: "cli_1",
      serviceType: "انشاء الاعلانات المموله",
      title: "إدارة وإطلاق حملات إعلانات ميتا (Facebook & Instagram Ads)",
      description: "إعداد حملة ليدز (Lead Generation) للمهتمين بشراء فلل ووحدات سكنية + إعادة استهداف الزوار",
      quantityTotal: 2,
      quantityCompleted: 2,
      status: "تم التسليم",
      unit: "حملة إعلانية",
      dueDate: "2026-10-31",
      notes: "الحملات تحقق تكلفة ليد ممتازة بمعدل 42 جنيه للعميل المحتمل وجودة عالية."
    },
    {
      id: "del_201",
      clientId: "cli_2",
      serviceType: "عمل فيديوهات ai",
      title: "إنتاج فيديوهات ترويجية تفاعلية بالذكاء الاصطناعي (AI Avatars & B-Roll)",
      description: "توليد فيديوهات بمؤثرات سينمائية وموديلز AI لعرض تجربة استخدام كريم الأساس والمصل المغذي",
      quantityTotal: 5,
      quantityCompleted: 4,
      status: "قيد التنفيذ",
      unit: "فيديو AI",
      dueDate: "2026-10-27",
      notes: "تم تسليم 4 فيديوهات لاقت إعجاب العميل، جاري توليد الفيديو الخامس باللغة الإنجليزية."
    },
    {
      id: "del_202",
      clientId: "cli_2",
      serviceType: "تصميم جرافيك",
      title: "تصميم باكدج السوشيال ميديا وهوية المنشورات (12 بوست + ستوري)",
      description: "قوالب منشورات متناسقة مع ألوان البراند الفاخرة لصفحة الإنستجرام",
      quantityTotal: 12,
      quantityCompleted: 12,
      status: "تم التسليم",
      unit: "تصميم",
      dueDate: "2026-10-20",
      notes: "تم إنجاز وتسليم كامل التصاميم الـ 12 مع ملفات العمل."
    },
    {
      id: "del_203",
      clientId: "cli_2",
      serviceType: "انشاء الاعلانات المموله",
      title: "إطلاق حملة مبيعات كتالوج ومنتجات على إنستجرام وتيك توك",
      description: "استهداف المهتمات بالعناية بالبشرة والميك اب في مصر والخليج",
      quantityTotal: 2,
      quantityCompleted: 1,
      status: "قيد المراجعة",
      unit: "حملة",
      dueDate: "2026-10-29",
      notes: "حملة إنستجرام تعمل حالياً، حملة تيك توك تم تجهيزها وفي انتظار موافقة العميل على الميزانية اليومية."
    },
    {
      id: "del_301",
      clientId: "cli_3",
      serviceType: "مونتاج فيديوهات وتصويرها",
      title: "تصوير ومونتاج مقابلات دكاترة وفيديوهات طبية قصيرة (8 فيديوهات)",
      description: "يوم تصوير كامل بالعيادات ومونتاج ريلز طبية توعوية مع كتابة الكابشن وتنسيق الألوان",
      quantityTotal: 8,
      quantityCompleted: 5,
      status: "قيد التنفيذ",
      unit: "فيديو",
      dueDate: "2026-11-05",
      notes: "تم تصوير اليوم بالكامل، سلمنا 5 فيديوهات، و3 فيديوهات قيد الجرافيك والمونتاج."
    },
    {
      id: "del_302",
      clientId: "cli_3",
      serviceType: "عمل فيديوهات موشن جرافيك",
      title: "فيديو موشن جرافيك لخدمات العيادات وجراحات اليوم الواحد (45 ثانية)",
      description: "رسوم متحركة جذابة وسلسة تشرح كيفية الحجز والخدمات الطبية المتاحة",
      quantityTotal: 1,
      quantityCompleted: 0,
      status: "لم يبدأ",
      unit: "فيديو",
      dueDate: "2026-11-10",
      notes: "تمت كتابة الاسكريبت وسيتم تسجيل التعليق الصوتي الأسبوع القادم."
    },
    {
      id: "del_401",
      clientId: "cli_4",
      serviceType: "عمل فيديوهات موشن جرافيك",
      title: "فيديو إعلاني موشن جرافيك ترويجي للتطبيق (30 ثانية)",
      description: "موشن سريع عصري بأسلوب الـ 2D مع مؤثرات صوتية حماسية لمستخدمي التطبيق",
      quantityTotal: 1,
      quantityCompleted: 1,
      status: "تم التسليم",
      unit: "فيديو",
      dueDate: "2026-10-18",
      notes: "تم التسليم النهائي مع صيغ متعددة لمقاسات تيك توك وسناب شات."
    },
    {
      id: "del_402",
      clientId: "cli_4",
      serviceType: "انشاء الاعلانات المموله",
      title: "إدارة حملة تثبيت التطبيق App Installs على تيك توك وجوجل",
      description: "إعلانات فيديو موشن + AI لجذب تنزيلات التطبيق في محافظات الدلتا والقاهرة",
      quantityTotal: 1,
      quantityCompleted: 1,
      status: "قيد التنفيذ",
      unit: "حملة",
      dueDate: "2026-11-05",
      notes: "الحملة نشطة وتخطت 12,000 عملية تنزيل حتى الآن."
    },
    {
      id: "del_501",
      clientId: "cli_5",
      serviceType: "مونتاج فيديوهات وتصويرها",
      title: "جلسة تصوير فيديو فود برودكشن للمنتجات ومونتاج 6 ريلز شهية",
      description: "تصوير سينمائي ستوب موشن وحركات بطيئة للجبن والبرجر مع مونتاج احترافي",
      quantityTotal: 6,
      quantityCompleted: 6,
      status: "تم التسليم",
      unit: "فيديو",
      dueDate: "2026-08-30",
      notes: "المشروع مكتمل بنجاح وحقق تفاعل عالي على السوشيال ميديا."
    },
    {
      id: "del_502",
      clientId: "cli_5",
      serviceType: "تصميم جرافيك",
      title: "تصميم المنيو الجديد وبوستات العروض الأسبوعية (10 تصاميم)",
      description: "تصميم منيو مطبوع وديجيتال + بوستات أسبوعية لعروض التوفير",
      quantityTotal: 10,
      quantityCompleted: 10,
      status: "تم التسليم",
      unit: "تصميم",
      dueDate: "2026-08-25",
      notes: "تم تسليم الملفات المفتوحة والطباعية."
    }
  ],
  invoices: [
    {
      id: "inv_101",
      invoiceNumber: "AG-2026-001",
      clientId: "cli_1",
      date: "2026-09-02",
      dueDate: "2026-09-12",
      status: "مدفوعة",
      items: [
        {
          id: "item_1",
          service: "تصميم جرافيك",
          description: "تصميم 16 بوست احترافي لحملات إيليت هوم",
          quantity: 16,
          unitPrice: 500,
          total: 8000
        },
        {
          id: "item_2",
          service: "مونتاج فيديوهات وتصويرها",
          description: "تصوير ومونتاج 4 فيديوهات سينمائية للمشروع",
          quantity: 4,
          unitPrice: 4000,
          total: 16000
        },
        {
          id: "item_3",
          service: "عمل فيديوهات موشن جرافيك",
          description: "فيديو موشن جرافيك 60 ثانية مع تعليق صوتي",
          quantity: 1,
          unitPrice: 9000,
          total: 9000
        },
        {
          id: "item_4",
          service: "انشاء الاعلانات المموله",
          description: "إدارة وإعداد الحملات الإعلانية الممولة لشهر سبتمبر",
          quantity: 1,
          unitPrice: 12000,
          total: 12000
        }
      ],
      subtotal: 45000,
      discount: 0,
      tax: 0,
      total: 45000,
      paidAmount: 45000,
      notes: "تم سداد إجمالي الفاتورة على دفعتين بالتحويل البنكي."
    },
    {
      id: "inv_102",
      invoiceNumber: "AG-2026-002",
      clientId: "cli_2",
      date: "2026-09-15",
      dueDate: "2026-09-25",
      status: "جزئي",
      items: [
        {
          id: "item_1",
          service: "عمل فيديوهات ai",
          description: "إنتاج 5 فيديوهات بالذكاء الاصطناعي مع موديلز AI",
          quantity: 5,
          unitPrice: 2000,
          total: 10000
        },
        {
          id: "item_2",
          service: "تصميم جرافيك",
          description: "تصميم باكدج 12 بوست وهوية سوشيال ميديا",
          quantity: 12,
          unitPrice: 500,
          total: 6000
        },
        {
          id: "item_3",
          service: "انشاء الاعلانات المموله",
          description: "إدارة حملات مبيعات إنستجرام وتيك توك لمدة شهر",
          quantity: 1,
          unitPrice: 12000,
          total: 12000
        }
      ],
      subtotal: 28000,
      discount: 1000,
      tax: 0,
      total: 27000,
      paidAmount: 17000,
      notes: "تم سداد الدفعة الأولى 17,000 ج.م عبر إنستاباي، والمتبقي 10,000 ج.م عند إتمام تسليم الحملة."
    },
    {
      id: "inv_103",
      invoiceNumber: "AG-2026-003",
      clientId: "cli_3",
      date: "2026-10-02",
      dueDate: "2026-10-15",
      status: "جزئي",
      items: [
        {
          id: "item_1",
          service: "مونتاج فيديوهات وتصويرها",
          description: "يوم تصوير كامل ومونتاج 8 ريلز طبية توعوية",
          quantity: 8,
          unitPrice: 2500,
          total: 20000
        },
        {
          id: "item_2",
          service: "عمل فيديوهات موشن جرافيك",
          description: "فيديو موشن جرافيك للخدمات الطبية وجراحات اليوم الواحد",
          quantity: 1,
          unitPrice: 7000,
          total: 7000
        },
        {
          id: "item_3",
          service: "انشاء الاعلانات المموله",
          description: "إدارة الحملات الإعلانية وجلب الحجوزات للشهر الأول",
          quantity: 1,
          unitPrice: 8000,
          total: 8000
        }
      ],
      subtotal: 35000,
      discount: 0,
      tax: 0,
      total: 35000,
      paidAmount: 20000,
      notes: "تم استلام دفعة مقدمة 20,000 ج.م عبر تحويل البنك الأهلي."
    },
    {
      id: "inv_104",
      invoiceNumber: "AG-2026-004",
      clientId: "cli_4",
      date: "2026-10-06",
      dueDate: "2026-10-20",
      status: "غير مدفوعة",
      items: [
        {
          id: "item_1",
          service: "عمل فيديوهات موشن جرافيك",
          description: "فيديو موشن إعلاني 30 ثانية لتطبيق الموبايل",
          quantity: 1,
          unitPrice: 10000,
          total: 10000
        },
        {
          id: "item_2",
          service: "انشاء الاعلانات المموله",
          description: "إدارة حملات تيك توك وجوجل لتثبيت التطبيق",
          quantity: 1,
          unitPrice: 12000,
          total: 12000
        }
      ],
      subtotal: 22000,
      discount: 0,
      tax: 0,
      total: 22000,
      paidAmount: 0,
      notes: "فاتورة مستحقة بنهاية دورة الحملة الإعلانية، ميعاد الاستحقاق قادم."
    },
    {
      id: "inv_105",
      invoiceNumber: "AG-2026-005",
      clientId: "cli_5",
      date: "2026-08-11",
      dueDate: "2026-08-25",
      status: "مدفوعة",
      items: [
        {
          id: "item_1",
          service: "مونتاج فيديوهات وتصويرها",
          description: "تصوير احترافي ومنتاج 6 ريلز للمطعم",
          quantity: 6,
          unitPrice: 1800,
          total: 10800
        },
        {
          id: "item_2",
          service: "تصميم جرافيك",
          description: "تصميم المنيو والبوستات الدعائية (10 تصاميم)",
          quantity: 10,
          unitPrice: 720,
          total: 7200
        }
      ],
      subtotal: 18000,
      discount: 0,
      tax: 0,
      total: 18000,
      paidAmount: 18000,
      notes: "تم سداد كامل الفاتورة نقداً."
    }
  ],
  // NEW: Quotations (عروض الأسعار الرسمية)
  quotations: [
    {
      id: "qt_101",
      quotationNumber: "QT-2026-001",
      clientId: "cli_1",
      clientName: "م. كريم عبد الرحمن",
      companyName: "شركة إيليت هوم للتطوير العقاري",
      date: "2026-08-25",
      validUntil: "2026-09-10",
      projectDuration: "30 يوم عمل",
      status: "مقبول", // مسودة, تم الإرسال, مقبول, مرفوض
      items: [
        {
          id: "qti_1",
          service: "مونتاج فيديوهات وتصويرها",
          description: "تصوير احترافي 4K ومونتاج 4 فيديوهات سينمائية مع درون",
          quantity: 4,
          unitPrice: 4000,
          total: 16000
        },
        {
          id: "qti_2",
          service: "عمل فيديوهات موشن جرافيك",
          description: "فيديو موشن جرافيك لشرح خطة السداد والتقسيط (60 ثانية)",
          quantity: 1,
          unitPrice: 9000,
          total: 9000
        },
        {
          id: "qti_3",
          service: "تصميم جرافيك",
          description: "تصميم هوية بصرية كاملة وبوستات إعلانية (16 بوست)",
          quantity: 16,
          unitPrice: 500,
          total: 8000
        },
        {
          id: "qti_4",
          service: "انشاء الاعلانات المموله",
          description: "إطلاق وإدارة حملات ليدز على فيسبوك وإنستجرام مع ضبط البيكسل",
          quantity: 1,
          unitPrice: 12000,
          total: 12000
        }
      ],
      subtotal: 45000,
      discount: 0,
      total: 45000,
      paymentTerms: "50% دفعة مقدمة عند توقيع العقد، 50% بعد الاعتماد النهائي للتسليمات.",
      notes: "العرض يشمل التعديلات مجاناً حتى جلستين لكل مخرج. مدة صلاحية العرض 15 يوماً من تاريخه."
    },
    {
      id: "qt_102",
      quotationNumber: "QT-2026-002",
      clientId: "cli_2",
      clientName: "أ. سارة المنشاوي",
      companyName: "براند فيلفيت لمستحضرات التجميل",
      date: "2026-09-10",
      validUntil: "2026-09-25",
      projectDuration: "20 يوم عمل",
      status: "مقبول",
      items: [
        {
          id: "qti_1",
          service: "عمل فيديوهات ai",
          description: "إنتاج 5 فيديوهات بالذكاء الاصطناعي مع عارضات أزياء وموديلز AI للمنتج",
          quantity: 5,
          unitPrice: 2000,
          total: 10000
        },
        {
          id: "qti_2",
          service: "تصميم جرافيك",
          description: "تصميم قوالب وهوية بوستات سوشيال ميديا (12 تصميماً)",
          quantity: 12,
          unitPrice: 500,
          total: 6000
        },
        {
          id: "qti_3",
          service: "انشاء الاعلانات المموله",
          description: "إدارة حملات مبيعات إنستجرام وتيك توك لمدة شهر مع تحليل النتائج",
          quantity: 1,
          unitPrice: 12000,
          total: 12000
        }
      ],
      subtotal: 28000,
      discount: 1000,
      total: 27000,
      paymentTerms: "60% دفعة أولى قبل البدء، 40% قبل إطلاق الحملات الممولة.",
      notes: "يشمل العرض ترخيص استخدام الموديلز AI للأغراض التجارية عالمياً."
    }
  ],
  // NEW: Proposals / Pitch Decks (العروض التقديمية للعملاء قبل العمل)
  proposals: [
    {
      id: "prop_101",
      proposalNumber: "PRP-2026-001",
      clientId: "cli_1",
      clientName: "م. كريم عبد الرحمن",
      companyName: "شركة إيليت هوم للتطوير العقاري",
      title: "العرض التقديمي لإطلاق الحملة التسويقية والإنتاجية العقارية",
      subtitle: "استراتيجية بصرية وإعلانية متكاملة لزيادة المبيعات والريتش",
      date: "2026-08-28",
      primaryService: "تصميم، تصوير سينمائي، موشن جرافيك وإعلانات ممولة",
      budget: 45000,
      timeline: "4 أسابيع",
      objective: "بناء ثقة عالية لدى مشتري العقارات وزيادة عدد العملاء المحتملين المؤهلين (Qualified Leads) لزيارة المشروع عبر محتوى مرئي سينمائي وحملات استهداف ذكية.",
      creativeConcept: "استخدام أسلوب تصوير ديناميكي 4K يركز على تفاصيل الفخامة الحقيقية، مدعوماً بفيديو موشن جرافيك يوضح سهولة السداد والتقسيط بلغة أرقام واضحة.",
      deliverablesList: [
        "16 تصميماً احترافياً ومبتكراً للسوشيال ميديا",
        "4 فيديوهات ريلز وتيك توك بجودة سينمائية مع تصوير درون",
        "1 فيديو موشن جرافيك توضيحي لأنظمة السداد (60 ثانية)",
        "إدارة متكاملة للحملات الإعلانية الممولة مع تحسين تكلفة الليد"
      ],
      executionPhases: [
        {
          phase: "المرحلة الأولى: التحليل والاسكريبت",
          duration: "الأسبوع 1",
          details: "دراسة المنافسين، كتابة سيناريوهات الفيديوهات، واختيار التوجه البصري للألوان والتصاميم."
        },
        {
          phase: "المرحلة الثانية: التصوير والإنتاج",
          duration: "الأسبوع 2",
          details: "يوم تصوير كامل بالموقع بكاميرات سينمائية ودرون + رسم مشاهد الموشن جرافيك."
        },
        {
          phase: "المرحلة الثالثة: المونتاج والتصميم",
          duration: "الأسبوع 3",
          details: "مونتاج الفيديوهات وتلوينها وإضافة التعليق الصوتي + تصميم بوستات الحملة."
        },
        {
          phase: "المرحلة الرابعة: المراجعة والإطلاق",
          duration: "الأسبوع 4",
          details: "اعتماد العميل النهائي، جدولة النشر، وإطلاق الحملات الإعلانية الممولة مع المتابعة اليومية."
        }
      ],
      whyUsPoints: [
        "خبرة متخصصة في تسويق وإنتاج محتوى العقارات والبراندات الفاخرة",
        "أحدث معدات التصوير السينمائي والدرون بجودة 4K حقيقية",
        "فريق ميديا باينج معتمد يضمن وصول كل جنيه إعلاني للعميل المناسب",
        "شعارنا الدائم: we create your thinking - نحول رؤيتك إلى واقع مؤثر"
      ]
    }
  ],
  payments: [
    {
      id: "pay_1",
      invoiceId: "inv_101",
      clientId: "cli_1",
      amount: 25000,
      paymentDate: "2026-09-03",
      method: "تحويل بنكي - البنك الأهلي المصري",
      referenceNumber: "TXN-998811",
      notes: "دفعة مقدمة 55% عند بدء العمل والتعاقد"
    },
    {
      id: "pay_2",
      invoiceId: "inv_101",
      clientId: "cli_1",
      amount: 20000,
      paymentDate: "2026-09-28",
      method: "تحويل بنكي - البنك الأهلي المصري",
      referenceNumber: "TXN-999342",
      notes: "دفعة التصفية النهائية للشهر بعد تسليم فيديو الموشن والحملات"
    },
    {
      id: "pay_3",
      invoiceId: "inv_102",
      clientId: "cli_2",
      amount: 17000,
      paymentDate: "2026-09-16",
      method: "إنستاباي (InstaPay)",
      referenceNumber: "IP-77665544",
      notes: "دفعة مقدمة لحجز موعد الموديلز AI وبدء تصاميم السوشيال ميديا"
    },
    {
      id: "pay_4",
      invoiceId: "inv_103",
      clientId: "cli_3",
      amount: 20000,
      paymentDate: "2026-10-03",
      method: "تحويل بنكي - CIB",
      referenceNumber: "CIB-443322",
      notes: "دفعة أولى قبل يوم التصوير بالعيادات"
    },
    {
      id: "pay_5",
      invoiceId: "inv_105",
      clientId: "cli_5",
      amount: 18000,
      paymentDate: "2026-08-26",
      method: "دفع نقدي (Cash)",
      referenceNumber: "CASH-REC-012",
      notes: "تسديد كامل عند تسليم هارد التصوير وتصاميم المنيو المطبوعة"
    }
  ],
  servicesCatalog: [
    {
      id: "srv_1",
      name: "تصميم جرافيك",
      category: "Design",
      icon: "Palette",
      description: "تصميم هويات بصرية كاملة، منشورات سوشيال ميديا إبداعية، بنرات إعلانية، مطبوعات وفلايرات.",
      defaultUnitPrice: 500,
      unit: "تصميم"
    },
    {
      id: "srv_2",
      name: "مونتاج فيديوهات وتصويرها",
      category: "Video",
      icon: "Video",
      description: "تصوير ميداني بجودة سينمائية 4K، تصوير منتجات وبودكاست، مونتاج احترافي للريلز وتيك توك ويوتيوب.",
      defaultUnitPrice: 2500,
      unit: "فيديو"
    },
    {
      id: "srv_3",
      name: "عمل فيديوهات موشن جرافيك",
      category: "Motion",
      icon: "Sparkles",
      description: "فيديوهات موشن جرافيك توضيحية ثلاثية وثنائية الأبعاد، إعلانات ترويجية للشركات والتطبيقات، إنترو واحترافية عالية.",
      defaultUnitPrice: 7500,
      unit: "فيديو"
    },
    {
      id: "srv_4",
      name: "عمل فيديوهات ai",
      category: "AI",
      icon: "Cpu",
      description: "إنتاج فيديوهات تسويقية بالذكاء الاصطناعي، أفاتار ذكي ناطق، محاكاة صوتية متطورة، ومؤثرات بصرية سينمائية AI.",
      defaultUnitPrice: 2000,
      unit: "فيديو AI"
    },
    {
      id: "srv_5",
      name: "انشاء الاعلانات المموله",
      category: "Marketing",
      icon: "TrendingUp",
      description: "إدارة وإطلاق الحملات الإعلانية الممولة على فيسبوك، إنستجرام، تيك توك، جوجل، وسناب شات مع تتبع المبيعات والليدز.",
      defaultUnitPrice: 10000,
      unit: "حملة شهرية"
    }
  ],
  acquisitionChannelsList: [
    "إعلانات ممولة (Facebook / Instagram)",
    "إعلانات تيك توك (TikTok Ads)",
    "إعلانات جوجل وسناب شات",
    "ترشيح من عميل سابق (Referral)",
    "تواصل مباشر عبر واتساب",
    "معرض الأعمال (Behance / Portfolio)",
    "بحث جوجل / الموقع الإلكتروني",
    "تواصل بارد (Cold Outreach / LinkedIn)",
    "أخرى"
  ]
};

module.exports = initialData;
