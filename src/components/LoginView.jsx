import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle,
  Globe,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Server,
  Settings
} from 'lucide-react';
import { api, getBaseUrl, setCustomServerUrl, testServerConnection, CURRENT_TUNNEL_URL } from '../api';

export default function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Server connection settings modal
  const [showServerModal, setShowServerModal] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState('');
  const [serverStatus, setServerStatus] = useState('unknown'); // 'checking', 'connected', 'disconnected', 'unknown'
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('AG_CUSTOM_SERVER_URL') : '';
    setServerUrlInput(raw || CURRENT_TUNNEL_URL);
  }, [showServerModal]);

  const handleCheckConnection = async (urlToTest) => {
    setTestingConnection(true);
    setServerStatus('checking');
    const ok = await testServerConnection(urlToTest || serverUrlInput);
    setServerStatus(ok ? 'connected' : 'disconnected');
    setTestingConnection(false);
    return ok;
  };

  const handleSaveServerUrl = async () => {
    const clean = serverUrlInput.trim();
    setCustomServerUrl(clean);
    await handleCheckConnection(clean);
    setShowServerModal(false);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setLoading(true);
      const data = await api.login(email.trim(), password.trim());

      if (data && data.success && data.user) {
        localStorage.setItem('ag_auth_token', data.token);
        localStorage.setItem('ag_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setErrorMsg((data && data.message) || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      console.error('Login error detail:', err);
      const detail = err && err.message ? ` (${err.message})` : '';
      setErrorMsg(`تعذر الاتصال بالخادم${detail}. يرجى التأكد من تشغيل السيرفر أو فحص رابط الاتصال.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 selection:bg-[#134C5C] selection:text-white">
      <div className="w-full max-w-md">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 space-y-6">
          
          {/* Frameless Centered Logo */}
          <div className="text-center space-y-3">
            <div className="inline-block">
              <img 
                src="/logo.png" 
                alt="AG-media" 
                className="h-16 w-auto mx-auto object-contain transition-transform hover:scale-105"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-black text-[#134C5C] tracking-tight">AG-media</h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#134C5C]/10 text-[#134C5C] font-bold border border-[#134C5C]/20">
                  CRM
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono font-medium tracking-tight mt-1">
                we create your thinking
              </p>
            </div>

            <div className="pt-2">
              <h2 className="text-base font-bold text-slate-800">
                تسجيل الدخول إلى نظام الإدارة
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                أدخل بريدك الإلكتروني وكلمة المرور للمتابعة
              </p>
            </div>
          </div>

          {/* Error Message with Quick Action */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold space-y-2 animate-fadeIn">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              {errorMsg.includes('تعذر الاتصال') && (
                <button
                  type="button"
                  onClick={() => setShowServerModal(true)}
                  className="w-full mt-1 py-1.5 px-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>تعديل أو فحص رابط اتصال السيرفر ⚙️</span>
                </button>
              )}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="البريد الإلكتروني أو اسم المستخدم"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-left dir-ltr focus:bg-white focus:outline-none focus:border-[#134C5C] focus:ring-2 focus:ring-[#134C5C]/10 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-left dir-ltr focus:bg-white focus:outline-none focus:border-[#134C5C] focus:ring-2 focus:ring-[#134C5C]/10 transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Security badge */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="rounded text-[#134C5C] focus:ring-0 cursor-pointer" 
                />
                <span>تذكر بيانات الدخول</span>
              </label>
              <span className="flex items-center gap-1 text-[#134C5C] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>نظام مشفر ومحمي</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white font-bold text-sm shadow-md shadow-[#134C5C]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول للنظام 🚀'}</span>
            </button>

            {/* Server Connection Option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowServerModal(true)}
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-[#134C5C] transition font-medium cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>إعدادات اتصال السيرفر</span>
              </button>
            </div>

          </form>

        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 mt-6 space-y-1">
          <p className="font-semibold text-slate-600">AG-media Digital Marketing & Production System</p>
          <p className="text-[11px]">تصميم جرافيك • مونتاج وتصوير • موشن جرافيك • AI • إعلانات ممولة</p>
        </div>

      </div>

      {/* Server Settings Modal */}
      {showServerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#134C5C]">
                <Server className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-800">إعدادات اتصال السيرفر</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowServerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-right">
                  رابط خادم النظام (Backend API URL):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={serverUrlInput}
                  onChange={(e) => {
                    setServerUrlInput(e.target.value);
                    setServerStatus('unknown');
                  }}
                  placeholder="https://..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#134C5C] focus:ring-2 focus:ring-[#134C5C]/10 transition"
                />
                <p className="text-[11px] text-slate-400 mt-1 text-right">
                  الرابط الحالي للنظام: <span className="font-mono text-slate-600 dir-ltr inline-block">{getBaseUrl().replace('/api', '')}</span>
                </p>
              </div>

              {/* Status display */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-600">حالة الاتصال:</span>
                {serverStatus === 'checking' && (
                  <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الفحص...</span>
                  </span>
                )}
                {serverStatus === 'connected' && (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>متصل بنجاح بالسيرفر ✅</span>
                  </span>
                )}
                {serverStatus === 'disconnected' && (
                  <span className="flex items-center gap-1.5 text-red-600 font-bold">
                    <XCircle className="w-4 h-4" />
                    <span>تعذر الاتصال بالسيرفر ❌</span>
                  </span>
                )}
                {serverStatus === 'unknown' && (
                  <span className="text-slate-400 font-medium">لم يتم الفحص بعد</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={testingConnection}
                  onClick={() => handleCheckConnection(serverUrlInput)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                  <span>فحص الاتصال الآن</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveServerUrl}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#134C5C] hover:bg-[#0f3d4a] text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#134C5C]/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>حفظ واستخدام الرابط</span>
                </button>
              </div>

              {/* Quick Reset to Default Tunnel */}
              <div className="text-center pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setServerUrlInput(CURRENT_TUNNEL_URL);
                    setCustomServerUrl(CURRENT_TUNNEL_URL);
                    handleCheckConnection(CURRENT_TUNNEL_URL);
                  }}
                  className="text-[11px] text-[#134C5C] hover:underline font-semibold"
                >
                  استعادة رابط البث الرسمي التلقائي 🔄
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
