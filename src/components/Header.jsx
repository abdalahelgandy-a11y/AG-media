import React from 'react';
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
  UserCheck
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  user,
  onLogout
}) {
  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'clients', label: 'العملاء والاستقطاب', icon: Users },
    { id: 'deliverables', label: 'متابعة الأعمال والمخرجات', icon: CheckSquare },
    { id: 'quotations', label: 'عروض الأسعار (Quotations)', icon: Receipt },
    { id: 'proposals', label: 'العروض التقديمية (Pitch Decks)', icon: Presentation },
    { id: 'invoices', label: 'الفواتير والمطالبات', icon: FileText },
    { id: 'auditor', label: 'مراجع الحسابات', icon: Calculator },
    { id: 'settings', label: 'الإعدادات والأمان', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header: Centered Frameless Logo & Company Name */}
        <div className="flex items-center justify-between h-20 relative">
          
          {/* Spacer / Left Side for balance */}
          <div className="w-24 hidden sm:block"></div>

          {/* Centered Logo & Brand without any frame/box */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group py-1 mx-auto transition-transform hover:scale-[1.02]" 
            onClick={() => setCurrentTab('dashboard')}
            title="AG-media CRM - الرئيسية"
          >
            {/* Direct Frameless Logo */}
            <img 
              src="/logo.png" 
              alt="AG-media - we create your thinking" 
              className="h-12 w-auto object-contain"
            />

            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-[#134C5C] tracking-tight">AG-media</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#134C5C]/10 text-[#134C5C] font-bold border border-[#134C5C]/20">
                  CRM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono tracking-tight font-medium">
                we create your thinking
              </p>
            </div>
          </div>

          {/* User Profile & Logout on the Side */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-left">
                  <span className="font-bold text-slate-800 text-[11px] leading-tight">
                    {user.name || 'إدارة AG-media'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono leading-tight">
                    {user.email}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold border border-slate-200 hover:border-red-200 transition cursor-pointer"
                  title="تسجيل الخروج من النظام"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto py-2.5 border-t border-slate-100 scrollbar-none justify-start md:justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#134C5C] text-white shadow-md shadow-[#134C5C]/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
