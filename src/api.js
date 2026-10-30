// Live API URL configuration:
// - On Web & PWA on PC (localhost:5000): always uses relative '/api' directly
// - On Android Native (Capacitor) / Remote: connects to live cloud server
export const CURRENT_TUNNEL_URL = 'https://shopping-tickets-morning-physical.trycloudflare.com';

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // If opened directly from localhost in browser (e.g. localhost:5000), always talk to local server directly
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isLocalServerWeb = isLocalhost && window.location.port;
    if (isLocalServerWeb) {
      return '/api';
    }

    const custom = localStorage.getItem('AG_CUSTOM_SERVER_URL');
    if (custom && custom.trim()) return `${custom.trim().replace(/\/$/, '')}/api`;

    const isCapacitor = Boolean(
      window.Capacitor?.isNativePlatform?.() ||
      window.location.protocol === 'capacitor:' ||
      (isLocalhost && !window.location.port)
    );
    if (isCapacitor) return `${CURRENT_TUNNEL_URL}/api`;
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) return `${envUrl.trim().replace(/\/$/, '')}/api`;
  return '/api';
};

export const setCustomServerUrl = (url) => {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('AG_CUSTOM_SERVER_URL', url.trim());
    } else {
      localStorage.removeItem('AG_CUSTOM_SERVER_URL');
    }
  }
};

