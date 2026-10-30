import React, { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientsView from './components/ClientsView';
import DeliverablesView from './components/DeliverablesView';
import InvoicesView from './components/InvoicesView';
import QuotationsView from './components/QuotationsView';
import ProposalsView from './components/ProposalsView';
import FinancialAuditorView from './components/FinancialAuditorView';
import SettingsView from './components/SettingsView';
import TreasuryModal from './components/TreasuryModal';
import LoginView from './components/LoginView';
import { Loader2, AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('ag_auth_token'));
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ag_user');
      return saved ? JSON.parse(saved) : { id: 'usr_admin', email: 'admin@agmedia.agency', name: 'إدارة AG-media' };
    } catch {
      return { id: 'usr_admin', email: 'admin@agmedia.agency', name: 'إدارة AG-media' };
    }
  });

  // Data States
  const [clients, setClients] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [settingsData, setSettingsData] = useState(null);
  const [treasuryData, setTreasuryData] = useState({ transactions: [], treasuryBalance: 0, totalWithdrawals: 0 });
  const [isTreasuryOpen, setIsTreasuryOpen] = useState(false);

  // Active client filter across tabs
  const [activeClientFilter, setActiveClientFilter] = useState('ALL');

  // Load all data
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        clientsRes,
        deliverablesRes,
        invoicesRes,
        quotationsRes,
        proposalsRes,
        paymentsRes,
        paymentMethodsRes,
        summaryRes,
        settingsRes,
        treasuryRes
      ] = await Promise.all([
        api.getClients(),
        api.getDeliverables(),
        api.getInvoices(),
        api.getQuotations(),
        api.getProposals(),
        api.getPayments(),
        api.getPaymentMethods(),
        api.getFinancialSummary(),
        api.getSettings(),
        api.getTreasury()
      ]);

      setClients(clientsRes || []);
      setDeliverables(deliverablesRes || []);
      setInvoices(invoicesRes || []);
      setQuotations(quotationsRes || []);
      setProposals(proposalsRes || []);
      setPayments(paymentsRes || []);
      setPaymentMethods(paymentMethodsRes || []);
      setSummaryData(summaryRes || null);
      setSettingsData(settingsRes || null);
      setTreasuryData(treasuryRes || { transactions: [], treasuryBalance: 0, totalWithdrawals: 0 });
      setConnectionError(false);

      // Save offline snapshot in localStorage so data is never viewed as empty
      try {
        if (clientsRes && clientsRes.length) localStorage.setItem('ag_cached_clients', JSON.stringify(clientsRes));
        if (deliverablesRes && deliverablesRes.length) localStorage.setItem('ag_cached_deliverables', JSON.stringify(deliverablesRes));
        if (invoicesRes) localStorage.setItem('ag_cached_invoices', JSON.stringify(invoicesRes));
        if (summaryRes) localStorage.setItem('ag_cached_summary', JSON.stringify(summaryRes));
      } catch (e) {}
    } catch (err) {
      console.error('Error fetching system data:', err);
      setConnectionError(true);

      // Safe fallback to locally cached data so user never loses their view
      try {
        const cachedClients = localStorage.getItem('ag_cached_clients');
        const cachedDeliverables = localStorage.getItem('ag_cached_deliverables');
        const cachedInvoices = localStorage.getItem('ag_cached_invoices');
        const cachedSummary = localStorage.getItem('ag_cached_summary');
        if (cachedClients) setClients(JSON.parse(cachedClients));
        if (cachedDeliverables) setDeliverables(JSON.parse(cachedDeliverables));
        if (cachedInvoices) setInvoices(JSON.parse(cachedInvoices));
        if (cachedSummary) setSummaryData(JSON.parse(cachedSummary));
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers for Clients
  const handleSaveClient = async (formData, id) => {
    if (id) {
      await api.updateClient(id, formData);
    } else {
      await api.createClient(formData);
    }
    await loadAllData();
  };

  const handleDeleteClient = async (id) => {
    await api.deleteClient(id);
    await loadAllData();
  };

  const handleRenewClient = async (id, renewalData) => {
    const res = await api.renewClient(id, renewalData);
    await loadAllData();
    return res;
  };

  const handleUpdateSubscriptionStatus = async (id, data) => {
    const res = await api.updateSubscriptionStatus(id, data);
    await loadAllData();
    return res;
  };

  const handlePayMonthlyCycle = async (id, paymentData) => {
    const res = await api.payMonthlyCycle(id, paymentData);
    await loadAllData();
    return res;
  };

  // Handlers for Deliverables
  const handleSaveDeliverable = async (formData, id) => {
    if (id) {
      await api.updateDeliverable(id, formData);
    } else {
      await api.createDeliverable(formData);
    }
    await loadAllData();
  };

  const handleUpdateDeliverableProgress = async (id, updates) => {
    await api.updateDeliverable(id, updates);
    await loadAllData();
  };

  const handleDeleteDeliverable = async (id) => {
    await api.deleteDeliverable(id);
    await loadAllData();
  };

  // Handlers for Invoices
  const handleSaveInvoice = async (formData, id) => {
    if (id) {
      await api.updateInvoice(id, formData);
    } else {
      await api.createInvoice(formData);
    }
    await loadAllData();
  };

  const handleDeleteInvoice = async (id) => {
    await api.deleteInvoice(id);
    await loadAllData();
  };

  // Handlers for Quotations (عروض الأسعار)
  const handleSaveQuotation = async (formData, id) => {
    if (id) {
      await api.updateQuotation(id, formData);
    } else {
      await api.createQuotation(formData);
    }
    await loadAllData();
  };

  const handleDeleteQuotation = async (id) => {
    await api.deleteQuotation(id);
    await loadAllData();
  };

  const handleConvertQuotationToInvoice = async (id) => {
    const res = await api.convertQuotationToInvoice(id);
    if (res.success) {
      alert('تم تحويل عرض السعر إلى فاتورة رسمية بنجاح!');
      await loadAllData();
      setCurrentTab('invoices');
    }
  };

  // Handlers for Proposals (العروض التقديمية)
  const handleSaveProposal = async (formData, id) => {
    if (id) {
      await api.updateProposal(id, formData);
    } else {
      await api.createProposal(formData);
    }
    await loadAllData();
  };

  const handleDeleteProposal = async (id) => {
    await api.deleteProposal(id);
    await loadAllData();
  };

  // Handlers for Payments
  const handleRecordPayment = async (paymentData) => {
    await api.createPayment(paymentData);
    await loadAllData();
  };

  const handleDeletePayment = async (id) => {
    await api.deletePayment(id);
    await loadAllData();
  };

  // Handlers for Payment Methods (طرق الدفع)
  const handleSavePaymentMethod = async (formData, id) => {
    if (id) {
      await api.updatePaymentMethod(id, formData);
    } else {
      await api.createPaymentMethod(formData);
    }
    await loadAllData();
  };

  const handleDeletePaymentMethod = async (id) => {
    await api.deletePaymentMethod(id);
    await loadAllData();
  };

  const handleTogglePaymentMethodStatus = async (id, currentStatus) => {
    await api.updatePaymentMethod(id, { isActive: !currentStatus });
    await loadAllData();
  };

  // Handlers for Settings & DB
  const handleUpdateSettings = async (settings) => {
    await api.updateSettings(settings);
    await loadAllData();
  };

  const handleResetSampleData = async () => {
    await api.resetSampleData();
    await loadAllData();
  };

  const handleRestoreData = async (data) => {
    await api.restoreData(data);
    await loadAllData();
  };

  // Navigation Helpers
  const handleOpenDeliverablesForClient = (clientId) => {
    setActiveClientFilter(clientId);
    setCurrentTab('deliverables');
  };

  const handleOpenNewInvoiceForClient = (clientId) => {
    setActiveClientFilter(clientId);
    setCurrentTab('invoices');
  };

  const handleOpenNewQuotationForClient = (clientId) => {
    setActiveClientFilter(clientId);
    setCurrentTab('quotations');
  };

  const handleOpenNewProposalForClient = (clientId) => {
    setActiveClientFilter(clientId);
    setCurrentTab('proposals');
  };

  // Handlers for Treasury & Withdrawals
  const handleOpenTreasury = () => {
    setIsTreasuryOpen(true);
  };

  const handleAddTreasuryTransaction = async (formData) => {
    await api.createTreasuryTransaction(formData);
    await loadAllData();
  };

  const handleResetTreasuryZero = async (resetData) => {
    await api.resetTreasuryZero(resetData);
    await loadAllData();
  };

  const handleDeleteTreasuryTransaction = async (id) => {
    await api.deleteTreasuryTransaction(id);
    await loadAllData();
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    loadAllData();
  };

  const handleLogout = () => {
    if (confirm('هل ترغب في تسجيل الخروج من نظام AG-media؟')) {
      localStorage.removeItem('ag_auth_token');
      localStorage.removeItem('ag_user');
      setIsAuthenticated(false);
    }
  };

  const handleUpdateCredentials = async (data) => {
    const res = await api.updateCredentials(data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('ag_user', JSON.stringify(res.user));
    }
    return res;
  };

  const currencySymbol = settingsData?.settings?.currencySymbol || 'ج.م';
  const channelsList = settingsData?.acquisitionChannelsList || [];
  const servicesList = settingsData?.servicesCatalog || [];

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  if (loading && !clients.length) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center space-y-4">
        <div className="h-16 px-4 py-2 bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-[#134C5C] animate-pulse">
          <img src="/logo.png" alt="AG-media" className="h-12 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-2 text-[#134C5C] text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-[#134C5C]" />
          <span>جاري تحميل نظام AG-media...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex selection:bg-[#134C5C] selection:text-white">
      
      {/* Vertical Sidebar: Frameless Logo, Tabs & Profile */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveClientFilter('ALL');
          setCurrentTab(tab);
        }}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area (Offset by Right Sidebar on Desktop) */}
      <div className="flex-1 min-w-0 md:mr-64 lg:mr-72 pt-16 md:pt-0 flex flex-col min-h-screen">

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Offline / Server Connection Warning Banner */}
        {connectionError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">تنبيه: تعذر الاتصال المباشر بخادم النظام (أوفلاين)</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  بياناتك محفوظة بالكامل على جهازك ولم تُحذف. تأكد من تشغيل السيرفر أو فحص اتصال الإنترنت.
                </p>
              </div>
            </div>
            <button
              onClick={loadAllData}
              className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة المحاولة 🔄</span>
            </button>
          </div>
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            summaryData={summaryData}
            clients={clients}
            deliverables={deliverables}
            invoices={invoices}
            quotations={quotations}
            proposals={proposals}
            payments={payments}
            currency={currencySymbol}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onNewClient={() => setCurrentTab('clients')}
            onNewInvoice={() => setCurrentTab('invoices')}
            onNewQuotation={() => setCurrentTab('quotations')}
            onNewProposal={() => setCurrentTab('proposals')}
            onOpenTreasury={handleOpenTreasury}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsView
            clients={clients}
            deliverables={deliverables}
            invoices={invoices}
            quotations={quotations}
            proposals={proposals}
            payments={payments}
            paymentMethods={paymentMethods}
            currency={currencySymbol}
            channelsList={channelsList}
            servicesList={servicesList}
            onSaveClient={handleSaveClient}
            onRenewClient={handleRenewClient}
            onUpdateSubscriptionStatus={handleUpdateSubscriptionStatus}
            onPayMonthlyCycle={handlePayMonthlyCycle}
            onDeleteClient={handleDeleteClient}
            onOpenDeliverablesForClient={handleOpenDeliverablesForClient}
            onOpenNewInvoiceForClient={handleOpenNewInvoiceForClient}
            onOpenNewQuotationForClient={handleOpenNewQuotationForClient}
            onOpenNewProposalForClient={handleOpenNewProposalForClient}
            onUpdateDeliverableProgress={handleUpdateDeliverableProgress}
          />
        )}

        {currentTab === 'deliverables' && (
          <DeliverablesView
            deliverables={deliverables}
            clients={clients}
            selectedClientId={activeClientFilter}
            onClearClientFilter={() => setActiveClientFilter('ALL')}
            onSaveDeliverable={handleSaveDeliverable}
            onUpdateDeliverableProgress={handleUpdateDeliverableProgress}
            onDeleteDeliverable={handleDeleteDeliverable}
          />
        )}

        {currentTab === 'quotations' && (
          <QuotationsView
            quotations={quotations}
            clients={clients}
            agencySettings={settingsData?.settings}
            currency={currencySymbol}
            selectedClientId={activeClientFilter}
            onSaveQuotation={handleSaveQuotation}
            onDeleteQuotation={handleDeleteQuotation}
            onConvertToInvoice={handleConvertQuotationToInvoice}
          />
        )}

        {currentTab === 'proposals' && (
          <ProposalsView
            proposals={proposals}
            clients={clients}
            agencySettings={settingsData?.settings}
            currency={currencySymbol}
            selectedClientId={activeClientFilter}
            onSaveProposal={handleSaveProposal}
            onDeleteProposal={handleDeleteProposal}
          />
        )}

        {currentTab === 'invoices' && (
          <InvoicesView
            invoices={invoices}
            clients={clients}
            agencySettings={settingsData?.settings}
            paymentMethods={paymentMethods}
            currency={currencySymbol}
            selectedClientId={activeClientFilter}
            onSaveInvoice={handleSaveInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onRecordPayment={handleRecordPayment}
          />
        )}

        {currentTab === 'auditor' && (
          <FinancialAuditorView
            clients={clients}
            invoices={invoices}
            payments={payments}
            paymentMethods={paymentMethods}
            summaryData={summaryData}
            treasuryData={treasuryData}
            currency={currencySymbol}
            onRecordPayment={handleRecordPayment}
            onDeletePayment={handleDeletePayment}
            onOpenTreasury={handleOpenTreasury}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settingsData?.settings}
            paymentMethods={paymentMethods}
            servicesCatalog={servicesList}
            currency={currencySymbol}
            user={currentUser}
            onUpdateCredentials={handleUpdateCredentials}
            onUpdateSettings={handleUpdateSettings}
            onSavePaymentMethod={handleSavePaymentMethod}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            onTogglePaymentMethodStatus={handleTogglePaymentMethodStatus}
            onResetSampleData={handleResetSampleData}
            onRestoreData={handleRestoreData}
          />
        )}

      </main>

      {/* Footer with Logo branding */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#134C5C]">AG-media</span>
            <span className="text-slate-500 font-mono font-medium">• we create your thinking</span>
          </div>
          <span className="text-slate-500">تصميم جرافيك • مونتاج وتصوير • موشن جرافيك • فيديوهات AI • إعلانات ممولة</span>
        </div>
      </footer>

      </div>

      {/* Treasury & Cash Withdrawals Modal */}
      <TreasuryModal
        isOpen={isTreasuryOpen}
        onClose={() => setIsTreasuryOpen(false)}
        stats={summaryData?.metrics}
        treasuryData={treasuryData}
        paymentMethods={paymentMethods}
        currency={currencySymbol}
        onAddTransaction={handleAddTreasuryTransaction}
        onResetZero={handleResetTreasuryZero}
        onDeleteTransaction={handleDeleteTreasuryTransaction}
      />

    </div>
  );
}
