import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  FileText, 
  Calculator, 
  Settings, 
  Receipt,
  Presentation,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  user,
  onLogout 
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم', subtitle: 'نظرة عامة وإحصائيات', icon: LayoutDashboard },
    { id: 'clients', label: 'العملاء والخدمات', subtitle: 'الاستقطاب وتحديد الكميات', icon: Users },
    { id: 'deliverables', label: 'متابعة المخرجات والأعمال', subtitle: 'إنجاز وتسليم المهام', icon: CheckSquare },
    { id: 'quotations', label: 'عروض الأسعار', subtitle: 'Quotations رسمية للعملاء', icon: Receipt },
    { id: 'proposals', label: 'العروض التقديمية', subtitle: 'Pitch Decks تفاعلية', icon: Presentation },
    { id: 'invoices', label: 'الفواتير والمطالبات', subtitle: 'فواتير وحساب الضرائب', icon: FileText },
    { id: 'auditor', label: 'مراجع الحسابات والخزينة', subtitle: 'الإيرادات والمصروفات والأرباح', icon: Calculator },
    { id: 'settings', label: 'الإعدادات والأمان', subtitle: 'الهوية وطرق الدفع والبيانات', icon: Settings },
  ];

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ---------------- MOBILE TOP BAR (< md) ---------------- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 px-4 flex items-center justify-between shadow-xs no-print">
        {/* Direct Frameless Logo & Title */}
        <div 
          onClick={() => handleSelectTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <img 
            src="/logo.png" 
            alt="AG-media" 
            className="h-9 w-auto object-contain"
          />
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-[#134C5C] text-base">AG-media</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#134C5C]/10 text-[#134C5C] font-bold">CRM</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">we create your thinking</span>
          </div>
        </div>

        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
          aria-label="القائمة الجانبية"
        >
          {mobileOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-[#134C5C]" />}
        </button>
      </div>

      {/* ---------------- MOBILE OVERLAY BACKDROP ---------------- */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-fadeIn"
        />
      )}

      {/* ---------------- VERTICAL SIDEBAR (DESKTOP & MOBILE DRAWER) ---------------- */}
      <aside 
        className={`fixed top-0 bottom-0 right-0 w-64 lg:w-72 bg-white border-l border-slate-200 z-50 md:z-30 flex flex-col justify-between transition-transform duration-300 ease-in-out no-print shadow-sm ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        
        {/* TOP BRAND SECTION */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => handleSelectTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
              title="AG-media - الرئيسية"
            >
              {/* Direct Frameless Logo */}
              <img 
                src="/logo.png" 
                alt="AG-media" 
                className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-[#134C5C] tracking-tight">AG-media</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#134C5C]/10 text-[#134C5C] font-extrabold border border-[#134C5C]/20">
                    CRM
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono font-medium tracking-tight mt-0.5">
                  we create your thinking
                </p>
              </div>
            </div>

            {/* Mobile close button inside drawer */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION LINKS LIST */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-thin">
          <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            القائمة الرئيسية
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-right transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#134C5C] text-white shadow-md shadow-[#134C5C]/25 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <div className={`p-2 rounded-xl transition ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 text-slate-500 group-hover:text-[#134C5C]'
                }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm leading-tight truncate">
                    {tab.label}
                  </div>
                  <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* USER PROFILE & LOGOUT FOOTER */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 space-y-2.5">
          {/* User info card */}
          {user && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#134C5C]/10 text-[#134C5C] flex items-center justify-center font-bold text-xs shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {user.name || 'إدارة AG-media'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate leading-tight mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer shrink-0"
                title="تسجيل الخروج من النظام"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* System Security status */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 font-medium">
            <span className="flex items-center gap-1 text-[#134C5C] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>نظام محمي ومشفر</span>
            </span>
            <span className="text-slate-400 font-mono">v2.4 Pro</span>
          </div>
        </div>

      </aside>
    </>
  );
}