export const testServerConnection = async (testUrl) => {
  const targetBase = testUrl ? `${testUrl.trim().replace(/\/$/, '')}/api` : getBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${targetBase}/financial-summary`, { 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (e) {
    return false;
  }
};

const url = (path) => `${getBaseUrl()}${path.startsWith('/') ? path : '/' + path}`;

let BASE_URL = getBaseUrl();

export const api = {
  // Authentication
  async login(email, password) {
    const res = await fetch(`${getBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${getBaseUrl()}/auth/me`);
    const data = await res.json();
    return data.user;
  },

  async updateCredentials(data) {
    const res = await fetch(`${getBaseUrl()}/auth/update-credentials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Clients
  async getClients() {
    const res = await fetch(`${getBaseUrl()}/clients`);
    const data = await res.json();
    return data.data;
  },

  async getClient(id) {
    const res = await fetch(`${getBaseUrl()}/clients/${id}`);
    const data = await res.json();
    return data.data;
  },

  async createClient(client) {
    const res = await fetch(`${getBaseUrl()}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    return await res.json();
  },

  async updateClient(id, updates) {
    const res = await fetch(`${getBaseUrl()}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async renewClient(id, renewalData = {}) {
    const res = await fetch(`${getBaseUrl()}/clients/${id}/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(renewalData)
    });
    return await res.json();
  },

  async updateSubscriptionStatus(id, data = {}) {
    const res = await fetch(`${getBaseUrl()}/clients/${id}/subscription-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async payMonthlyCycle(id, paymentData = {}) {
    const res = await fetch(`${getBaseUrl()}/clients/${id}/monthly-cycle/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return await res.json();
  },

  async deleteClient(id) {
    const res = await fetch(`${getBaseUrl()}/clients/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Deliverables
  async getDeliverables(filters = {}) {
    const params = new URLSearchParams();
    if (filters.clientId) params.append('clientId', filters.clientId);
    if (filters.serviceType) params.append('serviceType', filters.serviceType);
    if (filters.status) params.append('status', filters.status);

    const res = await fetch(`${getBaseUrl()}/deliverables?${params.toString()}`);
    const data = await res.json();
    return data.data;
  },

  async createDeliverable(deliverable) {
    const res = await fetch(`${getBaseUrl()}/deliverables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deliverable)
    });
    return await res.json();
  },

  async updateDeliverable(id, updates) {
    const res = await fetch(`${getBaseUrl()}/deliverables/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteDeliverable(id) {
    const res = await fetch(`${getBaseUrl()}/deliverables/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Invoices
  async getInvoices() {
    const res = await fetch(`${getBaseUrl()}/invoices`);
    const data = await res.json();
    return data.data;
  },

  async createInvoice(invoice) {
    const res = await fetch(`${getBaseUrl()}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    return await res.json();
  },

  async updateInvoice(id, updates) {
    const res = await fetch(`${getBaseUrl()}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteInvoice(id) {
    const res = await fetch(`${getBaseUrl()}/invoices/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Quotations (عروض الأسعار)
  async getQuotations() {
    const res = await fetch(`${getBaseUrl()}/quotations`);
    const data = await res.json();
    return data.data;
  },

  async createQuotation(quotation) {
    const res = await fetch(`${getBaseUrl()}/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotation)
    });
    return await res.json();
  },

  async updateQuotation(id, updates) {
    const res = await fetch(`${getBaseUrl()}/quotations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteQuotation(id) {
    const res = await fetch(`${getBaseUrl()}/quotations/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  async convertQuotationToInvoice(id) {
    const res = await fetch(`${getBaseUrl()}/quotations/${id}/convert-to-invoice`, {
      method: 'POST'
    });
    return await res.json();
  },

  // Proposals / Pitch Decks (العروض التقديمية)
  async getProposals() {
    const res = await fetch(`${getBaseUrl()}/proposals`);
    const data = await res.json();
    return data.data;
  },

  async createProposal(proposal) {
    const res = await fetch(`${getBaseUrl()}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal)
    });
    return await res.json();
  },

  async updateProposal(id, updates) {
    const res = await fetch(`${getBaseUrl()}/proposals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deleteProposal(id) {
    const res = await fetch(`${getBaseUrl()}/proposals/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Payments
  async getPayments() {
    const res = await fetch(`${getBaseUrl()}/payments`);
    const data = await res.json();
    return data.data;
  },

  async createPayment(payment) {
    const res = await fetch(`${getBaseUrl()}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment)
    });
    return await res.json();
  },

  async deletePayment(id) {
    const res = await fetch(`${getBaseUrl()}/payments/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Financial Auditor Summary
  async getFinancialSummary() {
    const res = await fetch(`${getBaseUrl()}/financial-summary`);
    const data = await res.json();
    return data.data;
  },

  // Treasury & Cash Withdrawals (حركة الخزينة والمسحوبات والتسوية)
  async getTreasury() {
    const res = await fetch(`${getBaseUrl()}/treasury`);
    const data = await res.json();
    return data.data;
  },

  async createTreasuryTransaction(transaction) {
    const res = await fetch(`${getBaseUrl()}/treasury`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    return await res.json();
  },

  async resetTreasuryZero(data = {}) {
    const res = await fetch(`${getBaseUrl()}/treasury/reset-zero`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteTreasuryTransaction(id) {
    const res = await fetch(`${getBaseUrl()}/treasury/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Payment Methods (طرق الدفع)
  async getPaymentMethods() {
    const res = await fetch(`${getBaseUrl()}/payment-methods`);
    const data = await res.json();
    return data.data;
  },

  async createPaymentMethod(method) {
    const res = await fetch(`${getBaseUrl()}/payment-methods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(method)
    });
    return await res.json();
  },

  async updatePaymentMethod(id, updates) {
    const res = await fetch(`${getBaseUrl()}/payment-methods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  async deletePaymentMethod(id) {
    const res = await fetch(`${getBaseUrl()}/payment-methods/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Settings & DB
  async getSettings() {
    const res = await fetch(`${getBaseUrl()}/settings`);
    const data = await res.json();
    return data.data;
  },

  async updateSettings(settings) {
    const res = await fetch(`${getBaseUrl()}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  },

  async resetSampleData() {
    const res = await fetch(`${getBaseUrl()}/reset-sample`, {
      method: 'POST'
    });
    return await res.json();
  },

  async restoreData(data) {
    const res = await fetch(`${getBaseUrl()}/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    return await res.json();
  }
};
